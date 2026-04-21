/**
 * /tools/supplier-sbti-tracker
 *
 * Free self-serve tool that matches a user-supplied supplier list
 * against the SBTi target dashboard snapshot. Upload only; nothing is
 * persisted in the application database.
 *
 * Layout: light-dominant Greentryst surface with two deep (gt-card-dark)
 * signature cards — hero + coverage donuts — as the only dark accents.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Upload,
  Database,
  FileSearch,
  MessageSquare,
  type LucideIcon,
} from 'lucide-react';
import { Nav } from '@/components/Nav';
import {
  CategoryLabel,
  LightSection,
  RedesignFooter,
  SectionHeading,
} from '@/components/redesign';
import { getDatasetMeta, getDatasetStats } from '@/lib/sbti-matcher';
import { TrackerClient } from './_components/TrackerClient';

export const metadata: Metadata = {
  title: 'Supplier SBTi Tracker',
  description:
    'Upload your supplier list and see which suppliers have science-based targets. Coverage by count and by spend. Free, attributed, no account required. For Scope 3 Category 1, CDP C6.5, CSRD E1, IFRS S2 disclosures.',
  alternates: { canonical: '/tools/supplier-sbti-tracker' },
  openGraph: {
    type: 'website',
    url: '/tools/supplier-sbti-tracker',
    title: 'Supplier SBTi Tracker',
    description:
      'Match your supplier list against 14,000+ SBTi-listed companies. Coverage by count and by spend.',
  },
  robots: { index: true, follow: true },
};

const monoLabel =
  'text-[10px] font-bold uppercase tracking-[0.22em] font-mono';

export default function SupplierSbtiTrackerPage() {
  const meta = getDatasetMeta();
  const stats = getDatasetStats();

  const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-gt-pale text-gt-text">
        {/* Ticker strip — quiet, factual dataset stats */}
        <div className="w-full bg-white border-y border-gt-border-light">
          <div className="max-w-[1440px] mx-auto px-6 py-2.5 flex flex-wrap items-center justify-center gap-x-10 gap-y-1 font-mono text-[10px] uppercase tracking-[0.2em] text-gt-text-dim">
            <span>{stats.total.toLocaleString()} companies indexed</span>
            <span className="text-gt-border-light">·</span>
            <span>snapshot {meta.snapshot_date}</span>
            <span className="text-gt-border-light">·</span>
            <span>{pct(stats.at_1p5_pct)} at 1.5&deg;C</span>
            <span className="text-gt-border-light">·</span>
            <span>{pct(stats.removed_pct)} commitments removed</span>
            <span className="text-gt-border-light">·</span>
            <span>{stats.countries} countries</span>
          </div>
        </div>

        {/* Signature hero: deep card with monument headline + upload */}
        <section className="max-w-[1440px] mx-auto px-6 sm:px-8 pt-10 pb-4">
          <nav className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-gt-text-dim mb-5">
            <Link href="/tools" className="hover:text-gt-medium">
              Tools
            </Link>
            <span>/</span>
            <span className="text-gt-text">Supplier SBTi Tracker</span>
          </nav>

          <div className="rounded-gt-card bg-gt-card-dark text-gt-text-on-dark overflow-hidden shadow-gt-card-lg">
            <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-0">
              {/* Left: narrative */}
              <div className="p-10 lg:p-14 flex flex-col justify-between">
                <div>
                  <span className={`${monoLabel} text-gt-mint`}>
                    Scope 3 · Supplier engagement
                  </span>
                  <h1 className="mt-5 text-[44px] sm:text-[56px] font-extrabold tracking-gt-tight leading-[1.03] text-white">
                    Your suppliers decide whether your targets hold.
                  </h1>
                  <p className="mt-6 text-[17px] leading-relaxed text-gt-text-on-dark-muted max-w-xl">
                    Match your supplier list against the Science Based Targets
                    dashboard. See coverage by count and by spend, identify
                    the suppliers you need to engage, and export a clean CSV
                    for CDP C6.5, CSRD E1, and IFRS S2 disclosures.
                  </p>
                </div>

                <div className="mt-10 flex flex-wrap gap-2">
                  <Chip label={`${stats.total.toLocaleString()} companies`} />
                  <Chip label={`snapshot ${meta.snapshot_date}`} />
                  <Chip label="free, no account required" />
                </div>

                <div className="mt-8">
                  <a
                    href="#tracker"
                    className="inline-flex items-center gap-2 rounded-xl bg-gt-leaf text-gt-text-dark px-6 py-3.5 text-sm font-bold hover:bg-gt-mint transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    Upload supplier list
                  </a>
                </div>
              </div>

              {/* Right: visual product-demo panel */}
              <div className="relative p-8 lg:p-10 bg-black/20 border-t lg:border-t-0 lg:border-l border-white/5 flex items-center justify-center">
                <div className="absolute inset-4 rounded-[20px] border border-white/5 pointer-events-none" />
                <HeroDemoPanel total={stats.total} snapshot={meta.snapshot_date} />
              </div>
            </div>
          </div>
        </section>

        {/* The actual tool */}
        <section id="tracker" className="max-w-[1440px] mx-auto px-6 sm:px-8 py-10 scroll-mt-20">
          <TrackerClient snapshotDate={meta.snapshot_date} />
        </section>

        {/* 2030 wall pull quote */}
        <LightSection padding="sm" variant="pale">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-8 flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-12 py-6">
            <div className={`${monoLabel} text-gt-medium shrink-0`}>
              The 2030 wall
            </div>
            <blockquote className="text-[24px] sm:text-[28px] leading-tight font-semibold tracking-gt-tight text-gt-text max-w-3xl">
              &ldquo;8,564 near-term targets come due by 2030. The suppliers
              behind those targets are the ones inside your scope 3
              inventory.&rdquo;
            </blockquote>
          </div>
        </LightSection>

        {/* How it works */}
        <LightSection padding="md">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
            <CategoryLabel>How it works</CategoryLabel>
            <SectionHeading size="sub" className="mt-2">
              Three steps from spreadsheet to engagement shortlist.
            </SectionHeading>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
              <StepCard
                step="01"
                Icon={Database}
                title="Upload"
                body="Drop a CSV or XLSX with a supplier name column. Optional: country, spend. Up to 1,000 rows per run."
              />
              <StepCard
                step="02"
                Icon={FileSearch}
                title="Match"
                body="Names are normalized (corporate suffixes stripped, aliases resolved) and matched against the SBTi dashboard. Each row gets a confidence label and near-term / net-zero status."
              />
              <StepCard
                step="03"
                Icon={MessageSquare}
                title="Engage"
                body="Download your results as CSV. Suppliers flagged as not listed, lapsed, or committed-only become your Scope 3 Category 1 engagement shortlist."
              />
            </div>
          </div>
        </LightSection>

        {/* Data schema */}
        <LightSection padding="md" variant="pale">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
            <CategoryLabel>What the data means</CategoryLabel>
            <SectionHeading size="sub" className="mt-2">
              Every field in your export, explained.
            </SectionHeading>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-0 bg-white rounded-gt-card shadow-gt-card p-4">
              {SCHEMA.map((row) => (
                <div
                  key={row.field}
                  className="flex items-start justify-between gap-6 px-4 py-3.5 border-b border-gt-border-light last:border-b-0 md:[&:nth-last-child(2)]:border-b-0"
                >
                  <code className="font-mono text-[12px] text-gt-medium shrink-0 pt-0.5">
                    {row.field}
                  </code>
                  <span className="text-[13px] text-gt-text-muted text-right leading-snug">
                    {row.meaning}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </LightSection>

        {/* Attribution + limitations */}
        <LightSection padding="md">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <CategoryLabel>About the data</CategoryLabel>
              <h3 className="mt-2 text-xl font-bold tracking-gt-tight">
                Attributed to the original source.
              </h3>
              <p className="mt-3 text-sm text-gt-text-muted leading-relaxed">
                Results are based on the SBTi target dashboard snapshot from{' '}
                <span className="font-mono text-gt-text">
                  {meta.snapshot_date}
                </span>{' '}
                ({meta.count.toLocaleString()} companies). Source:{' '}
                <a
                  href={meta.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-gt-medium hover:text-gt-dark"
                >
                  Science Based Targets initiative
                </a>
                . We do not store uploads in our application database. Your
                file is parsed in your browser, matched on our server, and
                the response is returned only to you.
              </p>
            </div>

            <div>
              <CategoryLabel>Known limitations</CategoryLabel>
              <h3 className="mt-2 text-xl font-bold tracking-gt-tight">
                What the matcher will and won&apos;t catch.
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-gt-text-muted">
                <li className="flex gap-3">
                  <span className="font-mono text-gt-text-dim mt-0.5">
                    01
                  </span>
                  <span>
                    Parent and subsidiary entities are matched by name only.
                    A subsidiary whose name differs from the group will not
                    match even if the parent has a validated target.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-gt-text-dim mt-0.5">
                    02
                  </span>
                  <span>
                    Private SMEs without ISIN or LEI are underrepresented in
                    the SBTi dataset; lists dominated by small local
                    suppliers will see lower match rates.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-gt-text-dim mt-0.5">
                    03
                  </span>
                  <span>
                    The snapshot is updated when we refresh. For real-time
                    status, cross-check at the SBTi target dashboard
                    directly.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </LightSection>
      </main>
      <RedesignFooter />
    </>
  );
}

function HeroDemoPanel({
  total,
  snapshot,
}: {
  total: number;
  snapshot: string;
}) {
  // Static visual preview of the tool output — not interactive, purely
  // illustrative. The real upload zone lives below in TrackerClient.
  return (
    <div className="w-full rounded-xl bg-gt-card-dark-alt border border-white/5 p-5 shadow-gt-card-lg">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gt-mint">
          Coverage by spend
        </span>
        <span className="font-mono text-[10px] text-gt-text-on-dark-muted/50">
          sample
        </span>
      </div>

      <div className="mt-4 flex items-center gap-5">
        <svg width="110" height="110" viewBox="0 0 110 110" aria-hidden>
          <circle cx="55" cy="55" r="42" fill="none" stroke="#2d2d35" strokeWidth="14" />
          <circle
            cx="55"
            cy="55"
            r="42"
            fill="none"
            stroke="#52B788"
            strokeWidth="14"
            strokeDasharray="210 264"
            strokeDashoffset="0"
            transform="rotate(-90 55 55)"
          />
          <circle
            cx="55"
            cy="55"
            r="42"
            fill="none"
            stroke="#95D5B2"
            strokeWidth="14"
            strokeDasharray="35 264"
            strokeDashoffset="-210"
            transform="rotate(-90 55 55)"
          />
        </svg>
        <div>
          <div className="text-[32px] font-extrabold tracking-gt-tight text-white leading-none">
            78.3%
          </div>
          <div className="mt-1 font-mono text-[11px] text-gt-text-on-dark-muted">
            $4.2M of $5.3M on SBTi
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <LegendRow color="#52B788" label="Confirmed 1.5°C" value="$3.1M" />
        <LegendRow color="#95D5B2" label="Confirmed WB2°C" value="$1.1M" />
        <LegendRow color="#40916C" label="Committed" value="$0.5M" muted />
        <LegendRow color="#b88c52" label="Lapsed" value="$0.2M" muted />
        <LegendRow color="#6B7870" label="Not listed" value="$0.4M" muted />
      </div>

      <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between font-mono text-[10px] text-gt-text-on-dark-muted/60">
        <span>{total.toLocaleString()} in dataset</span>
        <span>{snapshot}</span>
      </div>
    </div>
  );
}

function LegendRow({
  color,
  label,
  value,
  muted,
}: {
  color: string;
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between text-[12px] ${
        muted ? 'text-gt-text-on-dark-muted/70' : 'text-gt-text-on-dark'
      }`}
    >
      <span className="flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-sm shrink-0"
          style={{ backgroundColor: color }}
        />
        {label}
      </span>
      <span className="font-mono text-gt-text-on-dark-muted">{value}</span>
    </div>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] text-gt-text-on-dark-muted">
      {label}
    </span>
  );
}

function StepCard({
  step,
  Icon,
  title,
  body,
}: {
  step: string;
  Icon: LucideIcon;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-gt-card bg-white p-6 shadow-gt-card">
      <div className="flex items-center justify-between">
        <div className="h-10 w-10 rounded-xl bg-gt-medium/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-gt-medium" strokeWidth={2} />
        </div>
        <span className="font-mono text-[11px] text-gt-text-dim">{step}</span>
      </div>
      <h4 className="mt-5 text-lg font-bold tracking-gt-tight">{title}</h4>
      <p className="mt-2 text-sm text-gt-text-muted leading-relaxed">{body}</p>
    </div>
  );
}

const SCHEMA = [
  {
    field: 'match_status',
    meaning:
      'How confident we are the supplier and SBTi record are the same entity. confirmed / likely / none.',
  },
  {
    field: 'sbti_status',
    meaning:
      'SBTi program state of the matched company. targets_set / committed / removed / null.',
  },
  {
    field: 'target_class',
    meaning:
      'Ambition of the validated near-term target. 1.5C / WB2C / 2C / other.',
  },
  {
    field: 'bucket',
    meaning:
      'Derived summary bucket used in the coverage donut and aggregate counts.',
  },
  {
    field: 'nt_year',
    meaning:
      'Near-term target year as filed with SBTi. Can be calendar or fiscal year (FY).',
  },
  {
    field: 'nz_status',
    meaning:
      'Net-zero commitment state. Tracked separately from the near-term target.',
  },
  {
    field: 'nz_year',
    meaning:
      'Net-zero target year. Typically 2040 or 2050 for validated targets.',
  },
  {
    field: 'org_type',
    meaning:
      'Corporate, SME, or Financial Institution. SMEs follow a streamlined SBTi route.',
  },
];
