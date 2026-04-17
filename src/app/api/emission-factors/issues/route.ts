/**
 * POST /api/emission-factors/issues
 *
 * Public endpoint for reporting an issue with a factor. Inserts into
 * ef_issue_reports after validating the factor exists.
 *
 * Rate limit: 5/hour per IP via an in-memory Map. This is deliberately
 * weak for v1 - it resets on serverless cold starts. Production should
 * move to Upstash / KV / Turso-backed counters before public launch.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { db } from '@/lib/db';
import { efIssueReports } from '@/lib/schema';
import { getResolvedFactorBySlug } from '@/lib/emission-factors/loader';
import { loadAllFactors } from '@/lib/emission-factors/loader';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BodySchema = z.object({
  factorId: z.string().min(1).max(200),
  description: z.string().min(5).max(5000),
  reporterEmail: z.string().email().max(320).optional(),
  // Backwards-compat: EFIssueReportButton posts `email`.
  email: z.string().email().max(320).optional(),
});

type RateBucket = { count: number; resetAt: number };
const BUCKETS = new Map<string, RateBucket>();
const LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;

function rateLimit(ip: string): { ok: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const existing = BUCKETS.get(ip);
  if (!existing || existing.resetAt < now) {
    BUCKETS.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }
  if (existing.count >= LIMIT) {
    return { ok: false, retryAfterMs: existing.resetAt - now };
  }
  existing.count += 1;
  return { ok: true };
}

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  const gate = rateLimit(ip);
  if (!gate.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Too many reports. Please try again later.',
        retryAfterMs: gate.retryAfterMs,
      },
      { status: 429 },
    );
  }

  let parsed;
  try {
    const body = await request.json();
    parsed = BodySchema.safeParse(body);
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Malformed JSON body' },
      { status: 400 },
    );
  }

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Invalid input', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { factorId, description } = parsed.data;
  const reporterEmail = parsed.data.reporterEmail ?? parsed.data.email ?? null;

  // Verify factor exists. The factorId can be either a YAML id or a slug;
  // accept both so the component may pass either.
  const all = loadAllFactors();
  const bySlug = getResolvedFactorBySlug(factorId);
  const exists = bySlug || all.some((f) => f.id === factorId);
  if (!exists) {
    return NextResponse.json(
      { ok: false, error: 'Unknown factorId' },
      { status: 400 },
    );
  }

  const id = nanoid();
  try {
    await db.insert(efIssueReports).values({
      id,
      factorId: bySlug?.id ?? factorId,
      reporterEmail,
      description,
      status: 'open',
    });
  } catch (err) {
    console.error('[api/ef/issues] insert failed', err);
    return NextResponse.json(
      { ok: false, error: 'Could not store report. Please try again.' },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, id }, { status: 201 });
}
