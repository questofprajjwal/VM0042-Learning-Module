/**
 * Greentryst homepage.
 *
 * URL: /
 *
 * Follows HOMEPAGE_LOCKED_SPEC.md exactly. Eight sections:
 * 1. Navigation bar
 * 2. Hero (dark, locked headline, shuffling cards)
 * 3. Ticker band
 * 4. Trust Identity with TryItDemo
 * 5. Four Work Modes via ActiveShowcase
 * 6. Pricing via PricingSection
 * 7. Closing CTA
 * 8. Footer
 *
 * See brainstorming/HOMEPAGE_LOCKED_SPEC.md for the full specification.
 */

import { Nav } from '@/components/Nav';
import {
  CategoryLabel,
  SectionHeading,
  RedesignButton,
  DarkSection,
  LightSection,
  RedesignFooter,
  Ticker,
  TryItDemo,
  ActiveShowcase,
  PricingSection,
  ClosingCTA,
  DarkUICard,
} from '@/components/redesign';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { getJobsMeta } from '@/lib/jobs';
import { getAllCourses, getAllLessons } from '@/lib/courses';
import { HeroClient } from './_components/HeroClient';

export const metadata = {
  // Title intentionally empty so the root layout's default "Greentryst - The
  // Professional Home for Sustainability" is used (template suppresses on root).
  description:
    'The professional operating system for sustainability practitioners. Learn new domains, verify answers with sourced citations, execute work with professional tools, advance your career.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  const jobsMeta = getJobsMeta();
  const jobsCount = `${jobsMeta.totalJobCount}+`;
  const geographiesCount = `${jobsMeta.countries.length}+`;
  const companiesCount = `${jobsMeta.totalCompanies}+`;

  // Pull real counts from the content library so the stats row reflects
  // what is actually shipped. Runs at build time under SSG.
  const allCourses = getAllCourses();
  const coursesCount = String(allCourses.length);
  const lessonsCount = String(
    allCourses.reduce((sum, c) => sum + getAllLessons(c).length, 0),
  );

  return (
    <>
      {/* ==========================================================
          SECTION 1: NAVIGATION BAR
          ========================================================== */}
      <Nav tone="dark" />

      {/* ==========================================================
          SECTION 2: HERO (dark charcoal background)
          Shuffling taglines + preview cards
          ========================================================== */}
      <DarkSection dotGrid glow padding="sm">
        <HeroClient />
      </DarkSection>

      {/* ==========================================================
          SECTION 3: TICKER BAND
          Continuous marquee of frameworks, methodologies, regulations
          ========================================================== */}
      <Ticker
        items={[
          'TCFD',
          'IFRS S1',
          'IFRS S2',
          'GRI',
          'SASB',
          'SBTi',
          'ISSB',
          'CDP',
          'PCAF',
          'CSRD',
          'SB 253',
          'AASB S2',
          'EU Taxonomy',
          'CBAM',
          'SFDR',
          'EUDR',
          'EU ETS',
          'VM0042',
          'VCS',
          'Gold Standard',
          'ACR',
          'CAR',
          'Scope 1',
          'Scope 2',
          'Scope 3',
          'LCA',
          'Double Materiality',
          'Article 6',
          'CORSIA',
          'BRSR',
        ]}
      />

      {/* ==========================================================
          STATS BAR — single-line platform metrics beneath the ticker
          ========================================================== */}
      <section className="bg-white border-b border-gt-border-light">
        <div className="max-w-[1280px] mx-auto px-8 py-8 flex items-center justify-between gap-4 overflow-x-auto">
          {[
            { value: coursesCount, label: 'Courses' },
            { value: lessonsCount, label: 'Lessons' },
            { value: '530+', label: 'Source Docs' },
            { value: '6', label: 'Pro Tools' },
            { value: '120+', label: 'Regulations' },
            { value: '416+', label: 'Jobs Listed' },
            { value: '14+', label: 'Geographies' },
            { value: '1K+', label: 'Practitioners' },
            { value: '100%', label: 'Sourced' },
          ].map((stat, i, arr) => (
            <div key={stat.label} className="flex items-center gap-4 shrink-0">
              <div className="flex flex-col items-center text-center group">
                <span
                  className="text-[28px] font-extrabold text-gt-medium tracking-tight leading-none"
                  style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }}
                >
                  {stat.value}
                </span>
                <span
                  className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-gt-text-muted whitespace-nowrap transition-colors group-hover:text-gt-medium"
                  style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }}
                >
                  {stat.label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div className="w-px h-10 bg-gt-border-light" aria-hidden />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================================
          SECTION 4: TRUST IDENTITY with TryItDemo
          Label: PROVENANCE PROMISE
          Heading: "Every answer can be traced to its source."
          ========================================================== */}
      <LightSection variant="pale" padding="xl" className="!pt-16 !pb-16">
        <div className="max-w-4xl mb-16">
          <CategoryLabel>The Provenance Promise</CategoryLabel>
          <SectionHeading size="section" tone="dark" className="mt-6">
            Sustainability work deserves better than fragmented PDFs, unverified
            AI, and software priced out of reach.
          </SectionHeading>
          <p className="mt-6 text-lg text-gt-text-dim leading-relaxed max-w-3xl">
            Every answer on Greentryst traces back to its original source document,
            page number, and publication year. Every calculation carries its audit
            trail. Every regulation links to the legal text. Hover any card below to
            see it in action.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {[
            {
              label: 'SustainIQ Answer',
              leadIn: 'What is the baseline period for VM0042?',
              heading: '10 years prior to the project start date',
              mono: false,
              source: 'VM0042 v2.2, Sec. 3.1.2, p.14',
              span: 'md:col-span-5',
            },
            {
              label: 'Lesson Citation',
              heading: 'Scope 3 Category 6: Business Travel',
              body:
                'Mandatory reporting including air, rail, and bus transport for business purposes under operational control.',
              mono: false,
              source: 'GHG Protocol CVC, Ch. 7, Table 7.1',
              span: 'md:col-span-7',
            },
            {
              label: 'Emission Factor',
              leadIn: 'Grid Emission Factor · India (CEA 2024)',
              heading: '0.716 tCO₂/MWh',
              mono: true,
              source: 'CEA CO₂ Baseline Database, 2024',
              span: 'md:col-span-4',
            },
            {
              label: 'Calculator Output',
              leadIn: 'Scope 3 Cat. 6 · 142,420 km short-haul flights',
              heading: '36.3 tCO₂e',
              body: 'Reconciled against DEFRA 2024 · distance-based method',
              mono: true,
              source: 'DEFRA 2024, Table 4c · GHG Protocol CVC Ch. 7',
              span: 'md:col-span-3',
            },
            {
              label: 'Regulation Tracker',
              leadIn: 'CSRD · Wave 2 filing deadline',
              heading: 'Jan 1, 2026',
              body: 'Applies to large EU companies with EU subsidiaries. First report covers FY2025 data.',
              mono: true,
              source: 'Directive 2022/2464 · Art. 5(2)',
              span: 'md:col-span-5',
            },
          ].map((card) => (
            <DarkUICard
              key={card.label}
              variant="solid"
              hoverable
              label={card.label}
              source={card.source}
              className={card.span}
            >
              {card.leadIn && (
                <p className="text-[13px] text-white/55 leading-snug mb-3">
                  {card.leadIn}
                </p>
              )}
              <p
                className={
                  card.mono
                    ? 'text-[26px] font-extrabold text-white leading-tight tracking-tight'
                    : 'text-[20px] font-bold text-white leading-snug'
                }
                style={
                  card.mono
                    ? { fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }
                    : undefined
                }
              >
                {card.heading}
              </p>
              {card.body && (
                <p className="mt-3 text-[13px] text-white/55 leading-relaxed">
                  {card.body}
                </p>
              )}
            </DarkUICard>
          ))}
        </div>

        <TryItDemo className="mt-16 max-w-4xl mx-auto" />
      </LightSection>

      {/* ==========================================================
          SECTION 5: FOUR WORK MODES via ActiveShowcase
          Label: THE PLATFORM
          Heading: "Four work modes. One platform."
          ========================================================== */}
      <LightSection variant="white" padding="xl" className="!pt-16">
        <div className="max-w-3xl mb-16">
          <CategoryLabel>The Platform</CategoryLabel>
          <SectionHeading size="section" tone="dark" className="mt-6">
            Different work modes. One platform.
          </SectionHeading>
          <p className="mt-6 text-lg text-gt-text-dim leading-relaxed max-w-2xl">
            You arrive with a need. The platform meets you where you are.
          </p>
        </div>

        <ActiveShowcase
          jobsCount={jobsCount}
          geographiesCount={geographiesCount}
          companiesCount={companiesCount}
        />
      </LightSection>

      {/* ==========================================================
          SECTION 6: PRICING
          Label: PRICING
          Heading: "Pick the tier that fits your work."
          ========================================================== */}
      <div id="pricing" className="pt-24 pb-24 max-w-[1280px] mx-auto px-8">
        <div className="max-w-3xl mx-auto mb-14 text-center">
          <CategoryLabel>Pricing</CategoryLabel>
          <SectionHeading size="section" tone="dark" className="mt-6">
            Pick the tier that fits the work.
          </SectionHeading>
          <p className="mt-6 text-lg text-gt-text-dim leading-relaxed max-w-2xl mx-auto">
            Start free, upgrade when a specific work mode becomes core to your day.
          </p>
        </div>

        <PricingSection />
      </div>

      {/* ==========================================================
          SECTION 7: CLOSING CTA
          Locked copy: We simplify. We show you the source. We make the work easy for you.
          ========================================================== */}
      <ClosingCTA />

      {/* ==========================================================
          SECTION 8: FOOTER
          ========================================================== */}
      <RedesignFooter />
    </>
  );
}
