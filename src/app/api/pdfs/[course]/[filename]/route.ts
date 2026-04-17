import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// Streams a PDF file from src/content/<course>/sources/<filename>
// ---------------------------------------------------------------------------

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ course: string; filename: string }>;
}

export async function GET(req: NextRequest, ctx: RouteContext) {
  const { course, filename } = await ctx.params;

  // Sanitize - prevent directory traversal
  if (
    course.includes("..") || course.includes("/") || course.includes("\\") ||
    filename.includes("..") || filename.includes("/") || filename.includes("\\")
  ) {
    return new Response("Invalid path", { status: 400 });
  }

  const decoded = decodeURIComponent(filename);
  const fullPath = path.join(process.cwd(), "src/content", course, "sources", decoded);

  if (!fs.existsSync(fullPath)) {
    return new Response(`Not found: ${decoded}`, { status: 404 });
  }

  const stat = fs.statSync(fullPath);
  const range = req.headers.get("range");

  if (range) {
    // Serve byte range (browser PDF viewers request partial content)
    const match = range.match(/bytes=(\d+)-(\d*)/);
    if (match) {
      const start = parseInt(match[1], 10);
      const end = match[2] ? parseInt(match[2], 10) : stat.size - 1;
      const chunkSize = end - start + 1;
      const buffer = Buffer.alloc(chunkSize);

      const fd = fs.openSync(fullPath, "r");
      fs.readSync(fd, buffer, 0, chunkSize, start);
      fs.closeSync(fd);

      return new Response(buffer as unknown as BodyInit, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${stat.size}`,
          "Accept-Ranges": "bytes",
          "Content-Length": String(chunkSize),
          "Content-Type": "application/pdf",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }
  }

  const buffer = fs.readFileSync(fullPath);
  return new Response(buffer as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(stat.size),
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=3600",
      "Content-Disposition": `inline; filename="${decoded}"`,
    },
  });
}
