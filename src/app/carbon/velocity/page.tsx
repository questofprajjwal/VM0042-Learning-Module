import type { Metadata } from 'next';
import { Nav } from '@/components/Nav';
import { RedesignFooter } from '@/components/redesign';
import VelocityClient from './_components/VelocityClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { datasetSchema, breadcrumbList } from '@/lib/seo/schema';
import { SITE_ORIGIN } from '@/lib/site';

const VELOCITY_DATASET = datasetSchema({
  url: `${SITE_ORIGIN}/carbon/velocity`,
  name: 'Greentryst Carbon Retirement Velocity',
  description:
    'Retirement-to-issuance velocity and time-to-retire across every indexed carbon methodology. Use to spot methodologies with fast offtake versus those accumulating zombie supply.',
  keywords: [
    'retirement velocity',
    'carbon credit velocity',
    'VCS methodology retirement',
    'time to retire',
    'voluntary carbon market analytics',
  ],
  variableMeasured: [
    'Retirement velocity (retired / issued)',
    'Median time-to-retire in years',
    'Issued credits per methodology',
    'Retired credits per methodology',
  ],
  distributionUrl: `${SITE_ORIGIN}/carbon-market-credits-summary.json`,
  distributionFormat: 'application/json',
  license: `${SITE_ORIGIN}/fair-use`,
});
const VELOCITY_BREADCRUMBS = breadcrumbList([
  { name: 'Home', url: '/' },
  { name: 'Carbon', url: '/carbon/market' },
  { name: 'Retirement Velocity' },
]);

export const metadata: Metadata = {
  title: 'Carbon Retirement Velocity',
  description:
    'Which methodologies actually retire the credits they issue. Velocity (retired / issued), time-to-retire, and outstanding stockpile across Verra, Gold Standard, ACR, CAR, ART, and GCC.',
  alternates: { canonical: '/carbon/velocity' },
  openGraph: {
    title: 'Carbon Retirement Velocity',
    description:
      'Retirement-to-issuance velocity across every indexed carbon methodology. Spot fast-moving standards vs. zombie stockpiles.',
    url: '/carbon/velocity',
  },
};

export const dynamic = 'force-static';

export default function Page() {
  return (
    <>
      <JsonLd data={VELOCITY_DATASET} />
      <JsonLd data={VELOCITY_BREADCRUMBS} />
      <Nav />
      <VelocityClient />
      <RedesignFooter />
    </>
  );
}
