import type { Metadata } from 'next';
import { Nav } from '@/components/Nav';
import { RedesignFooter } from '@/components/redesign';
import DevelopersClient from './_components/DevelopersClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { datasetSchema, breadcrumbList } from '@/lib/seo/schema';
import { SITE_ORIGIN } from '@/lib/site';

const DEV_DATASET = datasetSchema({
  url: `${SITE_ORIGIN}/carbon/developers`,
  name: 'Greentryst Carbon Project Developer Trust Index',
  description:
    'Project developers ranked across every indexed carbon registry by execution rate, retirement rate, and portfolio diversification. Use to screen counterparties before contracting pre-issuance credits.',
  keywords: [
    'carbon project developer',
    'developer trust index',
    'project execution',
    'counterparty screening',
    'carbon market due diligence',
  ],
  variableMeasured: [
    'Projects per developer',
    'Execution rate (projects with issuance / total)',
    'Retirement rate (retired / issued)',
    'Diversification across methodologies, registries, countries',
  ],
  distributionUrl: `${SITE_ORIGIN}/carbon-market-index.json`,
  distributionFormat: 'application/json',
  license: `${SITE_ORIGIN}/fair-use`,
});
const DEV_BREADCRUMBS = breadcrumbList([
  { name: 'Home', url: '/' },
  { name: 'Carbon', url: '/carbon/market' },
  { name: 'Developers' },
]);

export const metadata: Metadata = {
  title: 'Carbon Project Developers',
  description:
    'Trust index for 1,800+ carbon project developers across Verra, Gold Standard, ACR, CAR, ART, and GCC. Execution rate, retirement rate, and portfolio diversification in one ranking.',
  alternates: { canonical: '/carbon/developers' },
  openGraph: {
    title: 'Carbon Project Developer Trust Index',
    description:
      'Screen carbon project developers on execution, retirement, and diversification. Built from 13,000+ indexed projects.',
    url: '/carbon/developers',
  },
};

export const dynamic = 'force-static';

export default function Page() {
  return (
    <>
      <JsonLd data={DEV_DATASET} />
      <JsonLd data={DEV_BREADCRUMBS} />
      <Nav />
      <DevelopersClient />
      <RedesignFooter />
    </>
  );
}
