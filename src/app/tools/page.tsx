/**
 * Tools hub index. Flagship tile is Emission Factors; other planned tools
 * (GHG Calculator, Report Drafter, BRSR Screener) appear as Coming soon.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { Library, Calculator, FileText, ClipboardCheck, ArrowRight, type LucideIcon } from 'lucide-react';
import { Nav } from '@/components/Nav';
import {
  RedesignFooter,
  LightSection,
  CategoryLabel,
  SectionHeading,
} from '@/components/redesign';

export const metadata: Metadata = {
  title: 'Tools - Greentryst',
  description:
    'Practitioner tools for sustainability reporting. Emission Factors, GHG Calculator, Report Drafter, BRSR Screener.',
  alternates: { canonical: 'https://greentryst.com/tools' },
  openGraph: {
    type: 'website',
    url: 'https://greentryst.com/tools',
    title: 'Tools - Greentryst',
    siteName: 'Greentryst',
    description:
      'Practitioner tools for sustainability reporting, built on verified data.',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

interface ToolCard {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string | null;
  cta: string;
  status: 'live' | 'soon';
}

const TOOLS: ToolCard[] = [
  {
    id: 'emission-factors',
    title: 'Emission Factors',
    description: 'Every emission factor. Sourced, dated, and free.',
    icon: Library,
    href: '/tools/emission-factors',
    cta: 'Open tool',
    status: 'live',
  },
  {
    id: 'ghg-calculator',
    title: 'GHG Calculator',
    description:
      'Compute organisational inventories across Scope 1, 2, and 3 using the Emission Factors library.',
    icon: Calculator,
    href: null,
    cta: 'Coming soon',
    status: 'soon',
  },
  {
    id: 'report-drafter',
    title: 'Report Drafter',
    description:
      'Structured drafting for CSRD, BRSR, and TCFD with cited numbers linked to primary sources.',
    icon: FileText,
    href: null,
    cta: 'Coming soon',
    status: 'soon',
  },
  {
    id: 'brsr-screener',
    title: 'BRSR Screener',
    description:
      'Map your disclosures against the Indian BRSR Core and flag gaps before assurance.',
    icon: ClipboardCheck,
    href: null,
    cta: 'Coming soon',
    status: 'soon',
  },
];

export default function ToolsHubPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-gt-pale text-gt-text">
        <LightSection padding="lg" variant="pale">
          <div className="max-w-3xl">
            <CategoryLabel>Tools</CategoryLabel>
            <SectionHeading size="hero" className="mt-3">
              Tools for sustainability practitioners
            </SectionHeading>
            <p className="mt-4 text-lg text-gt-text-muted">
              Greentryst tools share one backbone: every number carries a source, a
              vintage, and a one-click citation. Start with the Emission Factors
              library; more tools build on top of it.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {TOOLS.map((t) => (
              <ToolCardView key={t.id} tool={t} />
            ))}
          </div>
        </LightSection>
      </main>
      <RedesignFooter />
    </>
  );
}

function ToolCardView({ tool }: { tool: ToolCard }) {
  const Icon = tool.icon;
  const inner = (
    <div className="group rounded-2xl bg-white border border-gt-border-light shadow-gt-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-[#e6f3f1] flex items-center justify-center">
          <Icon className="h-5 w-5 text-[#005c55]" aria-hidden strokeWidth={2} />
        </div>
        {tool.status === 'soon' && (
          <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-gt-text-dim">
            Coming soon
          </span>
        )}
      </div>
      <h3 className="mt-4 text-xl font-bold tracking-gt-tight text-gt-text">
        {tool.title}
      </h3>
      <p className="mt-2 text-sm text-gt-text-muted flex-1">{tool.description}</p>
      <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#005c55] group-hover:gap-2.5 transition-all">
        {tool.cta}
        {tool.status === 'live' && <ArrowRight className="h-4 w-4" aria-hidden />}
      </div>
    </div>
  );
  if (tool.href) {
    return (
      <Link href={tool.href} className="block">
        {inner}
      </Link>
    );
  }
  return <div className="opacity-80">{inner}</div>;
}
