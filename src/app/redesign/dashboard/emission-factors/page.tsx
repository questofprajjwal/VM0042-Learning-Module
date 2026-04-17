/**
 * /redesign/dashboard/emission-factors
 *
 * Signed-in dashboard tile for the Emission Factors product. Three tabs:
 * Saved, Cite Lists, Recent Searches. Auth-protected by middleware.
 */

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Bookmark, FileStack, History, ArrowRight } from 'lucide-react';
import { Nav } from '@/components/Nav';
import {
  RedesignFooter,
  LightSection,
  CategoryLabel,
  SectionHeading,
} from '@/components/redesign';
import {
  listSavedFactors,
  listRecentSearches,
} from '@/lib/emission-factors/saved';
import { listUserCiteLists } from '@/lib/emission-factors/cite-lists';
import { loadResolvedFactors } from '@/lib/emission-factors/loader';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Emission Factors - Dashboard',
  description: 'Your saved emission factors, cite lists, and recent searches.',
  robots: { index: false, follow: false },
};

export default async function EfDashboardPage({
  searchParams,
}: {
  searchParams?: { tab?: string };
}) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in?redirect=/redesign/dashboard/emission-factors');

  const activeTab: 'saved' | 'lists' | 'searches' =
    searchParams?.tab === 'lists'
      ? 'lists'
      : searchParams?.tab === 'searches'
      ? 'searches'
      : 'saved';

  const [saved, lists, searches] = await Promise.all([
    listSavedFactors(userId),
    listUserCiteLists(userId),
    listRecentSearches(userId, 20),
  ]);

  const allFactors = loadResolvedFactors();
  const bySlugOrId = new Map<string, (typeof allFactors)[number]>();
  for (const f of allFactors) {
    bySlugOrId.set(f.id, f);
    bySlugOrId.set(f.slug, f);
  }

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-gt-pale text-gt-text">
        <LightSection padding="lg" variant="pale">
          <div className="max-w-3xl">
            <CategoryLabel>Dashboard - Emission Factors</CategoryLabel>
            <SectionHeading size="sub" className="mt-3">
              Your emission factor library
            </SectionHeading>
            <p className="mt-3 text-gt-text-muted">
              Save factors as you work, group them into cite lists per report, and
              copy formatted citations in one click.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-2 border-b border-gt-border-light">
            <TabLink label="Saved" href="?tab=saved" active={activeTab === 'saved'} icon={<Bookmark className="h-4 w-4" />} />
            <TabLink label="Cite lists" href="?tab=lists" active={activeTab === 'lists'} icon={<FileStack className="h-4 w-4" />} />
            <TabLink label="Recent searches" href="?tab=searches" active={activeTab === 'searches'} icon={<History className="h-4 w-4" />} />
          </div>

          <div className="mt-6">
            {activeTab === 'saved' && (
              <SavedTab
                saved={saved.map((s) => ({
                  factorId: s.factorId,
                  savedAt: s.savedAt,
                  folder: s.folder ?? null,
                  factor: bySlugOrId.get(s.factorId) ?? null,
                }))}
              />
            )}
            {activeTab === 'lists' && <ListsTab lists={lists} />}
            {activeTab === 'searches' && <SearchesTab searches={searches} />}
          </div>
        </LightSection>
      </main>
      <RedesignFooter />
    </>
  );
}

function TabLink({
  label,
  href,
  active,
  icon,
}: {
  label: string;
  href: string;
  active: boolean;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
        active
          ? 'border-[#005c55] text-[#005c55]'
          : 'border-transparent text-gt-text-muted hover:text-[#005c55]'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

function SavedTab({
  saved,
}: {
  saved: {
    factorId: string;
    savedAt: Date;
    folder: string | null;
    factor: ReturnType<typeof loadResolvedFactors>[number] | null;
  }[];
}) {
  if (saved.length === 0) {
    return (
      <EmptyState
        title="No saved factors yet"
        body="Star a factor from any factor page to pin it here."
        ctaHref="/redesign/tools/emission-factors"
        ctaLabel="Browse factors"
      />
    );
  }
  return (
    <ul className="space-y-3">
      {saved.map((s) => (
        <li
          key={s.factorId}
          className="rounded-2xl bg-white border border-gt-border-light shadow-gt-card p-5 flex items-start justify-between gap-4"
        >
          <div>
            <div className="text-xs uppercase tracking-[0.08em] text-gt-text-dim">
              {s.factor?.source.publisher_short ?? '-'}{' '}
              {s.factor?.vintage_year ?? ''}
            </div>
            <div className="mt-1 font-semibold text-gt-text">
              {s.factor?.activity ?? s.factorId}
            </div>
            <div className="mt-1 text-sm text-gt-text-muted">
              {s.factor?.region_display ?? ''}
            </div>
          </div>
          {s.factor && (
            <Link
              href={`/redesign/tools/emission-factors/${s.factor.slug}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#005c55] hover:underline"
            >
              Open <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

function ListsTab({
  lists,
}: {
  lists: { id: string; name: string; updatedAt: Date }[];
}) {
  if (lists.length === 0) {
    return (
      <EmptyState
        title="No cite lists yet"
        body="Cite lists group factors for a specific report. Add factors while browsing, then export a formatted bibliography."
        ctaHref="/redesign/tools/emission-factors"
        ctaLabel="Browse factors"
      />
    );
  }
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {lists.map((l) => (
        <li
          key={l.id}
          className="rounded-2xl bg-white border border-gt-border-light shadow-gt-card p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-semibold text-gt-text">{l.name}</div>
              <div className="mt-1 text-xs text-gt-text-dim">
                Updated {new Date(l.updatedAt).toISOString().slice(0, 10)}
              </div>
            </div>
            <Link
              href={`/redesign/tools/emission-factors/cite-lists/${l.id}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#005c55] hover:underline"
            >
              Open <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}

function SearchesTab({
  searches,
}: {
  searches: { query: string; searchedAt: Date }[];
}) {
  if (searches.length === 0) {
    return (
      <EmptyState
        title="No searches yet"
        body="Your recent queries will appear here so you can resume quickly."
        ctaHref="/redesign/tools/emission-factors/search"
        ctaLabel="Start searching"
      />
    );
  }
  return (
    <ul className="space-y-2">
      {searches.map((s, i) => (
        <li
          key={i}
          className="rounded-xl bg-white border border-gt-border-light p-3 flex items-center justify-between gap-3"
        >
          <Link
            href={`/redesign/tools/emission-factors/search?q=${encodeURIComponent(
              s.query,
            )}`}
            className="text-sm font-medium text-[#005c55] hover:underline truncate"
          >
            {s.query}
          </Link>
          <span className="text-xs text-gt-text-dim">
            {new Date(s.searchedAt).toISOString().slice(0, 10)}
          </span>
        </li>
      ))}
    </ul>
  );
}

function EmptyState({
  title,
  body,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  body: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <div className="rounded-2xl bg-white border border-gt-border-light shadow-gt-card p-10 text-center">
      <div className="font-semibold text-gt-text">{title}</div>
      <p className="mt-2 text-sm text-gt-text-muted">{body}</p>
      <Link
        href={ctaHref}
        className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#005c55] text-white text-sm font-semibold px-4 py-2"
      >
        {ctaLabel}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  );
}
