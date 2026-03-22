import type { Metadata } from 'next';
import JobsClient from './_components/JobsClient';

export const metadata: Metadata = {
  title: 'Sustainability Jobs Directory - Green Tryst',
  description:
    'Browse curated sustainability jobs across climate risk, carbon markets, ESG, and green finance. Updated regularly with opportunities from top employers.',
};

export const dynamic = 'force-dynamic';

export default function JobsPage() {
  return <JobsClient />;
}
