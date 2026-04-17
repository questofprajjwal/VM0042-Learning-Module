import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// Resolves a doc_title from a citation to a streamable PDF URL.
//
// Citations look like: "VM0042v2.2", "Verra VCS Standard v4.7", etc.
// We map these to actual files under src/content/<course>/sources/<file>.pdf
// using the Docling catalog at data/page-indexes-docling-test/catalog.json
//
// GET /api/pdfs/resolve?doc=VM0042v2.2
//   -> { url: "/api/pdfs/vm0042/VM0042v2.2.pdf", page: 1, available: true }
// ---------------------------------------------------------------------------

interface CatalogDoc {
  id: string;
  file: string;
  title: string;
  course: string;
  total_pages: number;
}

const CATALOG_PATH = path.join(
  process.cwd(),
  "data/page-indexes-docling-test/catalog.json"
);

// Cloudflare R2 public URL for the greentryst-pdfs bucket.
// Set PDF_R2_BASE_URL in .env.local to override (for staging/prod).
const PDF_R2_BASE =
  process.env.PDF_R2_BASE_URL || "https://pub-4cc1b87074b84e1c8f4bdb7e6a646c27.r2.dev";

let CATALOG_CACHE: CatalogDoc[] | null = null;

function loadCatalog(): CatalogDoc[] {
  if (CATALOG_CACHE) return CATALOG_CACHE;
  if (!fs.existsSync(CATALOG_PATH)) return [];
  const raw = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf-8"));
  CATALOG_CACHE = raw.documents || [];
  return CATALOG_CACHE!;
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** Find catalog entry matching doc_title; tolerant of formatting differences. */
function findDoc(docTitle: string): CatalogDoc | null {
  const catalog = loadCatalog();
  const target = normalize(docTitle);

  // Exact title match first
  const exact = catalog.find((d) => normalize(d.title) === target);
  if (exact) return exact;

  // Substring match (citation may be truncated)
  const sub = catalog.find(
    (d) => normalize(d.title).includes(target) || target.includes(normalize(d.title))
  );
  if (sub) return sub;

  // Try matching the file stem
  const byFile = catalog.find((d) => normalize(d.file.split("/").pop()!.replace(".json", "")) === target);
  if (byFile) return byFile;

  return null;
}

/** Find the actual PDF file for a catalog entry. */
function findPdfPath(doc: CatalogDoc): string | null {
  // Catalog file path is e.g. "vm0042/VM0042v2.2.json"
  // PDF lives at src/content/<course>/sources/<stem>.pdf
  const stem = doc.file.split("/").pop()!.replace(".json", "");
  const sourcesDir = path.join(process.cwd(), "src/content", doc.course, "sources");

  if (!fs.existsSync(sourcesDir)) return null;

  // Try exact stem first
  const direct = path.join(sourcesDir, `${stem}.pdf`);
  if (fs.existsSync(direct)) return direct;

  // Try fuzzy match within the sources dir
  const files = fs.readdirSync(sourcesDir).filter((f) => f.toLowerCase().endsWith(".pdf"));
  const targetStem = normalize(stem);
  const fuzzy = files.find((f) => normalize(f.replace(/\.pdf$/i, "")) === targetStem);
  if (fuzzy) return path.join(sourcesDir, fuzzy);

  // Try contains match
  const contains = files.find((f) => {
    const fn = normalize(f.replace(/\.pdf$/i, ""));
    return fn.includes(targetStem) || targetStem.includes(fn);
  });
  if (contains) return path.join(sourcesDir, contains);

  return null;
}

export async function GET(req: NextRequest) {
  const docTitle = req.nextUrl.searchParams.get("doc");
  const pageRaw = req.nextUrl.searchParams.get("page") || "1";

  if (!docTitle) {
    return Response.json({ error: "doc parameter is required" }, { status: 400 });
  }

  const doc = findDoc(docTitle);
  if (!doc) {
    return Response.json({
      available: false,
      reason: "no_catalog_match",
      query: docTitle,
    });
  }

  const pdfPath = findPdfPath(doc);
  if (!pdfPath) {
    return Response.json({
      available: false,
      reason: "pdf_not_found_on_disk",
      doc_id: doc.id,
      course: doc.course,
    });
  }

  // Parse page (handle "14-15" -> 14, "14‑17" en-dash -> 14)
  const firstPageMatch = pageRaw.match(/(\d+)/);
  const page = firstPageMatch ? parseInt(firstPageMatch[1], 10) : 1;

  // Prefer R2 public URL - browsers stream PDF bytes directly from Cloudflare,
  // not through our Next.js or Python server. Keep /api/pdfs/... as fallback.
  const filename = path.basename(pdfPath);
  const r2Url = `${PDF_R2_BASE}/${doc.course}/${encodeURIComponent(filename)}`;
  const localUrl = `/api/pdfs/${doc.course}/${encodeURIComponent(filename)}`;

  return Response.json({
    available: true,
    url: r2Url,
    fallback_url: localUrl,
    page,
    doc_title: doc.title,
    course: doc.course,
    total_pages: doc.total_pages,
  });
}
