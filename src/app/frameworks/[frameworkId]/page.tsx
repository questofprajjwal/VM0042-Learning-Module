/**
 * /frameworks/[frameworkId] — framework overview page.
 *
 * Renders framework identity (issuer, type, status, effective date,
 * jurisdictions), the long-form summary, pillar cards, and cross-links
 * to the matching Greentryst course. Pillar cards route through to the
 * pillar page only when `status: live`.
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowLeft,
  Clock,
  CheckCircle2,
  BookOpen,
  Scale,
  Globe,
  Calendar,
} from 'lucide-react';
import { Nav } from '@/components/Nav';
import { RedesignFooter } from '@/components/redesign';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbList, SITE_URL, ORG_ID } from '@/lib/seo/schema';
import {
  getFramework,
  getFrameworkStaticParams,
  type PillarMeta,
} from '@/lib/frameworks';
import { getCourse } from '@/lib/courses';

export const dynamicParams = false;

export function generateStaticParams() {
  return getFrameworkStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: { frameworkId: string };
}): Promise<Metadata> {
  const fw = getFramework(params.frameworkId);
  if (!fw) return { title: 'Framework not found' };
  return {
    title: fw.name,
    description: fw.summary.replace(/\s+/g, ' ').trim().slice(0, 160),
    alternates: { canonical: `/frameworks/${fw.id}` },
  };
}

export default function FrameworkOverviewPage({
  params,
}: {
  params: { frameworkId: string };
}) {
  const fw = getFramework(params.frameworkId);
  if (!fw) notFound();

  const livePillarCount = fw.pillars.filter((p) => p.status === 'live').length;
  const liveDisclosureCount = fw.disclosures.length;

  const relatedCourses = fw.related_courses
    .map((id) => {
      try {
        return getCourse(id);
      } catch {
        return null;
      }
    })
    .filter((c): c is NonNullable<typeof c> => c !== null);

  const overviewLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${SITE_URL}/frameworks/${fw.id}#framework`,
    url: `${SITE_URL}/frameworks/${fw.id}`,
    name: fw.name,
    alternateName: fw.short_name,
    description: fw.summary.replace(/\s+/g, ' ').trim(),
    creator: {
      '@type': 'Organization',
      name: fw.issuer,
    },
    publisher: { '@id': ORG_ID },
    inLanguage: 'en',
    isBasedOn: fw.issuer,
    about: fw.pillars.map((p) => ({ '@type': 'Thing', name: p.name })),
  };

  return (
    <>
      <JsonLd data={overviewLd} />
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', url: '/' },
          { name: 'Frameworks', url: '/frameworks' },
          { name: fw.short_name },
        ])}
      />
      <Nav />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gt-text-dark pt-32 pb-16">
        <div
          className="gt-ambient-glow-dark absolute -top-20 right-1/4 w-[600px] h-[600px] rounded-full"
          aria-hidden
        />
        <div
          className="gt-dot-grid absolute inset-0 opacity-40 pointer-events-none"
          aria-hidden
        />
        <div className="relative z-10 max-w-[1100px] mx-auto px-8">
          <Link
            href="/frameworks"
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase text-gt-leaf/80 hover:text-gt-leaf mb-6"
            style={{ letterSpacing: '0.22em' }}
          >
            <ArrowLeft className="w-3 h-3" strokeWidth={2} />
            All frameworks
          </Link>
          <p
            className="text-[11px] font-bold uppercase text-gt-leaf mb-3"
            style={{ letterSpacing: '0.25em' }}
          >
            {fw.type}
          </p>
          <h1 className="text-[38px] md:text-[48px] font-extrabold text-white leading-[1.05] mb-5 max-w-3xl">
            {fw.name}
          </h1>
          <p className="text-[17px] text-white/70 max-w-2xl leading-relaxed">
            {fw.summary}
          </p>

          {/* Fact row */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl">
            <FactCell
              icon={<Scale className="w-4 h-4" strokeWidth={1.75} />}
              label="Issuer"
              value={fw.issuer_short ?? fw.issuer}
            />
            {fw.effective_from && (
              <FactCell
                icon={<Calendar className="w-4 h-4" strokeWidth={1.75} />}
                label="Effective from"
                value={fw.effective_from}
              />
            )}
            <FactCell
              icon={<Globe className="w-4 h-4" strokeWidth={1.75} />}
              label="Jurisdictions"
              value={fw.jurisdictions.join(', ')}
            />
            <FactCell
              icon={<BookOpen className="w-4 h-4" strokeWidth={1.75} />}
              label="Pillars"
              value={`${livePillarCount} of ${fw.pillars.length} live`}
            />
          </div>
        </div>
      </section>

      {/* Long summary */}
      {fw.long_summary && (
        <section className="py-16 bg-[#fafbfa] border-b border-[#e5e7e5]">
          <div className="max-w-[820px] mx-auto px-8">
            <p
              className="text-[11px] font-bold uppercase text-gt-medium mb-3"
              style={{ letterSpacing: '0.22em' }}
            >
              What it is
            </p>
            <p className="text-[17px] text-gt-text leading-relaxed">
              {fw.long_summary}
            </p>
          </div>
        </section>
      )}

      {/* Pillars */}
      <section className="py-16 bg-white">
        <div className="max-w-[1100px] mx-auto px-8">
          <div className="max-w-[720px] mb-10">
            <p
              className="text-[11px] font-bold uppercase text-gt-medium mb-3"
              style={{ letterSpacing: '0.22em' }}
            >
              Pillars
            </p>
            <h2 className="text-[28px] font-extrabold text-gt-text leading-tight mb-4">
              Four pillars, {liveDisclosureCount} disclosures live.
            </h2>
            <p className="text-[15px] text-gt-text-muted leading-relaxed">
              Each pillar is a standalone page. Every disclosure appears
              at a permanent anchor so deep links from guides, courses,
              and external citations remain stable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {fw.pillars.map((pillar) => (
              <PillarCard
                key={pillar.id}
                frameworkId={fw.id}
                pillar={pillar}
                disclosureCount={
                  fw.disclosures.filter((d) => d.pillar === pillar.id).length
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* Related courses */}
      {relatedCourses.length > 0 && (
        <section className="py-16 bg-[#fafbfa] border-y border-[#e5e7e5]">
          <div className="max-w-[1100px] mx-auto px-8">
            <p
              className="text-[11px] font-bold uppercase text-gt-medium mb-3"
              style={{ letterSpacing: '0.22em' }}
            >
              Go deeper
            </p>
            <h2 className="text-[24px] font-extrabold text-gt-text mb-6">
              Related Greentryst courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedCourses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="group flex items-start gap-4 p-5 bg-white rounded-xl border border-[#e5e7e5] hover:border-gt-medium/50 hover:shadow-sm transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-gt-medium/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BookOpen
                      className="w-5 h-5 text-gt-medium"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-bold text-gt-text group-hover:text-gt-medium transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-[13px] text-gt-text-muted line-clamp-2 mt-1">
                      {course.subtitle}
                    </p>
                  </div>
                  <ArrowRight
                    className="w-5 h-5 text-gt-text-muted group-hover:text-gt-medium flex-shrink-0 mt-1"
                    strokeWidth={2}
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <RedesignFooter />
    </>
  );
}

function FactCell({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-gt-leaf/80 mb-1.5">
        {icon}
        <p
          className="text-[10px] font-bold uppercase"
          style={{ letterSpacing: '0.18em' }}
        >
          {label}
        </p>
      </div>
      <p className="text-[14px] font-semibold text-white leading-snug">
        {value}
      </p>
    </div>
  );
}

function PillarCard({
  frameworkId,
  pillar,
  disclosureCount,
}: {
  frameworkId: string;
  pillar: PillarMeta;
  disclosureCount: number;
}) {
  const isLive = pillar.status === 'live';
  const body = (
    <>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p
            className="text-[10px] font-bold uppercase text-gt-medium mb-2"
            style={{ letterSpacing: '0.2em' }}
          >
            Pillar {pillar.order}
          </p>
          <h3 className="text-[22px] font-extrabold text-gt-text leading-tight">
            {pillar.name}
          </h3>
        </div>
        {!isLive && (
          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-full">
            <Clock className="w-3 h-3 text-gt-text-muted" strokeWidth={2} />
            <p className="text-[10px] font-bold uppercase text-gt-text-muted tracking-wider">
              In preparation
            </p>
          </div>
        )}
      </div>
      <p className="text-[14px] text-gt-text-muted leading-relaxed">
        {pillar.summary}
      </p>
      {isLive && (
        <p className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-bold text-gt-medium">
          {disclosureCount} disclosure{disclosureCount === 1 ? '' : 's'}
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
        </p>
      )}
    </>
  );

  if (isLive) {
    return (
      <Link
        href={`/frameworks/${frameworkId}/${pillar.slug}`}
        className="group flex flex-col p-7 bg-white rounded-2xl border border-[#e5e7e5] hover:border-gt-medium/50 hover:shadow-sm transition-all"
      >
        {body}
      </Link>
    );
  }
  return (
    <div className="flex flex-col p-7 bg-[#fafbfa] rounded-2xl border border-[#e5e7e5]">
      {body}
    </div>
  );
}
