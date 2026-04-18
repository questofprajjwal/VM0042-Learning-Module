import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';
import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  async headers() {
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
