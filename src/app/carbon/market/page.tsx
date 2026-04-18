import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Nav } from '@/components/Nav';
import { RedesignFooter } from '@/components/redesign';
import CarbonMarketClient from './_components/CarbonMarketClient';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Carbon Market Intelligence',
  description:
    'Search 12,234 carbon credit projects from Verra VCS, CCB, PWRP, Gold Standard, American Carbon Registry (ACR), Climate Action Reserve (CAR), and ART TREES. Filter by methodology, country, vintage, and certification. Updated nightly.',
  alternates: { canonical: '/carbon/market' },
  openGraph: {
    title: 'Carbon Market Intelligence | Greentryst',
    description:
      'A live index of 12,234 voluntary and compliance carbon market projects across Verra, Gold Standard, ACR, CAR, and ART TREES.',
    url: 'https://greentryst.com/carbon/market',
    siteName: 'Greentryst',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Carbon Market Intelligence | Greentryst',
    description:
      'A live index of 12,234 carbon market projects across Verra, Gold Standard, ACR, CAR, and ART TREES.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'Greentryst Carbon Market Index',
  description:
    'Normalized catalogue of voluntary and compliance carbon market projects from Verra VCS, Verra CCB, Verra PWRP, Gold Standard, American Carbon Registry (ACR), Climate Action Reserve (CAR) including CAR Compliance (ARB / Ecology), and ART TREES.',
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
