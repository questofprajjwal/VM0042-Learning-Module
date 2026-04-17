/**
 * POST /api/resume/process  (internal, service-to-service)
 *
 * Background worker, invoked fire-and-forget from /api/resume/upload via
 * waitUntil. Runs the Docling parse → Voyage embed → Groq profile extract
 * pipeline and promotes the user_resumes row from 'uploading' → 'parsing'
 * → 'ready'.
 *
 * Auth: `Authorization: Bearer ${RESUME_PROCESS_TOKEN}`. This is a shared
 * secret between /upload and /process; there's no public path to this
 * route. NOT Clerk — this is internal.
 *
 * Idempotency: if the row is not in 'uploading' status, returns 409. A
 * retry after a previous successful run is therefore safe.
 *
 * Lifetime: maxDuration = 180 seconds. Docling on a cold HF container
 * can take ~90 s just to boot; once warm a parse is ~5-15 s.
 */

import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/lib/db';
import { userResumes } from '@/lib/schema';
import { getResume } from '@/lib/r2-resumes';
import { embedOne, EMBED_DIM } from '@/lib/voyage';
import { generate } from '@/lib/llm-governor';

export const runtime = 'nodejs';
export const maxDuration = 180;

const bodySchema = z.object({ userId: z.string().min(1) });

const EXTRACT_SYSTEM = `You extract structured profile data from a resume.

Return JSON in this exact shape:
{
  "skills": string[],
  "frameworks": string[],
  "seniority": "junior" | "mid" | "senior" | "lead" | "director" | null,
  "domains": string[]
}

HARD RULES — no exceptions:

1. EXTRACT ONLY WHAT IS IN THE RESUME. Every string you output must be
   a word or contiguous phrase that appears in the resume text. Do NOT
   add synonyms, adjacent concepts, industry-standard terms, or anything
   you think "should be" there based on the candidate's role.

2. DO NOT REPHRASE, TRANSLATE, EXPAND, ABBREVIATE, OR REWRITE. If the
   resume says "Net-Zero", output "Net-Zero" — not "net zero", not
   "decarbonization", not "Net Zero Emissions". Preserve the author's
   exact wording, spelling, punctuation, and casing.

3. DO NOT NORMALIZE TO LOWERCASE. Keep the casing as written.

4. Deduplicate only EXACT duplicates (byte-for-byte). "CSRD" and
   "Corporate Sustainability Reporting Directive" are NOT duplicates
   even if they refer to the same thing — include both only if both
   forms actually appear in the resume.

5. skills = concrete capabilities the candidate explicitly claims
   (typically under headings like "Skills", "Expertise", "Core
   Competencies", or in bullet points describing what they did).
   Skip generic soft skills ("communication", "teamwork") unless the
   resume itself lists them.

6. frameworks = standards, regulations, methodologies, or named
   protocols mentioned by name (e.g. the exact strings the resume
   uses, such as "CSRD", "SFDR", "IFRS S2", "GRI Standards").

7. seniority = ONE OF EXACTLY these five lowercase values:
   "junior" | "mid" | "senior" | "lead" | "director"
   (or null if titles are ambiguous or missing). Infer from stated titles
   and years of experience. This is the ONLY field where the casing must
   be lowercase - it is a controlled vocabulary, not free text.

8. domains = industries the candidate explicitly worked in, as the
   resume states them (e.g. "Banking", "Insurance", "Big 4
   consulting"). Do NOT add tangential industries.

9. Empty categories return an empty array [].

10. Cap counts: at most 40 skills, 25 frameworks, 10 domains.

11. OUTPUT: the JSON object ONLY. No prose, no explanation, no
    markdown fences, no preamble.`;

const profileSchema = z.object({
  skills: z.array(z.string()).max(60),
  frameworks: z.array(z.string()).max(40),
  seniority: z
    .enum(['junior', 'mid', 'senior', 'lead', 'director'])
    .nullable(),
  domains: z.array(z.string()).max(20),
});

function requireAuth(req: NextRequest): boolean {
  const expected = process.env.RESUME_PROCESS_TOKEN;
  if (!expected) {
    console.error('[resume/process] RESUME_PROCESS_TOKEN not set');
    return false;
  }
  const header = req.headers.get('authorization') ?? '';
  if (!header.startsWith('Bearer ')) return false;
  const token = header.slice(7).trim();
  // Constant-time-ish compare
  if (token.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < token.length; i++) {
    diff |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

async function markError(userId: string, message: string): Promise<void> {
  try {
    await db
      .update(userResumes)
      .set({ status: 'error', error: message })
      .where(eq(userResumes.userId, userId));
  } catch (err) {
    console.error('[resume/process] markError failed', err);
  }
}

export async function POST(req: NextRequest) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { userId } = parsed.data;

  // Fetch the row. If it's missing, the user DELETEd before we could
  // start. If it's not 'uploading', a retry is racing a previous run.
  const rows = await db
    .select()
    .from(userResumes)
    .where(eq(userResumes.userId, userId))
    .limit(1);
  const row = rows[0];
  if (!row) {
    return NextResponse.json({ error: 'no pending resume' }, { status: 404 });
  }
  if (row.status !== 'uploading') {
    return NextResponse.json(
      { error: 'row not in uploading state', status: row.status },
      { status: 409 },
    );
  }

  // Move to 'parsing' so the front-end poller shows progress.
  await db
    .update(userResumes)
    .set({ status: 'parsing' })
    .where(eq(userResumes.userId, userId));

  // ========================================================================
  // 1. Fetch bytes from R2
  // ========================================================================
  let fileBytes: Uint8Array;
  let contentType: string | null;
  try {
    const obj = await getResume(row.fileR2Key);
    fileBytes = obj.bytes;
    contentType = obj.contentType ?? row.mimeType;
  } catch (err) {
    console.error('[resume/process] R2 getResume failed', err);
    await markError(userId, "couldn't read uploaded file; please re-upload");
    return NextResponse.json({ ok: false, stage: 'r2' }, { status: 500 });
  }

  // ========================================================================
  // 2. Forward to the parser HF Space
  // ========================================================================
  const parserUrl = process.env.RESUME_PARSER_URL;
  const parserToken = process.env.RESUME_PARSER_TOKEN;
  if (!parserUrl || !parserToken) {
    console.error('[resume/process] parser env missing');
    await markError(userId, 'server misconfigured; please try again later');
    return NextResponse.json({ ok: false, stage: 'config' }, { status: 503 });
  }

  let extractedText: string;
  try {
    const form = new FormData();
    // Copy into a tight ArrayBuffer so TypeScript's Blob constructor accepts
    // it (Uint8Array<ArrayBufferLike> vs BlobPart mismatch on Node 22).
    const ab = new ArrayBuffer(fileBytes.byteLength);
    new Uint8Array(ab).set(fileBytes);
    const blob = new Blob([ab], {
      type: contentType ?? 'application/octet-stream',
    });
    form.append('file', blob, row.fileName);
    const resp = await fetch(`${parserUrl}/parse`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${parserToken}` },
      body: form,
    });
    if (!resp.ok) {
      const detail = await resp.text().catch(() => '');
      console.error(
        `[resume/process] parser returned ${resp.status}: ${detail.slice(0, 200)}`,
      );
      const userMsg =
        resp.status === 422
          ? "we couldn't read that resume. Try a different file or a cleaner PDF."
          : 'parsing failed; please try again';
      await markError(userId, userMsg);
      return NextResponse.json(
        { ok: false, stage: 'parse', upstream: resp.status },
        { status: 502 },
      );
    }
    const parsed = (await resp.json()) as {
      text?: string;
      char_count?: number;
    };
    extractedText = (parsed.text ?? '').trim();
    if (!extractedText) {
      await markError(
        userId,
        "we couldn't extract any text from that resume; try a different file",
      );
      return NextResponse.json({ ok: false, stage: 'parse-empty' }, { status: 502 });
    }
  } catch (err) {
    console.error('[resume/process] parser fetch failed', err);
    await markError(userId, 'parser unavailable; please try again later');
    return NextResponse.json({ ok: false, stage: 'parse' }, { status: 502 });
  }

  // ========================================================================
  // 3. Voyage embed (same model as job embeddings → cosine is meaningful)
  // ========================================================================
  let embedding: number[];
  try {
    embedding = await embedOne(extractedText, { inputType: 'document' });
    if (embedding.length !== EMBED_DIM) {
      throw new Error(`unexpected embedding dim ${embedding.length}`);
    }
  } catch (err) {
    console.error('[resume/process] Voyage embed failed', err);
    await markError(userId, 'embedding step failed; please try again');
    return NextResponse.json({ ok: false, stage: 'embed' }, { status: 502 });
  }

  // ========================================================================
  // 4. Groq extract profile via the LLM Governor
  // ========================================================================
  let profile: z.infer<typeof profileSchema>;
  try {
    const res = await generate({
      feature: 'resumeUpload',
      subject: userId,
      tier: 'free',
      temperature: 0.1,
      maxTokens: 800,
      messages: [
        { role: 'system', content: EXTRACT_SYSTEM },
        { role: 'user', content: extractedText.slice(0, 8000) },
      ],
      cacheKey: `resume-extract:${userId}:${row.fileR2Key}`,
    });
    if (res.status !== 'allowed') {
      // Could be cap-exceeded (unlikely since /upload already reserved)
      // or an error. Fall back to empty profile so the user still sees
      // semantic matches.
      console.warn('[resume/process] Governor returned', res.status);
      profile = { skills: [], frameworks: [], seniority: null, domains: [] };
    } else {
      const raw = res.text.trim();
      // LLMs sometimes wrap JSON in ```json fences — strip them.
      const jsonText = raw
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/, '')
        .trim();
      const maybeObj = JSON.parse(jsonText) as Record<string, unknown>;

      // Defensive field-by-field validation. If the LLM fumbles one
      // field (most commonly returns "Senior" title-case for seniority
      // instead of the controlled lowercase enum), we used to wipe the
      // ENTIRE profile which threw away perfectly good skills and
      // frameworks. Validate per-field and keep whatever passes.
      const asStringArray = (v: unknown, max: number): string[] =>
        Array.isArray(v)
          ? v
              .filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
              .slice(0, max)
          : [];

      const allowedSeniority = ['junior', 'mid', 'senior', 'lead', 'director'] as const;
      type Seniority = (typeof allowedSeniority)[number];
      const coerceSeniority = (v: unknown): Seniority | null => {
        if (typeof v !== 'string') return null;
        const s = v.trim().toLowerCase();
        if ((allowedSeniority as readonly string[]).includes(s)) return s as Seniority;
        // Graceful degrades: "senior manager" / "senior consultant" -> "senior", etc.
        for (const level of allowedSeniority) {
          if (s.includes(level)) return level;
        }
        return null;
      };

      profile = {
        skills: asStringArray(maybeObj.skills, 60),
        frameworks: asStringArray(maybeObj.frameworks, 40),
        seniority: coerceSeniority(maybeObj.seniority),
        domains: asStringArray(maybeObj.domains, 20),
      };
    }
  } catch (err) {
    console.error('[resume/process] Groq extract failed', err);
    // Still mark ready with a skeletal profile; semantic score alone is
    // useful and keyword scores just become zero.
    profile = { skills: [], frameworks: [], seniority: null, domains: [] };
  }

  // ========================================================================
  // 5. Persist and mark ready
  // ========================================================================
  try {
    await db
      .update(userResumes)
      .set({
        status: 'ready',
        extractedText,
        embedding: JSON.stringify(embedding),
        profile: JSON.stringify(profile),
        processedAt: new Date(),
        error: null,
      })
      .where(eq(userResumes.userId, userId));
  } catch (err) {
    console.error('[resume/process] final DB update failed', err);
    await markError(userId, 'saving results failed; please re-upload');
    return NextResponse.json({ ok: false, stage: 'persist' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, status: 'ready' });
}
