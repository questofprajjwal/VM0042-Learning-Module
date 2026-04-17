import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';
import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  async redirects() {
    return [
      // Legacy module landing URLs had no redesign equivalent; collapse to the
      // course overview, where the same modules are now surfaced inline.
      {
        source: '/courses/:courseId/modules/:moduleId',
        destination: '/courses/:courseId',
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
