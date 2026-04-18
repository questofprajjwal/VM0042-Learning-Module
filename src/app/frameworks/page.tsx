/**
 * /frameworks — catalogue of sustainability reporting frameworks,
 * standards, and directives covered on Greentryst.
 *
 * Live entries link through to the framework overview. In-preparation
 * entries render as disabled cards so the URL namespace signals intent
 * without shipping half-finished content.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';
import { Nav } from '@/components/Nav';
import { RedesignFooter } from '@/components/redesign';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbList, SITE_URL, ORG_ID } from '@/lib/seo/schema';
import { listFrameworks } from '@/lib/frameworks';

export const metadata: Metadata = {
  title: 'Sustainability Reporting Frameworks and Standards',
  description:
    'Working reference for IFRS S2, IFRS S1, GRI, SASB, ESRS, CSRD, BRSR, TCFD, TNFD, and CDP. Verbatim requirements, plain-English commentary, and exemplars. Reviewed by the Greentryst Editorial Board.',
  alternates: { canonical: '/frameworks' },
};

const CATALOGUE_LD = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${SITE_URL}/frameworks#page`,
  url: `${SITE_URL}/frameworks`,
  name: 'Sustainability Reporting Frameworks and Standards',
  description:
    'Practitioner\'s guide to the sustainability reporting frameworks, standards, and directives covered by the Greentryst Climate Disclosure Desk.',
  publisher: { '@id': ORG_ID },
  about: [
    { '@type': 'Thing', name: 'IFRS S2' },
    { '@type': 'Thing', name: 'GRI Standards' },
    { '@type': 'Thing', name: 'ESRS' },
    { '@type': 'Thing', name: 'CSRD' },
    { '@type': 'Thing', name: 'BRSR' },
    { '@type': 'Thing', name: 'TCFD' },
    { '@type': 'Thing', name: 'SASB Standards' },
    { '@type': 'Thing', name: 'CDP Disclosure System' },
  ],
};

export default function FrameworksHubPage() {
  const frameworks = listFrameworks();
  const live = frameworks.filter((f) => f.status === 'live');
  const inPrep = frameworks.filter((f) => f.status === 'in_preparation');

  return (
    <>
      <JsonLd data={CATALOGUE_LD} />
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', url: '/' },
          { name: 'Frameworks' },
        ])}
      />
      <Nav />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gt-text-dark pt-32 pb-20">
        <div
          className="gt-ambient-glow-dark absolute -top-20 left-1/4 w-[600px] h-[600px] rounded-full"
          aria-hidden
        />
        <div
          className="gt-dot-grid absolute inset-0 opacity-40 pointer-events-none"
          aria-hidden
        />

        <div className="relative z-10 max-w-[1100px] mx-auto px-8">
          <p
            className="text-[11px] font-bold uppercase text-gt-leaf mb-4"
            style={{ letterSpacing: '0.25em' }}
          >
            Practitioner&apos;s guide
          </p>
          <h1 className="text-[40px] md:text-[52px] font-extrabold text-white leading-[1.05] mb-6 max-w-3xl">
            Sustainability reporting frameworks, standards, and directives.
          </h1>
          <p className="text-[17px] text-white/65 max-w-2xl leading-relaxed">
            A working reference for the frameworks practitioners are
            asked to report against. Each page renders the verbatim
            requirement, a plain-English explanation, and an exemplar of
            what a strong disclosure looks like. Produced by the
            Greentryst Climate Disclosure Desk and reviewed by the
            Editorial Board.
          </p>
        </div>
      </section>

      {/* Live frameworks */}
      <section className="py-16 bg-[#fafbfa] border-b border-[#e5e7e5]">
        <div className="max-w-[1100px] mx-auto px-8">
          <div className="flex items-baseline justify-between mb-8">
            <p
              className="text-[11px] font-bold uppercase text-gt-medium"
              style={{ letterSpacing: '0.22em' }}
            >
              Live
            </p>
            <p className="text-[13px] text-gt-text-muted">
              {live.length} framework{live.length === 1 ? '' : 's'} available
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {live.map((f) => (
              <Link
                key={f.id}
                href={`/frameworks/${f.id}`}
                className="group flex flex-col p-7 bg-white rounded-2xl border border-[#e5e7e5] hover:border-gt-medium/50 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p
                      className="text-[10px] font-bold uppercase text-gt-medium mb-2"
                      style={{ letterSpacing: '0.2em' }}
                    >
                      {f.type}
                    </p>
                    <h2 className="text-[22px] font-extrabold text-gt-text leading-tight">
                      {f.short_name}
                    </h2>
                    <p className="text-[13px] text-gt-text-muted mt-1">
                      {f.issuer}
                    </p>
                  </div>
                  <ArrowRight
                    className="w-5 h-5 text-gt-text-muted group-hover:text-gt-medium group-hover:translate-x-0.5 transition-all mt-1"
                    strokeWidth={2}
                  />
                </div>
                <p className="text-[14px] text-gt-text leading-relaxed">
                  {f.summary}
                </p>
                <p className="mt-4 text-[13px] font-bold text-gt-text">
                  {f.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* In preparation */}
      <section className="py-16 bg-white">
        <div className="max-w-[1100px] mx-auto px-8">
          <div className="flex items-baseline justify-between mb-8">
            <p
              className="text-[11px] font-bold uppercase text-gt-text-muted"
              style={{ letterSpacing: '0.22em' }}
            >
              In preparation
            </p>
            <p className="text-[13px] text-gt-text-muted">
              Content in review by the Editorial Board
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inPrep.map((f) => (
              <div
                key={f.id}
                className="flex flex-col p-6 bg-[#fafbfa] rounded-xl border border-[#e5e7e5] opacity-80"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Clock
                    className="w-3.5 h-3.5 text-gt-text-muted"
                    strokeWidth={2}
                  />
                  <p
                    className="text-[10px] font-bold uppercase text-gt-text-muted"
                    style={{ letterSpacing: '0.18em' }}
                  >
                    {f.type}
                  </p>
                </div>
                <h2 className="text-[16px] font-bold text-gt-text leading-tight mb-1">
                  {f.short_name}
                </h2>
                <p className="text-[12px] text-gt-text-muted mb-3">
                  {f.issuer}
                </p>
                <p className="text-[13px] text-gt-text-muted leading-relaxed">
                  {f.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology strip */}
      <section className="py-16 bg-[#fafbfa] border-y border-[#e5e7e5]">
        <div className="max-w-[900px] mx-auto px-8">
          <div className="flex items-start gap-4 mb-6">
            <BookOpen
              className="w-6 h-6 text-gt-medium flex-shrink-0 mt-1"
              strokeWidth={1.5}
            />
            <div>
              <h2 className="text-[22px] font-extrabold text-gt-text mb-3">
                How we write these guides
              </h2>
              <p className="text-[15px] text-gt-text-muted leading-relaxed">
                Every requirement page carries three panels. The first
                quotes the standard verbatim, so the canonical language
                is never paraphrased. The second restates what the
                paragraph is actually asking for in the words a
                practitioner would use. The third shows what a strong
                disclosure looks like: instructive exemplars, never
                attributed quotes from real companies. The Climate
                Disclosure Desk drafts the commentary; the Editorial
                Board signs off before publication.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RedesignFooter />
    </>
  );
}
