import type { Metadata } from 'next';
import { Nav } from '@/components/Nav';
import { RedesignFooter } from '@/components/redesign';
import LiquidityClient from './_components/LiquidityClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { datasetSchema, breadcrumbList } from '@/lib/seo/schema';
import { SITE_ORIGIN } from '@/lib/site';

const LIQUIDITY_DATASET = datasetSchema({
  url: `${SITE_ORIGIN}/carbon/liquidity`,
  name: 'Greentryst Carbon Market Liquidity',
  description:
    'Per-methodology liquidity ratio across every indexed carbon registry. Quantifies how much of the live supply (retired + outstanding) has actually cleared the market.',
  keywords: [
    'carbon market liquidity',
    'zombie projects',
    'outstanding credits',
    'voluntary carbon market demand',
    'credit supply analytics',
  ],
  variableMeasured: [
    'Liquidity ratio (retired / (retired + outstanding))',
    'Outstanding stockpile per methodology',
    'Projects with zero retirements',
  ],
  distributionUrl: `${SITE_ORIGIN}/carbon-market-credits-summary.json`,
  distributionFormat: 'application/json',
  license: `${SITE_ORIGIN}/fair-use`,
});
const LIQUIDITY_BREADCRUMBS = breadcrumbList([
  { name: 'Home', url: '/' },
  { name: 'Carbon', url: '/carbon/market' },
  { name: 'Liquidity' },
]);

export const metadata: Metadata = {
  title: 'Carbon Market Liquidity',
  description:
    'Liquidity ratio per methodology across Verra, Gold Standard, ACR, CAR, ART, and GCC. Separate high-demand assets from zombie stockpile.',
  alternates: { canonical: '/carbon/liquidity' },
  openGraph: {
    title: 'Carbon Market Liquidity',
    description:
      'Spot zombie supply vs. high-demand methodologies. Liquidity ratio per methodology across 11 registries.',
    url: '/carbon/liquidity',
  },
};

export const dynamic = 'force-static';

export default function Page() {
  return (
    <>
      <JsonLd data={LIQUIDITY_DATASET} />
      <JsonLd data={LIQUIDITY_BREADCRUMBS} />
      <Nav />
      <LiquidityClient />
      <RedesignFooter />
    </>
  );
}
