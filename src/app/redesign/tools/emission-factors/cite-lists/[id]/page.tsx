/**
 * /redesign/tools/emission-factors/cite-lists/[id]
 *
 * Cite-list detail page. Shows all factors in the list with a
 * "Copy all citations" button that composes an APA block for the full set.
 */

import { auth } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
  LightSection,
  CategoryLabel,
  SectionHeading,
} from '@/components/redesign';
import {
  getCiteListById,
  getCiteListItems,
} from '@/lib/emission-factors/cite-lists';
import { loadResolvedFactors } from '@/lib/emission-factors/loader';
import { formatCitation } from '@/lib/emission-factors/citations';
import { CiteListCopyClient } from './_copy-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Cite list',
  robots: { index: false, follow: false },
};

export default async function CiteListDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const list = await getCiteListById(userId, params.id);
  if (!list) notFound();

  const items = await getCiteListItems(params.id);
  const all = loadResolvedFactors();
  const byId = new Map(all.map((f) => [f.id, f]));

  const resolved = items
    .map((it) => byId.get(it.factorId))
    .filter(Boolean) as typeof all;

  const citations = resolved.map((f) =>
    formatCitation(f, f.source, 'apa'),
  );

  return (
    <LightSection padding="lg" variant="pale">
      <div className="max-w-3xl">
        <Link
          href="/redesign/dashboard/emission-factors?tab=lists"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2D6A4F] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All cite lists
        </Link>
        <CategoryLabel className="mt-4">Cite list</CategoryLabel>
        <SectionHeading size="sub" className="mt-3">
          {list.name}
        </SectionHeading>
        <p className="mt-2 text-sm text-gt-text-muted">
          {resolved.length} factor{resolved.length === 1 ? '' : 's'}. Copy the whole
          block as a formatted bibliography.
        </p>

        <div className="mt-6">
          <CiteListCopyClient citations={citations} />
        </div>

        <ul className="mt-8 space-y-3">
          {resolved.map((f) => (
            <li
              key={f.id}
              className="rounded-2xl bg-white border border-gt-border-light p-4"
            >
              <div className="text-xs uppercase tracking-[0.08em] text-gt-text-dim">
                {f.source.publisher_short} {f.vintage_year}
              </div>
              <div className="mt-1 font-semibold text-gt-text">{f.activity}</div>
              <div className="text-sm text-gt-text-muted">{f.region_display}</div>
              <p className="mt-2 text-xs text-gt-text whitespace-pre-line font-mono">
                {formatCitation(f, f.source, 'apa')}
              </p>
              <Link
                href={`/redesign/tools/emission-factors/${f.slug}`}
                className="mt-3 inline-block text-xs font-semibold text-[#2D6A4F] hover:underline"
              >
                Open factor
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </LightSection>
  );
}
