import type { Metadata } from 'next';
import { Nav } from '@/components/Nav';
import { RedesignFooter } from '@/components/redesign';
import SankeyClient from './_components/SankeyClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { datasetSchema, breadcrumbList } from '@/lib/seo/schema';
import { SITE_ORIGIN } from '@/lib/site';

const SANKEY_DATASET = datasetSchema({
  url: `${SITE_ORIGIN}/carbon/sankey`,
  name: 'Greentryst Carbon Credit Flow Map',
  description:
    'Sankey flow of indexed carbon credits from project category through registry to retirement outcome. Visualizes where supply originates and how much of it has actually cleared.',
  keywords: [
    'carbon credit flow',
    'sankey carbon',
    'registry issuance flow',
    'voluntary carbon market structure',
  ],
  variableMeasured: [
    'Credits issued per category',
    'Credits by registry',
    'Credits retired vs outstanding',
  ],
  license: `${SITE_ORIGIN}/fair-use`,
});
const SANKEY_BREADCRUMBS = breadcrumbList([
  { name: 'Home', url: '/' },
  { name: 'Carbon', url: '/carbon/market' },
  { name: 'Credit Flow' },
]);

export const metadata: Metadata = {
  title: 'Carbon Credit Flow',
  description:
    'Visualize every indexed carbon credit from project category through registry to retirement. One picture of the voluntary and compliance carbon market.',
  alternates: { canonical: '/carbon/sankey' },
  openGraph: {
    title: 'Carbon Credit Flow',
    description:
      'Sankey of carbon credit flow: category → registry → retired vs outstanding. 2.2B+ credits mapped.',
    url: '/carbon/sankey',
  },
};

export const dynamic = 'force-static';

export default function Page() {
  return (
    <>
      <JsonLd data={SANKEY_DATASET} />
      <JsonLd data={SANKEY_BREADCRUMBS} />
      <Nav />
      <SankeyClient />
      <RedesignFooter />
    </>
  );
}
