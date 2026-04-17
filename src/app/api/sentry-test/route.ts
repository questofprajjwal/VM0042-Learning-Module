/**
 * Sentry smoke-test route.
 *
 * Hit GET /api/sentry-test to deliberately throw a server-side error
 * and confirm it lands in the Sentry dashboard. Remove this file once
 * Sentry is verified on production.
 */

export const dynamic = 'force-dynamic';

export async function GET() {
  throw new Error('Sentry smoke test — delete this route once verified.');
}
