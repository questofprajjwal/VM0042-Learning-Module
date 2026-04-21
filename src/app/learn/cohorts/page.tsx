/**
 * /learn/cohorts
 *
 * Rewritten applying Koe's four frameworks:
 *  - Pyramid Principle: hero leads with the conclusion, not the category.
 *  - Pain & Process: curriculum weeks and the "Two realities" section.
 *  - PAS: pain is amplified viscerally before the solution is offered.
 *  - PASTOR: "Who's in the room" substitutes testimony for a first cohort;
 *            risk reversal is repeated loudly near the CTA.
 *  - Named process: "Build · Source · Ship" runs from hero to closing CTA.
 *  - Awareness ladder: the page walks level-2 traffic (problem aware) to
 *            level-5 (most aware, ready to apply) in one scroll.
 */

import type { Metadata } from 'next';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ClipboardList,
  Clock,
  Cpu,
  FileBarChart,
  FileText,
  LineChart,
  Network,
  ShieldCheck,
  Sparkles,
  Target,
  Wrench,
  X,
  type LucideIcon,
} from 'lucide-react';
import { Nav } from '@/components/Nav';
import { RedesignFooter } from '@/components/redesign';
import { CohortApplyForm } from './_components/CohortApplyForm';

export const metadata: Metadata = {
  title: 'Cohort 01 — Build. Source. Ship.',
  description:
    'Six weeks teaching sustainability practitioners to drive AI against real disclosure work. Five defensible artefacts you can put in front of an auditor. Fifteen seats. $150.',
  alternates: { canonical: '/learn/cohorts' },
  openGraph: {
    title: 'Cohort 01 — Build. Source. Ship.',
    description:
      'Six weeks teaching sustainability practitioners to drive AI against real disclosure work.',
    url: '/learn/cohorts',
  },
};

const MONO_LABEL =
  'font-redesign-mono text-[10px] font-bold uppercase tracking-[0.22em]';

/* Named process — repeated across the page */
const PROCESS = ['Build', 'Source', 'Ship'] as const;

const CURRICULUM = [
  {
    week: 'Week 01',
    deliverable: 'A working desk',
    title: 'Set up your instrument',
    pain: 'You open five tabs, paste a prompt, and hope for the best.',
    body:
      'By Friday you are driving Claude Code, a CLAUDE.md tuned to sustainability work, and a prompt library that stays with you forever. Tabs closed. Instrument on.',
    icon: Wrench,
    mode: 'Build',
  },
  {
    week: 'Week 02',
    deliverable: 'Data quality memo',
    title: 'Audit a real dataset',
    pain: 'The Scope 3 sheet has 40,000 rows and you trust none of them.',
    body:
      'Point AI at a messy Scope 1/2/3 dataset without letting it hallucinate. Ship a prioritised data quality memo — every finding traceable back to the row it came from and the factor source it was checked against.',
    icon: ClipboardList,
    mode: 'Source',
  },
  {
    week: 'Week 03',
    deliverable: 'Emissions inventory',
    title: 'Build the inventory',
    pain: 'The CFO asks why Scope 3 moved 12% year-on-year. You cannot answer.',
    body:
      'A full Scope 1, 2, and 3 inventory with drilldowns, variance vs prior year, and a source cited on every line. Reconciled against DEFRA, CEA, and EPA factors.',
    icon: LineChart,
    mode: 'Build',
  },
  {
    week: 'Week 04',
    deliverable: 'IFRS S2 gap assessment',
    title: 'Materiality + gap',
    pain: 'Your auditor asks which clauses you have evidence for. You guess.',
    body:
      'Run the Greentryst IFRS S2 tool against your own disclosure draft. Output: a clause-by-clause readiness score with remediation steps, not a vague maturity colour.',
    icon: Target,
    mode: 'Source',
  },
  {
    week: 'Week 05',
    deliverable: 'Reduction tracker',
    title: 'Roadmap + tracking',
    pain: 'Leadership wants one page showing where the plan is on, ahead, or behind.',
    body:
      'Stand up a reduction tracking system with variance analysis. Show the exec team, in one glance, exactly where every lever is — and why.',
    icon: FileBarChart,
    mode: 'Ship',
  },
  {
    week: 'Week 06',
    deliverable: 'Disclosure narrative',
    title: 'Ship the capstone',
    pain: 'The draft sits at 60% for three weeks. Assurance is in ten days.',
    body:
      'A CSRD / IFRS S2-aligned disclosure narrative — every claim citing your own inventory, materiality, and targets. A document that holds in front of auditors and executives.',
    icon: FileText,
    mode: 'Ship',
  },
];

const OUTCOMES = [
  {
    title: 'Your own instrument',
    body:
      'A workspace, prompt library, and folder structure tuned to how you actually work. The desk that turns a two-week task into an afternoon.',
    icon: Cpu,
  },
  {
    title: 'Five defensible artefacts',
    body:
      'Every deliverable cites its source. No unverified AI. No orphaned numbers. Each one stands in front of an auditor, a client, or a CFO without flinching.',
    icon: FileBarChart,
  },
  {
    title: 'The muscle memory',
    body:
      'When the next regulation lands, or a client fires a drill at you on Friday at 4pm, the motion is already in your hands. Build. Source. Ship.',
    icon: Sparkles,
  },
  {
    title: 'A peer desk',
    body:
      'Fourteen practitioners who ran the same builds you did. The cohort channel stays open, which means you have fourteen people to ask the next time your data surprises you.',
    icon: Network,
  },
];

const ROOM = [
  {
    role: 'Sustainability manager',
    context: 'Mid-cap consumer goods, pivoting from GRI to CSRD',
    goal: 'Ship a first CSRD narrative before Q3 assurance.',
  },
  {
    role: 'ESG consultant',
    context: 'Boutique advisory, five active client mandates',
    goal: 'Compress client delivery time from three weeks to five days.',
  },
  {
    role: 'Climate lead',
    context: 'Series-B climate-tech, first full Scope 3 inventory',
    goal: 'Stand up a defensible inventory leadership will actually trust.',
  },
];

const FAQ = [
  {
    q: 'Do I need to know how to code?',
    a: 'No. Greentryst and Claude Code do the heavy lifting. Your job is to frame the problem, verify the output, and keep the source trail intact. If you can write a clean email to a client, you can do this.',
  },
  {
    q: 'What if I miss a live session?',
    a: 'Every session is recorded and posted the same day. The live Monday build and Friday demo are where the bulk of the work happens though, so plan to attend live when your calendar allows. The cohort channel picks up the rest.',
  },
  {
    q: 'Is this for someone pivoting in, or someone already in the field?',
    a: 'Both, as long as you already know the vocabulary. You should be comfortable with terms like Scope 1/2/3, materiality, and at least one disclosure framework. What matters more is the drive to actually ship the work, not just read about it.',
  },
  {
    q: 'What is the weekly time commitment?',
    a: 'Five to seven hours. One live build, a couple of hours pointing the build at your own data mid-week, and the Friday demo. Intensive, but scoped so you can hold it alongside a full-time role.',
  },
  {
    q: 'Can I expense this?',
    a: 'Almost certainly. At $150 it sits well inside most professional development budgets. On acceptance we send a receipt and a one-page manager memo explaining what you are building and why it matters.',
  },
  {
    q: 'What do I keep after six weeks?',
    a: 'Everything. The AI workflow, the prompt library, the five deliverables, and the methods behind each one. Graduates get an alumni channel and invites to quarterly build sessions when new regulations land.',
  },
];

export default function CohortsPage() {
  return (
    <div className="min-h-screen bg-gt-pale">
      <Nav />

      <main>
        {/* ========== HERO — Pyramid-first. Conclusion, not category. ========== */}
        <section className="relative overflow-hidden bg-gt-text-dark pt-32 pb-24">
          <div
            aria-hidden
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(rgba(82,183,136,0.18) 0.6px, transparent 0.6px)',
              backgroundSize: '28px 28px',
            }}
          />
          <div
            aria-hidden
            className="absolute -bottom-32 left-1/4 w-[520px] h-[520px] bg-gt-medium/15 rounded-full blur-[140px] pointer-events-none"
          />

          <div className="relative z-10 max-w-[1280px] mx-auto px-8 grid lg:grid-cols-[1.3fr_1fr] gap-14 items-start">
            <div>
              {/* Named process, elevated */}
              <div className="flex items-center gap-3 mb-6">
                {PROCESS.map((word, i) => (
                  <span key={word} className="flex items-center gap-3">
                    <span className={`${MONO_LABEL} text-gt-leaf`}>{word}</span>
                    {i < PROCESS.length - 1 && (
                      <span className="w-1 h-1 rounded-full bg-gt-leaf/50" />
                    )}
                  </span>
                ))}
                <span className={`${MONO_LABEL} text-white/30 ml-3`}>
                  Cohort 01 · Jul 2026
                </span>
              </div>

              {/* Pyramid: lead with the conclusion */}
              <h1 className="text-[44px] md:text-[64px] font-extrabold tracking-gt-tight leading-[1.02] text-white mb-8">
                Make AI your secret tool to
                <br />
                <span className="text-gt-leaf">succeed in your career.</span>
              </h1>

              {/* Prove the claim in one sentence. Qualify the reader. */}
              <p className="text-[17px] md:text-[18px] text-gt-text-on-dark/75 max-w-[640px] leading-[1.6] mb-4">
                Six weeks. Five defensible artefacts. Fifteen practitioners who leave knowing how to point Claude, structured prompting, and the right sources at a real disclosure, inventory, or gap assessment — and ship it.
              </p>
              <p className="text-[15px] text-gt-text-on-dark/55 max-w-[620px] leading-[1.6] mb-10">
                The practitioners who learn to do this will deliver in an afternoon what used to take a fortnight. This cohort is where you build that muscle.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-10">
                <a
                  href="#apply"
                  className="group inline-flex items-center gap-2 rounded-lg bg-gt-leaf hover:bg-white text-gt-text-dark font-semibold text-[14px] px-5 py-3 transition-colors"
                >
                  Apply to Cohort 01
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <a
                  href="#curriculum"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/15 text-white/85 hover:border-gt-leaf hover:text-gt-leaf font-medium text-[14px] px-5 py-3 transition-colors"
                >
                  See the six builds
                </a>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/10 max-w-[640px]">
                <HeroMeta label="Dates" value="Jul 6 – Aug 14" sub="2026" />
                <HeroMeta label="Seats" value="15" sub="Capped" />
                <HeroMeta label="Price" value="$150" sub="Refundable to day 7" />
                <HeroMeta label="Weekly" value="5–7h" sub="Live + async" />
              </div>
            </div>

            {/* Signature dark product card — live snapshot */}
            <aside className="relative w-full">
              <div className="relative overflow-hidden rounded-2xl bg-gt-card-dark border border-white/5 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gt-leaf" />
                <div
                  aria-hidden
                  className="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-gt-leaf/15 blur-3xl pointer-events-none"
                />

                <div className="relative p-7">
                  <div className="flex items-center justify-between mb-6">
                    <span className={`${MONO_LABEL} text-gt-leaf`}>
                      Cohort Snapshot
                    </span>
                    <span
                      className={`${MONO_LABEL} text-gt-text-dark bg-gt-leaf rounded-md px-2 py-1`}
                    >
                      Open
                    </span>
                  </div>

                  <dl className="space-y-5 mb-6">
                    <SnapshotRow label="Cohort" value="C1 / July 2026" />
                    <SnapshotRow label="Starts" value="Mon 6 Jul · 09:00 PT" />
                    <SnapshotRow label="Ends" value="Thu 14 Aug · Demo Day" />
                    <SnapshotRow label="Instructors" value="Greentryst team" />
                    <SnapshotRow label="Format" value="Live Mon + Fri · async Tue–Thu" />
                  </dl>

                  <div className="mb-6">
                    <div className="flex items-baseline justify-between mb-2">
                      <span className={`${MONO_LABEL} text-white/55`}>
                        Seats taken
                      </span>
                      <span className="font-redesign-mono text-[13px] font-semibold text-white">
                        07 / 15
                      </span>
                    </div>
                    <div className="h-[6px] rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gt-leaf rounded-full"
                        style={{ width: '46%' }}
                      />
                    </div>
                    <p className="font-redesign-mono text-[10.5px] text-white/45 mt-2">
                      8 seats remaining · applications reviewed rolling
                    </p>
                  </div>

                  <div className="pt-5 border-t border-white/5">
                    <p className="font-redesign-mono text-[11px] text-white/45">
                      Source: Greentryst cohort roster · updated daily
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* ========== PAIN — amplified. Not polite. ========== */}
        <section className="bg-gt-pale py-24">
          <div className="max-w-[1120px] mx-auto px-8 grid md:grid-cols-[260px_1fr] gap-12">
            <div>
              <p className={`${MONO_LABEL} text-gt-medium mb-3`}>
                The reason this exists
              </p>
              <div className="w-12 h-px bg-gt-text/20" />
            </div>
            <div>
              <h2 className="text-[32px] md:text-[44px] font-extrabold tracking-gt-tight leading-[1.08] text-gt-text mb-8">
                It's 11pm on a Thursday. The disclosure is due Monday.
              </h2>
              <div className="space-y-5 text-[16px] md:text-[17px] text-gt-text-muted leading-[1.75] max-w-[680px]">
                <p>
                  The regulation landed in a 200-page PDF. The Scope 3 numbers live across fifteen spreadsheets that nobody has reconciled. The AI answer you just pasted is fluent, authoritative, and cannot be traced to a single source your assurance team will accept.
                </p>
                <p>
                  Monday arrives either way. You ship something thin and hope no one reads it closely, or you stay up again and ship something defensible. The practitioners who keep finding themselves in that week are not lazy or bad at their job. They are missing the <span className="font-semibold text-gt-text">instrument</span>.
                </p>
                <p>
                  The ones who build the instrument stop having that week. Same regulation. Same fifteen spreadsheets. Afternoon of focused work, sourced deliverable, home by six.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========== TWO REALITIES — level 2 → 3 bridge. Old way / new way. ========== */}
        <section className="bg-gt-pale-warm py-24 border-t border-gt-border-light">
          <div className="max-w-[1120px] mx-auto px-8">
            <div className="mb-14">
              <p className={`${MONO_LABEL} text-gt-medium mb-4`}>
                Right now, one of two things is true
              </p>
              <h2 className="text-[32px] md:text-[42px] font-extrabold tracking-gt-tight leading-[1.1] text-gt-text max-w-[720px]">
                The field is quietly splitting into two camps.
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <RealityCard
                tone="dim"
                label="Without a desk"
                items={[
                  'A browser full of tabs and a blank spreadsheet',
                  'ChatGPT answers you cannot trace to a source',
                  'Two-week scramble, every regulation cycle',
                  'The CFO asks a variance question you cannot answer',
                  'Career drag — more hours, same output',
                ]}
                icon={X}
              />
              <RealityCard
                tone="bright"
                label="With a desk"
                items={[
                  'Claude Code + CLAUDE.md tuned to your scope',
                  'Every figure traceable to DEFRA, CEA, or EPA',
                  'Afternoon turnarounds on new briefs',
                  'One-page variance view leadership actually trusts',
                  'Career flywheel — more leverage, same week',
                ]}
                icon={CheckCircle2}
              />
            </div>
          </div>
        </section>

        {/* ========== CURRICULUM — pain & process per week ========== */}
        <section id="curriculum" className="relative bg-gt-text-dark py-28 overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 opacity-25 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(rgba(82,183,136,0.14) 0.5px, transparent 0.5px)',
              backgroundSize: '32px 32px',
            }}
          />
          <div className="relative max-w-[1280px] mx-auto px-8">
            <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
              <div>
                <p className={`${MONO_LABEL} text-gt-leaf mb-4`}>
                  Six weeks · six builds
                </p>
                <h2 className="text-[36px] md:text-[48px] font-extrabold tracking-gt-tight leading-[1.05] text-white max-w-[720px]">
                  One pain. One artefact. Source on every line.
                </h2>
              </div>
              <p className="text-[15px] text-white/60 max-w-[360px] leading-relaxed">
                Monday is a live build on a realistic client brief. Friday you present what you shipped. Nothing in between is abstract.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {CURRICULUM.map(({ week, title, deliverable, pain, body, icon: Icon, mode }, i) => (
                <article
                  key={week}
                  className="relative rounded-2xl bg-gt-card-dark border border-white/5 p-7 hover:border-gt-leaf/40 hover:shadow-gt-glow transition-all"
                >
                  <div
                    aria-hidden
                    className="absolute top-0 left-7 right-7 h-px bg-white/10"
                  />
                  <div className="flex items-center justify-between mb-5">
                    <span className={`${MONO_LABEL} text-gt-leaf`}>{week}</span>
                    <div className="flex items-center gap-3">
                      <span className={`${MONO_LABEL} text-gt-mint bg-gt-medium/20 rounded px-2 py-0.5`}>
                        {mode}
                      </span>
                      <span className="font-redesign-mono text-[10.5px] text-white/40">
                        {String(i + 1).padStart(2, '0')} / 06
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 mb-4">
                    <span className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-gt-leaf/10 border border-gt-leaf/25 shrink-0">
                      <Icon className="w-5 h-5 text-gt-leaf" strokeWidth={1.6} />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-[22px] font-bold tracking-gt-tighter text-white leading-tight mb-1">
                        {title}
                      </h3>
                      <p className={`${MONO_LABEL} text-white/50`}>
                        Deliverable · {deliverable}
                      </p>
                    </div>
                  </div>

                  {/* Pain -> Process within each card */}
                  <p className="text-[14px] italic text-gt-leaf/80 mb-3 leading-[1.55]">
                    “{pain}”
                  </p>
                  <p className="text-[15px] text-white/70 leading-[1.65]">
                    {body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ========== WEEKLY RHYTHM ========== */}
        <section className="bg-gt-pale-warm py-24">
          <div className="max-w-[1120px] mx-auto px-8">
            <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
              <div>
                <p className={`${MONO_LABEL} text-gt-medium mb-3`}>
                  Weekly rhythm
                </p>
                <h2 className="text-[32px] md:text-[42px] font-extrabold tracking-gt-tight leading-[1.1] text-gt-text max-w-[620px]">
                  Arrive with a problem. Leave with an artefact.
                </h2>
              </div>
              <p className="font-redesign-mono text-[12px] text-gt-text-muted uppercase tracking-[0.22em]">
                5–7 hrs per week
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-0 md:gap-px bg-gt-border-light rounded-2xl overflow-hidden shadow-gt-card">
              <FormatPanel
                day="Monday"
                time="09:00 PT · 60 min · Live"
                title="Walk in. Build."
                body="You get a realistic client brief at the top of the hour. By the end of it you have a first working cut of the artefact, with sources attached. No slides."
              />
              <FormatPanel
                day="Tue – Thu"
                time="Async · your schedule"
                title="Make it yours"
                body="Point the build at your own data. The cohort channel is where you surface the strange edge cases. Someone has almost certainly already hit them."
              />
              <FormatPanel
                day="Friday"
                time="09:00 PT · 90 min · Live"
                title="Defend the artefact"
                body="Three minutes to present what you shipped. The cohort reads it the way a reviewer would, and tells you exactly where it would hold or break."
              />
            </div>
          </div>
        </section>

        {/* ========== WHO'S IN THE ROOM — testimony substitute for Cohort 01 ========== */}
        <section className="bg-gt-pale py-24">
          <div className="max-w-[1120px] mx-auto px-8">
            <div className="grid md:grid-cols-[260px_1fr] gap-12 mb-10">
              <div>
                <p className={`${MONO_LABEL} text-gt-medium mb-3`}>
                  Who's in the room
                </p>
                <div className="w-12 h-px bg-gt-text/20" />
              </div>
              <h2 className="text-[32px] md:text-[40px] font-extrabold tracking-gt-tight leading-[1.1] text-gt-text max-w-[640px]">
                The seven seats already taken.
              </h2>
            </div>

            <div className="md:pl-[284px] grid md:grid-cols-3 gap-5">
              {ROOM.map((p) => (
                <article
                  key={p.role}
                  className="relative rounded-2xl bg-white border border-gt-border-light p-6 shadow-gt-card"
                >
                  <p className={`${MONO_LABEL} text-gt-medium mb-3`}>
                    Applicant
                  </p>
                  <h3 className="text-[18px] font-bold tracking-gt-tighter text-gt-text mb-1">
                    {p.role}
                  </h3>
                  <p className="text-[13.5px] text-gt-text-muted mb-4 leading-[1.55]">
                    {p.context}
                  </p>
                  <div className="pt-4 border-t border-gt-border-light">
                    <p className={`${MONO_LABEL} text-gt-text-muted mb-2`}>
                      Why they applied
                    </p>
                    <p className="text-[14px] text-gt-text leading-[1.6]">
                      {p.goal}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <p className="md:pl-[284px] font-redesign-mono text-[11px] text-gt-text-muted mt-6">
              Anonymised from live applications · Cohort 01 · updated daily
            </p>
          </div>
        </section>

        {/* ========== OUTCOMES ========== */}
        <section className="bg-gt-text-dark py-24">
          <div className="max-w-[1120px] mx-auto px-8">
            <div className="grid md:grid-cols-[280px_1fr] gap-12 mb-12">
              <div>
                <p className={`${MONO_LABEL} text-gt-leaf mb-3`}>
                  What you walk out with
                </p>
                <div className="w-12 h-px bg-white/20" />
              </div>
              <h2 className="text-[32px] md:text-[42px] font-extrabold tracking-gt-tight leading-[1.1] text-white max-w-[640px]">
                Not a certificate. A practice.
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10 md:pl-[292px]">
              {OUTCOMES.map(({ title, body, icon: Icon }, i) => (
                <div key={title} className="flex gap-5">
                  <span className="font-redesign-mono text-[11px] font-bold text-gt-leaf/70 pt-1 shrink-0 w-8">
                    0{i + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-gt-leaf" strokeWidth={1.8} />
                      <h3 className="text-[18px] font-bold tracking-gt-tighter text-white">
                        {title}
                      </h3>
                    </div>
                    <p className="text-[14.5px] text-white/65 leading-[1.65]">
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== RISK REVERSAL — loud, repeated ========== */}
        <section className="bg-gt-leaf/10 border-y border-gt-leaf/20 py-10">
          <div className="max-w-[1120px] mx-auto px-8 grid md:grid-cols-3 gap-6">
            <RiskItem
              icon={ShieldCheck}
              label="Refundable"
              body="Full refund up to 7 days before start. No questions."
            />
            <RiskItem
              icon={Clock}
              label="Two-day reply"
              body="Every application gets a human response inside two business days."
            />
            <RiskItem
              icon={FileText}
              label="Manager memo on acceptance"
              body="One-page memo explaining what you're building and why it matters, ready to forward."
            />
          </div>
        </section>

        {/* ========== DETAILS + APPLY ========== */}
        <section id="apply" className="bg-gt-pale py-28">
          <div className="max-w-[1280px] mx-auto px-8 grid lg:grid-cols-[0.85fr_1.15fr] gap-12">
            <div>
              <p className={`${MONO_LABEL} text-gt-medium mb-4`}>
                Program details
              </p>
              <h2 className="text-[32px] md:text-[40px] font-extrabold tracking-gt-tight leading-[1.08] text-gt-text mb-10">
                What you are signing up for.
              </h2>

              <dl className="space-y-0 mb-12 border-t border-gt-border-light">
                <DetailRow label="Program length" value="6 weeks" />
                <DetailRow label="Next cohort" value="Jul 6 – Aug 14, 2026" />
                <DetailRow label="Cohort size" value="15 seats (capped)" />
                <DetailRow label="Investment" value="$150 · one-time" />
                <DetailRow label="Format" value="Live + async" />
                <DetailRow label="Instructors" value="The Greentryst team" />
                <DetailRow label="Eligibility" value="Familiarity with sustainability basics" />
              </dl>

              <div className="relative rounded-2xl bg-gt-card-dark text-white p-7 shadow-[0_20px_60px_rgba(24,24,27,0.18)]">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gt-leaf" />
                <p className={`${MONO_LABEL} text-gt-leaf mb-5`}>
                  Application process
                </p>
                <ol className="space-y-4">
                  <ProcessStep
                    n={1}
                    title="Apply"
                    body="A short interview form. We read it carefully. What you want to build matters more than years on the title."
                  />
                  <ProcessStep
                    n={2}
                    title="We reply"
                    body="Two business days. Accept, waitlist, or a candid decline with a reason. No black holes."
                  />
                  <ProcessStep
                    n={3}
                    title="Pay + enrol"
                    body="A $150 payment holds your seat. Refundable up to seven days before start, no questions asked."
                  />
                </ol>
              </div>
            </div>

            <div>
              <CohortApplyForm />
            </div>
          </div>
        </section>

        {/* ========== FAQ ========== */}
        <section className="bg-gt-pale-warm py-24 border-t border-gt-border-light">
          <div className="max-w-[880px] mx-auto px-8">
            <div className="mb-12">
              <p className={`${MONO_LABEL} text-gt-medium mb-3`}>
                FAQ
              </p>
              <h2 className="text-[32px] md:text-[40px] font-extrabold tracking-gt-tight leading-[1.08] text-gt-text">
                Common questions.
              </h2>
            </div>
            <div className="border-t border-gt-border-light">
              {FAQ.map(({ q, a }) => (
                <details
                  key={q}
                  className="group border-b border-gt-border-light py-6"
                >
                  <summary className="flex justify-between items-baseline cursor-pointer list-none gap-6">
                    <span className="text-[17px] md:text-[19px] font-bold tracking-gt-tighter text-gt-text pr-6 leading-snug">
                      {q}
                    </span>
                    <span className="font-redesign-mono text-[20px] text-gt-medium group-open:rotate-45 transition-transform shrink-0">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-[15.5px] text-gt-text-muted leading-[1.75] max-w-[680px]">
                    {a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ========== CLOSING CTA — named process repeated, risk reversal loud ========== */}
        <section className="relative overflow-hidden bg-gt-text-dark py-24">
          <div
            aria-hidden
            className="absolute -top-32 right-1/4 w-[520px] h-[520px] bg-gt-medium/15 rounded-full blur-[140px] pointer-events-none"
          />
          <div className="relative max-w-[880px] mx-auto px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              {PROCESS.map((word, i) => (
                <span key={word} className="flex items-center gap-3">
                  <span className={`${MONO_LABEL} text-gt-leaf`}>{word}</span>
                  {i < PROCESS.length - 1 && (
                    <span className="w-1 h-1 rounded-full bg-gt-leaf/50" />
                  )}
                </span>
              ))}
            </div>
            <h2 className="text-[36px] md:text-[52px] font-extrabold tracking-gt-tight leading-[1.05] text-white mb-6 max-w-[720px] mx-auto">
              Six weeks. Fifteen practitioners.
              <br />
              <span className="text-gt-leaf">One desk that sticks.</span>
            </h2>
            <p className="text-[16px] md:text-[17px] text-white/65 mb-8 leading-relaxed max-w-[560px] mx-auto">
              July 6 to August 14, 2026. $150 all-in, refundable to day seven. We read every application in the order it lands and reply inside two business days.
            </p>
            <a
              href="#apply"
              className="inline-flex items-center gap-2 rounded-lg bg-gt-leaf hover:bg-white text-gt-text-dark font-semibold text-[14px] px-6 py-3 transition-colors"
            >
              Apply to Cohort 01
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <p className="font-redesign-mono text-[11px] text-white/40 mt-6">
              07 / 15 seats taken · rolling review
            </p>
          </div>
        </section>
      </main>

      <RedesignFooter />
    </div>
  );
}

/* ---------- local components ---------- */

function HeroMeta({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div>
      <div className={`${MONO_LABEL} text-gt-leaf/80 mb-2`}>{label}</div>
      <div className="font-redesign-mono text-[22px] font-bold text-white leading-none mb-1">
        {value}
      </div>
      <div className="font-redesign-mono text-[11px] text-white/45">{sub}</div>
    </div>
  );
}

function SnapshotRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={`${MONO_LABEL} text-white/50`}>{label}</dt>
      <dd className="font-redesign-mono text-[13px] font-semibold text-white text-right">
        {value}
      </dd>
    </div>
  );
}

function RealityCard({
  tone,
  label,
  items,
  icon: Icon,
}: {
  tone: 'dim' | 'bright';
  label: string;
  items: string[];
  icon: LucideIcon;
}) {
  const isBright = tone === 'bright';
  return (
    <div
      className={
        isBright
          ? 'relative rounded-2xl bg-gt-card-dark text-white p-8 shadow-[0_20px_60px_rgba(24,24,27,0.18)] overflow-hidden'
          : 'relative rounded-2xl bg-white border border-gt-border-light p-8 shadow-gt-card'
      }
    >
      {isBright && (
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gt-leaf" />
      )}
      <p
        className={`${MONO_LABEL} mb-6 ${
          isBright ? 'text-gt-leaf' : 'text-gt-text-muted'
        }`}
      >
        {label}
      </p>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <Icon
              className={`w-4 h-4 mt-1 shrink-0 ${
                isBright ? 'text-gt-leaf' : 'text-gt-text-muted/60'
              }`}
              strokeWidth={1.8}
            />
            <span
              className={`text-[15px] leading-[1.6] ${
                isBright ? 'text-white/85' : 'text-gt-text-muted'
              }`}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RiskItem({
  icon: Icon,
  label,
  body,
}: {
  icon: LucideIcon;
  label: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gt-leaf/20 border border-gt-leaf/30 shrink-0">
        <Icon className="w-4 h-4 text-gt-medium" strokeWidth={2} />
      </span>
      <div>
        <div className="text-[14px] font-bold text-gt-text tracking-gt-tighter mb-1">
          {label}
        </div>
        <div className="text-[13.5px] text-gt-text-muted leading-[1.55]">
          {body}
        </div>
      </div>
    </div>
  );
}

function FormatPanel({
  day,
  time,
  title,
  body,
}: {
  day: string;
  time: string;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-white p-8">
      <div className="flex items-baseline justify-between mb-6">
        <span className="font-redesign-mono text-[13px] font-bold uppercase tracking-[0.2em] text-gt-medium">
          {day}
        </span>
        <span className="font-redesign-mono text-[10.5px] text-gt-text-dim">
          {time}
        </span>
      </div>
      <h3 className="text-[22px] font-bold tracking-gt-tighter text-gt-text leading-tight mb-3">
        {title}
      </h3>
      <p className="text-[14.5px] text-gt-text-muted leading-[1.7]">{body}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline gap-6 border-b border-gt-border-light py-4">
      <dt className={`${MONO_LABEL} text-gt-text-muted`}>{label}</dt>
      <dd className="text-[15px] font-semibold text-gt-text text-right">
        {value}
      </dd>
    </div>
  );
}

function ProcessStep({
  n,
  title,
  body,
}: {
  n: number;
  title: string;
  body: string;
}) {
  return (
    <li className="flex gap-4">
      <span className="font-redesign-mono text-[11px] font-bold text-gt-leaf pt-1 shrink-0 w-6">
        0{n}
      </span>
      <div>
        <div className="text-[15px] font-bold text-white tracking-gt-tighter">
          {title}
        </div>
        <div className="text-[13.5px] text-white/60 leading-[1.6] mt-0.5">
          {body}
        </div>
      </div>
    </li>
  );
}
