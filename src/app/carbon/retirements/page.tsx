import type { Metadata } from 'next';
import { Nav } from '@/components/Nav';
import { RedesignFooter } from '@/components/redesign';
import RetirementsClient from './_components/RetirementsClient';

export const metadata: Metadata = {
  title: 'Carbon Retirement Leaderboard | Greentryst',
  description:
    'Who retired the most carbon credits across Verra, Gold Standard, ACR, CAR, and other registries. Search by beneficiary, filter by registry, and verify corporate net zero claims against the public record.',
  openGraph: {
    title: 'Carbon Retirement Leaderboard',
    description:
      'Corporate retirement intelligence across 11 carbon registries. Search 2,700+ beneficiaries, see verified retirement volumes.',
    url: 'https://greentryst.com/carbon/retirements',
  },
};

export const dynamic = 'force-static';

export default function Page() {
  return (
    <>
      <Nav />
      <RetirementsClient />
      <RedesignFooter />
    </>
  );
}
