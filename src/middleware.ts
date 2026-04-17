import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/redesign/dashboard/emission-factors(.*)',
  '/api/progress(.*)',
  '/api/activity(.*)',
  '/api/emission-factors/saved(.*)',
  '/api/emission-factors/cite-lists(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Sentry's tunnel route so error reports bypass Clerk auth.
    '/((?!_next|monitoring|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
