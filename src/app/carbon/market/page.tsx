import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Nav } from '@/components/Nav';
import { RedesignFooter } from '@/components/redesign';
import CarbonMarketClient from './_components/CarbonMarketClient';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Carbon Market Intelligence',
  description:
    'Search 9,603 carbon credit projects from Verra VCS, Gold Standard, CCB, and Plastic Waste Reduction registries. Filter by methodology, country, vintage, and certification. Updated nightly.',
  alternates: { canonical: '/carbon/market' },
  openGraph: {
    title: 'Carbon Market Intelligence | Greentryst',
    description:
      'A live index of 9,603 voluntary carbon market projects. Verra VCS, CCB, PWRP, and Gold Standard in one place.',
    url: 'https://greentryst.com/carbon/market',
    siteName: 'Greentryst',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Carbon Market Intelligence | Greentryst',
    description:
      'A live index of 9,603 voluntary carbon market projects from Verra and Gold Standard.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'Greentryst Carbon Market Index',
  description:
    'Normalized catalogue of voluntary carbon market projects from Verra VCS, Verra CCB, Verra PWRP, and Gold Standard registries.',
  url: 'https://greentryst.com/carbon/market',
  creator: { '@type': 'Organization', name: 'Greentryst' },
  distribution: [
    {
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: 'https://greentryst.com/carbon-market-index.json',
    },
  ],
  variableMeasured: [
    'Projects registered',
    'VCUs issued',
    'VCUs retired',
    'Buffer pool credits',
  ],
  isAccessibleForFree: true,
};

export default function CarbonMarketPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav tone="dark" />
      <Suspense fallback={null}>
        <CarbonMarketClient />
      </Suspense>
      <RedesignFooter />
    </>
  );
}
