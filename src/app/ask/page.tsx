/**
 * /redesign/ask - SustainIQ
 *
 * The SustainIQ surface is a real product page, not a content page.
 * Per the locked decision, it deliberately does NOT use a dark hero
 * band - it lands the user directly in the workspace. The page wraps
 * the redesigned client with the standard nav and footer chrome.
 *
 * The /api/ask SSE endpoint, the streaming protocol, and the
 * Source / LessonLink / Message data shapes are all preserved
 * unchanged from the production /ask client.
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Nav } from '@/components/Nav';
import {
  RedesignFooter,
} from '@/components/redesign';
import { AskClientRedesign } from './_components/AskClientRedesign';

export const metadata: Metadata = {
  title: 'SustainIQ',
  description:
    'Ask anything about sustainability frameworks, standards, and methodologies. Every answer is sourced to its primary document. No hallucinations, no plausible-sounding guesses.',
  alternates: { canonical: '/ask' },
  openGraph: {
    type: 'website',
    url: '/ask',
    title: 'SustainIQ',
    description:
      'Ask anything about sustainability frameworks. Every answer is sourced to its primary document.',
  },
};

export default function SustainIQPage() {
  return (
    <>
      <Nav />
      <Suspense
        fallback={
          <main className="min-h-[60vh] flex items-center justify-center">
            <h1 className="sr-only">SustainIQ</h1>
            <p className="text-[13px] text-gt-text-muted">Loading…</p>
          </main>
        }
      >
        <AskClientRedesign />
      </Suspense>
      <RedesignFooter />
    </>
  );
}
