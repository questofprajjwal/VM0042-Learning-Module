/**
 * Simple per-IP rate limiter for public POST endpoints.
 *
 * In-memory, so it resets on cold starts and does not span Vercel
 * instances. Good enough to block naive loop attacks on low-traffic
 * endpoints (feedback, enquiry, issue reports); not a substitute for
 * a durable limiter. Swap in Upstash or a Turso-backed counter when
 * an endpoint starts seeing real abuse.
 *
 * Buckets are namespaced by `key` so different endpoints don't share
 * counters.
 */

interface RateBucket {
  count: number;
  resetAt: number;
}

const BUCKETS = new Map<string, RateBucket>();

export function rateLimit(
  key: string,
  ip: string,
  limit: number,
  windowMs: number,
): { ok: boolean; retryAfterMs?: number } {
  const bucketKey = `${key}|${ip}`;
  const now = Date.now();
  const existing = BUCKETS.get(bucketKey);
  if (!existing || existing.resetAt < now) {
    BUCKETS.set(bucketKey, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  if (existing.count >= limit) {
    return { ok: false, retryAfterMs: existing.resetAt - now };
  }
  existing.count += 1;
  return { ok: true };
}

export function ipFromRequest(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}
