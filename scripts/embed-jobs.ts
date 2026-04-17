/**
 * embed-jobs.ts
 *
 * Pre-compute Voyage embeddings for every job on the board and write them
 * to `public/jobs-embeddings.json`. The resume matcher cosine-matches a
 * user's resume vector against this file at query time.
 *
 * Runs in the prebuild step (see package.json) so every Vercel deploy
 * regenerates the file against the current jobs.xlsx. Also runnable
 * manually via:
 *
 *   npx tsx scripts/embed-jobs.ts
 *
 * Cost: ~400 jobs * ~800 tokens/job ≈ 320k tokens on voyage-3-large.
 * Voyage free tier is 200M tokens/model - a rounding error.
 *
 * Shape of the output file:
 *
 *   {
 *     "model": "voyage-3-large",
 *     "dim": 1024,
 *     "generated_at": "2026-04-17T...",
 *     "job_count": 412,
 *     "embeddings": {
 *       "<jobUrl>": [ ...1024 floats... ],
 *       ...
 *     }
 *   }
 */

import fs from "node:fs";
import path from "node:path";

// Load .env.local so VOYAGE_API_KEY is available when running locally.
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (!process.env[key]) {
      process.env[key] = rest.join("=");
    }
  }
}

import { getAllJobsFull, type JobRow } from "../src/lib/jobs";
import { embedTexts, EMBED_MODEL, EMBED_DIM } from "../src/lib/voyage";

const OUT_PATH = path.join(process.cwd(), "public", "jobs-embeddings.json");
const BATCH_SIZE = 32; // well under Voyage's 128-input cap, easier on the network
const MAX_CHARS = 6000; // clipping is fine; the long tail of JDs is boilerplate

interface OutputFile {
  model: string;
  dim: number;
  generated_at: string;
  job_count: number;
  embeddings: Record<string, number[]>;
}

function buildJobText(job: JobRow): string {
  // We don't have full JDs; concat the three detail fields we do have.
  // Title/company get included so single-line jobs still get signal.
  const parts = [
    `Title: ${job.title}`,
    `Company: ${job.company}`,
    job.location ? `Location: ${job.location}` : null,
    job.roleSummary ? `Role: ${job.roleSummary}` : null,
    job.skillsRequired ? `Skills: ${job.skillsRequired}` : null,
    job.domainContext ? `Domain: ${job.domainContext}` : null,
  ].filter((v): v is string => Boolean(v));
  return parts.join("\n\n").slice(0, MAX_CHARS);
}

async function main() {
  if (!process.env.VOYAGE_API_KEY) {
    console.error(
      "VOYAGE_API_KEY is not set. Add it to .env.local or the environment."
    );
    process.exit(1);
  }

  const jobs = getAllJobsFull();
  if (jobs.length === 0) {
    console.error(
      "No jobs loaded from src/jobs/jobs.xlsx - nothing to embed."
    );
    process.exit(1);
  }

  // Deduplicate by jobUrl. Keep the first occurrence.
  const seen = new Set<string>();
  const uniqueJobs: JobRow[] = [];
  for (const j of jobs) {
    if (seen.has(j.jobUrl)) continue;
    seen.add(j.jobUrl);
    uniqueJobs.push(j);
  }

  console.log(
    `[embed-jobs] ${uniqueJobs.length} unique jobs (from ${jobs.length} rows)`
  );
  console.log(`[embed-jobs] model=${EMBED_MODEL} dim=${EMBED_DIM}`);

  const embeddings: Record<string, number[]> = {};
  let totalTokens = 0;

  const t0 = Date.now();
  for (let i = 0; i < uniqueJobs.length; i += BATCH_SIZE) {
    const batch = uniqueJobs.slice(i, i + BATCH_SIZE);
    const texts = batch.map(buildJobText);

    process.stdout.write(
      `  batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(uniqueJobs.length / BATCH_SIZE)} (${batch.length} jobs) ... `
    );

    try {
      const { vectors, totalTokens: t } = await embedTexts(texts, {
        inputType: "document",
        maxChars: MAX_CHARS,
      });
      if (vectors.length !== batch.length) {
        throw new Error(
          `got ${vectors.length} vectors for ${batch.length} inputs`
        );
      }
      for (let j = 0; j < batch.length; j++) {
        embeddings[batch[j].jobUrl] = vectors[j];
      }
      if (typeof t === "number") totalTokens += t;
      process.stdout.write("ok\n");
    } catch (err) {
      process.stdout.write("FAILED\n");
      console.error(
        `[embed-jobs] batch starting at ${i} failed:`,
        err instanceof Error ? err.message : err
      );
      process.exit(1);
    }
  }

  const output: OutputFile = {
    model: EMBED_MODEL,
    dim: EMBED_DIM,
    generated_at: new Date().toISOString(),
    job_count: Object.keys(embeddings).length,
    embeddings,
  };

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(output));

  const elapsedMs = Date.now() - t0;
  const sizeBytes = fs.statSync(OUT_PATH).size;
  const sizeMB = (sizeBytes / 1024 / 1024).toFixed(2);

  console.log(
    `[embed-jobs] wrote ${output.job_count} embeddings to ${OUT_PATH} (${sizeMB} MB)`
  );
  console.log(
    `[embed-jobs] ${elapsedMs} ms, ~${totalTokens} tokens used`
  );
}

main().catch((err) => {
  console.error("[embed-jobs] fatal:", err);
  process.exit(1);
});
