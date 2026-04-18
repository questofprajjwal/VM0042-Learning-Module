import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';
import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  async headers() {
    // Baseline CSP. Permissive on script/connect/frame to accommodate Clerk,
    // GTM/GA, Sentry tunnel, Vercel, Turso, R2 audio, Spotify embeds, and
    // MDX/PDF workers. Tightens object-src, base-uri, form-action, frame-ancestors.
    // Applied in production only — Next dev uses ws:// HMR + eval'd workers
    // that a strict CSP rejects even with 'unsafe-eval'.
    const isProd = process.env.NODE_ENV === 'production';
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://clerk.greentryst.com https://*.clerk.com https://www.googletagmanager.com https://www.google-analytics.com https://*.ingest.sentry.io https://*.sentry.io https://va.vercel-scripts.com https://vercel.live",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "media-src 'self' blob: https://pub-033ee478bfa542229216e3781c99cb96.r2.dev",
      "connect-src 'self' https: wss:",
      "frame-src 'self' https://*.clerk.accounts.dev https://clerk.greentryst.com https://*.clerk.com https://open.spotify.com https://www.googletagmanager.com https://vercel.live",
      "worker-src 'self' blob:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      'upgrade-insecure-requests',
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          ...(isProd ? [{ key: 'Content-Security-Policy', value: csp }] : []),
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Legacy module landing URLs had no redesign equivalent; collapse to the
      // course overview, where the same modules are now surfaced inline.
      {
        source: '/courses/:courseId/modules/:moduleId',
        destination: '/courses/:courseId',
        permanent: true,
      },
      // Emission Factors moved out of the /tools/ namespace on 2026-04-17.
      // The tool is prominent enough to earn its own root URL; /tools stays
      // as the directory of current + future tools. Redirects preserve any
      // inbound links from the brief ~30-minute window the /tools URLs were
      // live in prod.
      {
        source: '/tools/emission-factors',
        destination: '/emission-factors',
        permanent: true,
      },
      {
        source: '/tools/emission-factors/:path*',
        destination: '/emission-factors/:path*',
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
});

const baseConfig = withMDX(nextConfig);

// Wrap with Sentry only when a DSN is configured, so local dev without
// a Sentry account still builds cleanly.
const sentryOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: '/monitoring',
  webpack: {
    treeshake: { removeDebugLogging: true },
    automaticVercelMonitors: true,
  },
};

export default process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
  ? withSentryConfig(baseConfig, sentryOptions)
  : baseConfig;
