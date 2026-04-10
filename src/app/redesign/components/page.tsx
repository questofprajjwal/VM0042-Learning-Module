/**
 * Component showcase page for the Greentryst redesign.
 *
 * URL: http://localhost:5001/redesign/components
 *
 * This page is structured like a real homepage (hero → trust → work modes
 * → showcases → connected system → pricing → footer) so every component
 * is shown in context, with the correct dark/light section rhythm.
 *
 * The default background for the redesign is LIGHT (pale green #D8F3DC).
 * Dark sections are used strategically for impact, not as the default.
 *
 * See stitch-output/GREENTRYST_DESIGN_BIBLE.md for the spec.
 */

import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import {
  CategoryLabel,
  SectionHeading,
  RedesignButton,
  StatBadge,
  Stat,
  DarkSection,
  LightSection,
  RedesignNav,
  RedesignFooter,
  DarkUICard,
  PricingCard,
} from '@/components/redesign';

export const metadata = {
  title: 'Component Showcase',
  description: 'Greentryst redesign component library rendered in homepage context',
};

export default function ComponentShowcasePage() {
  return (
    <>
      {/* Page uses tone="dark" on nav because the hero is dark */}
      <RedesignNav tone="dark" />

      {/* ==========================================================
          HERO (dark - first impression, impact moment)
          ========================================================== */}
      <DarkSection dotGrid glow padding="xl" className="min-h-[90vh] flex items-center">
        <div className="pt-20 grid grid-cols-1 lg:grid-cols-[45%_55%] gap-16 items-center">
          <div>
            <CategoryLabel tone="dark">The Sustainability OS</CategoryLabel>
            <SectionHeading size="hero" tone="light" className="mt-6">
              The professional home for sustainability.
            </SectionHeading>
            <p className="mt-8 text-lg md:text-xl text-gt-mint/80 max-w-xl leading-relaxed">
              22 courses. 80+ indexed source documents. Every answer
              traceable to its origin. One platform, every mode of
              professional work.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <RedesignButton variant="primary" size="lg">
                Start Free
                <ArrowRight className="w-4 h-4" />
              </RedesignButton>
              <RedesignButton variant="secondary-dark" size="lg">
                See How It Works
              </RedesignButton>
            </div>
            <p
              className="mt-8 text-xs text-gt-mint/50"
              style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }}
            >
              No credit card required. 3 lessons free.
            </p>
          </div>

          {/* Hero visual: stacked product UI cards */}
          <div className="relative h-[520px] flex items-center justify-center">
            <div className="absolute gt-ambient-glow-dark w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full" />

            <div className="absolute transform -translate-y-24 translate-x-16 rotate-[4deg] w-[340px]">
              <DarkUICard
                variant="glass"
                label="Career"
                headerRight={
                  <span
                    className="text-gt-leaf font-bold text-sm"
                    style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }}
                  >
                    87%
                  </span>
                }
                source="Match based on your PCAF certification"
              >
                <p className="text-sm text-gt-mint/70 mb-2">Job match</p>
                <p className="text-base font-bold text-gt-text-light">
                  Senior ESG Analyst — Deloitte, London
                </p>
              </DarkUICard>
            </div>

            <div className="absolute transform -rotate-[2deg] z-10 w-[360px]">
              <DarkUICard
                variant="glass"
                hoverable
                label="SustainIQ"
                headerRight={<CheckCircle2 className="w-5 h-5 text-gt-leaf" />}
                source="IPCC AR6 WG1, Table 7.15, p.1017"
              >
                <p className="text-xs text-gt-mint/60 mb-2">Question</p>
                <p className="text-sm text-gt-mint/80 mb-3">
                  What is the GWP of methane under AR6?
                </p>
                <p
                  className="text-3xl font-bold text-gt-text-light"
                  style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }}
                >
                  27.9
                </p>
              </DarkUICard>
            </div>

            <div className="absolute transform translate-y-28 -translate-x-16 rotate-[3deg] w-[340px]">
              <DarkUICard
                variant="glass"
                label="Learn"
                headerRight={
                  <span
                    className="text-gt-leaf font-bold text-xs"
                    style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }}
                  >
                    60%
                  </span>
                }
                source="GHG Protocol Corporate Value Chain Standard, Ch. 5"
              >
                <p className="text-sm text-gt-mint/70 mb-1">Lesson in progress</p>
                <p className="text-base font-bold text-gt-text-light">
                  Understanding Scope 3 Categories
                </p>
              </DarkUICard>
            </div>
          </div>
        </div>
      </DarkSection>

      {/* ==========================================================
          STATS STRIP (dark teal, narrow band)
          ========================================================== */}
      <DarkSection variant="deep" padding="sm" maxWidth="1280">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 items-center">
          <Stat value="22+" label="Courses" tone="light" />
          <Stat value="470+" label="Lessons" tone="light" />
          <Stat value="80+" label="Source Documents" tone="light" />
          <Stat value="100%" label="Sourced & Verified" tone="light" />
        </div>
      </DarkSection>

      {/* ==========================================================
          TRUST IDENTITY (light - editorial statement with cascade)
          ========================================================== */}
      <LightSection variant="pale" padding="xl" glow>
        <div className="max-w-3xl mb-24">
          <CategoryLabel>The Provenance Promise</CategoryLabel>
          <SectionHeading size="section" tone="dark" className="mt-6">
            Every answer on this platform can be traced back to its original source.
          </SectionHeading>
          <div className="w-20 h-[2px] bg-gt-medium mt-6" />
          <p className="mt-6 text-lg text-gt-text-dim leading-relaxed max-w-2xl">
            In a profession where work must be verified, audited, and
            defended, this is not a feature. It is the foundation.
          </p>
        </div>

        {/* Cascading dark UI cards showing real provenance examples */}
        <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0">
          <div className="gt-cascade-1">
            <DarkUICard
              label="SustainIQ Answer"
              headerRight={<CheckCircle2 className="w-5 h-5 text-gt-leaf" />}
              source="VM0042 v2.2, Section 3.1.2, p.14"
              className="w-full max-w-sm"
            >
              <p className="text-sm text-gt-mint/70 mb-4">
                What is the baseline period for VM0042?
              </p>
              <p className="text-2xl font-bold text-gt-text-light leading-tight">
                10 years prior to the project start date
              </p>
            </DarkUICard>
          </div>

          <div className="gt-cascade-2">
            <DarkUICard
              label="Lesson Citation"
              headerRight={<CheckCircle2 className="w-5 h-5 text-gt-leaf" />}
              source="GHG Protocol Corporate Value Chain Standard, Ch. 7"
              className="w-full max-w-sm"
            >
              <p className="text-xl font-bold text-gt-text-light leading-tight mb-3">
                Scope 3 Category 6: Business Travel
              </p>
              <p className="text-sm text-gt-mint/70 leading-relaxed">
                Mandatory reporting including air, rail, and bus transport
                for business purposes under operational control.
              </p>
            </DarkUICard>
          </div>

          <div className="gt-cascade-3">
            <DarkUICard
              highlighted
              label="Emission Factor"
              headerRight={<CheckCircle2 className="w-5 h-5 text-gt-leaf" />}
              source="CEA CO2 Baseline Database v19, 2024"
              className="w-full max-w-sm"
            >
              <p className="text-sm text-gt-mint/70 mb-3">
                Grid Emission Factor — India
              </p>
              <p
                className="text-3xl font-bold text-gt-leaf"
                style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }}
              >
                0.716 tCO2/MWh
              </p>
            </DarkUICard>
          </div>
        </div>
      </LightSection>

      {/* ==========================================================
          WORK MODES (dark - bento grid)
          ========================================================== */}
      <DarkSection variant="deep" dotGrid padding="xl">
        <div className="mb-16 max-w-3xl">
          <CategoryLabel tone="dark">Built for How You Actually Work</CategoryLabel>
          <SectionHeading size="section" tone="light" className="mt-6">
            Four modes. One platform.
          </SectionHeading>
          <p className="mt-6 text-lg text-gt-mint/80 max-w-2xl leading-relaxed">
            You arrive with a need. The platform meets you where you are.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <DarkUICard
            variant="glass"
            label="Deep Learn"
            className="md:col-span-3"
          >
            <p className="italic text-gt-mint/60 mb-4 text-sm">
              &ldquo;I have a new client project and I have never touched
              this framework before.&rdquo;
            </p>
            <p className="text-lg text-gt-text-light leading-relaxed mb-4">
              Structured courses that decompose 130-page methodologies
              into 15-minute lessons. Every lesson cites its source.
            </p>
            <p
              className="text-[11px] text-gt-mint/50 mt-auto"
              style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }}
            >
              PCAF v3 → 8 modules → 34 lessons → certificate
            </p>
          </DarkUICard>

          <DarkUICard variant="glass" label="Quick Lookup" className="md:col-span-2">
            <p className="italic text-gt-mint/60 mb-4 text-sm">
              &ldquo;What is the GWP of methane under AR6?&rdquo;
            </p>
            <p className="text-base text-gt-text-light leading-relaxed mb-4">
              Ask SustainIQ. Get the precise answer with page-level citation.
            </p>
            <p
              className="text-[11px] text-gt-mint/50 mt-auto"
              style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }}
            >
              27.9 — IPCC AR6, Table 7.15, p.1017
            </p>
          </DarkUICard>

          <DarkUICard
            variant="glass"
            label="Execute"
            headerRight={<StatBadge variant="coming-soon">Soon</StatBadge>}
            className="md:col-span-2"
          >
            <p className="italic text-gt-mint/60 mb-4 text-sm">
              &ldquo;I know the methodology. Now I need to run the numbers.&rdquo;
            </p>
            <p className="text-base text-gt-text-light leading-relaxed mb-4">
              GHG calculators, report drafters, assessment tools with
              verified factors.
            </p>
            <p
              className="text-[11px] text-gt-mint/50 mt-auto"
              style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }}
            >
              1,842 tCO2e — PCAF v3, Table 4.2
            </p>
          </DarkUICard>

          <DarkUICard variant="glass" label="Orient" className="md:col-span-3">
            <p className="italic text-gt-mint/60 mb-4 text-sm">
              &ldquo;SEBI just mandated BRSR Core. What does this mean for
              my clients?&rdquo;
            </p>
            <p className="text-lg text-gt-text-light leading-relaxed mb-4">
              New regulation dropped? Market shift? Get an implications
              briefing grounded in primary sources, not speculation.
            </p>
            <p
              className="text-[11px] text-gt-mint/50 mt-auto"
              style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }}
            >
              CSRD timeline → who → what → by when
            </p>
          </DarkUICard>
        </div>
      </DarkSection>

      {/* ==========================================================
          PRODUCT SHOWCASE (light alt - editorial alternating)
          ========================================================== */}
      <LightSection variant="alt" padding="xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div>
            <StatBadge variant="live">Live</StatBadge>
            <h3 className="mt-4 text-3xl md:text-5xl font-extrabold text-gt-text leading-tight" style={{ letterSpacing: '-0.02em' }}>
              22 courses. Zero fluff.
            </h3>
            <p className="mt-6 text-lg text-gt-text-dim leading-relaxed max-w-lg">
              Every lesson decomposes complex source documents into
              15-minute pieces. Each lesson cites the exact section it
              teaches from. Certificates are verifiable by URL.
            </p>
            <p
              className="mt-6 text-xs text-gt-medium"
              style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }}
            >
              Carbon markets · GHG accounting · ESG · Finance · Climate
            </p>
            <div className="mt-8">
              <RedesignButton variant="primary" size="md">
                Browse Courses
                <ArrowRight className="w-4 h-4" />
              </RedesignButton>
            </div>
          </div>

          <DarkUICard
            label="Lesson Interface"
            source="Module 2 · Lesson 2.3 · Source: PCAF Standard v3, Section 4"
          >
            <p className="text-sm text-gt-mint/70 mb-2">Module 2: Attribution</p>
            <p className="text-2xl font-bold text-gt-text-light leading-tight mb-4">
              Asset Class Attribution Factors
            </p>
            <div className="bg-gt-dark rounded-lg p-4 border-l-2 border-gt-leaf">
              <p className="text-xs text-gt-leaf font-bold uppercase mb-2" style={{ letterSpacing: '0.15em' }}>
                Key Takeaway
              </p>
              <p className="text-sm text-gt-text-light leading-relaxed">
                Attribution factors determine what share of a counterparty&rsquo;s
                emissions a financial institution is responsible for.
              </p>
            </div>
          </DarkUICard>
        </div>

        {/* Reversed layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <DarkUICard
            label="SustainIQ"
            source="Retrieved from 80+ indexed documents"
            className="lg:order-1"
          >
            <div className="bg-gt-dark rounded-lg p-3 border border-gt-mint/10 mb-5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gt-mint/60" />
                <p className="text-xs text-gt-mint/60">
                  What are the additionality requirements for VM0042?
                </p>
              </div>
            </div>
            <p className="text-sm text-gt-text-light leading-relaxed mb-4">
              Projects must demonstrate that carbon credit revenue is
              essential to project viability, applied via the investment
              analysis method.
            </p>
            <div className="flex flex-wrap gap-2">
              <span
                className="text-[10px] bg-gt-leaf/15 text-gt-leaf px-2 py-1 rounded"
                style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }}
              >
                VM0042 v2.2, §5.1
              </span>
              <span
                className="text-[10px] bg-gt-leaf/15 text-gt-leaf px-2 py-1 rounded"
                style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }}
              >
                Section 5.1.3, p.23
              </span>
            </div>
          </DarkUICard>

          <div className="lg:order-2">
            <StatBadge variant="live">Live</StatBadge>
            <h3 className="mt-4 text-3xl md:text-5xl font-extrabold text-gt-text leading-tight" style={{ letterSpacing: '-0.02em' }}>
              A knowledge engine, not a chatbot.
            </h3>
            <p className="mt-6 text-lg text-gt-text-dim leading-relaxed max-w-lg">
              80+ source documents indexed. Ask any sustainability
              question and get precise answers with page-level citations.
              Every response links back to the original.
            </p>
            <p
              className="mt-6 text-xs text-gt-medium"
              style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }}
            >
              10 queries/month free. 20/day on Pro.
            </p>
            <div className="mt-8">
              <RedesignButton variant="primary" size="md">
                Try SustainIQ
                <ArrowRight className="w-4 h-4" />
              </RedesignButton>
            </div>
          </div>
        </div>
      </LightSection>

      {/* ==========================================================
          PRICING (light pale - three cards)
          ========================================================== */}
      <LightSection variant="pale" padding="xl">
        <div className="text-center mb-16">
          <CategoryLabel>Pricing</CategoryLabel>
          <SectionHeading size="section" tone="dark" className="mt-6">
            Professional tools at individual prices.
          </SectionHeading>
          <p className="mt-6 text-lg text-gt-text-dim max-w-2xl mx-auto leading-relaxed">
            Not enterprise software. Not a free course platform. The right
            tools at the right price for individual practitioners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <PricingCard
            name="Learn"
            price="$8"
            tagline="Get started with sourced sustainability learning."
            features={[
              'Unlimited courses + certificates',
              '10 SustainIQ queries/month',
              'Job board (browse only)',
              'Community discussions (rate-limited)',
            ]}
            ctaLabel="Start Learning"
            ctaHref="/redesign/pricing#learn"
          />
          <PricingCard
            name="Career"
            price="$14"
            tagline="For practitioners advancing their career."
            highlighted
            features={[
              'Everything in Learn',
              '6 SustainIQ queries/day',
              'Full job matching + resume analysis',
              'Skill gap analysis linked to courses',
              'Unlimited community posting',
            ]}
            ctaLabel="Start Career"
            ctaHref="/redesign/pricing#career"
          />
          <PricingCard
            name="Pro"
            price="$25"
            tagline="The full professional operating system."
            features={[
              'Everything in Career',
              '20 SustainIQ queries/day',
              'All professional tools',
              'Company ESG screener',
              'Regulation tracker + RFP aggregator',
            ]}
            ctaLabel="Go Pro"
            ctaHref="/redesign/pricing#pro"
          />
        </div>

        <p className="mt-12 text-center text-sm text-gt-text-dim">
          Start with 3 free lessons. No credit card required.{' '}
          <span className="text-gt-medium font-semibold">Annual billing saves 25%.</span>
        </p>
      </LightSection>

      <RedesignFooter />
    </>
  );
}
