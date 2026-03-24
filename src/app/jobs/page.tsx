import type { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { getJobsFiltered, getJobsMeta, getJobsPreview } from '@/lib/jobs';
import type { JobsMeta } from '@/lib/jobs';
import JobsClient from './_components/JobsClient';

export const metadata: Metadata = {
  title: 'Sustainability Jobs Directory - Green Tryst',
  description:
    'Browse curated sustainability jobs across climate risk, carbon markets, ESG, and green finance. Updated regularly with opportunities from top employers.',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

const FREE_PREVIEW_COUNT = 5;

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function JobsPage({ searchParams }: Props) {
  const { userId } = await auth();
  const isAuthenticated = !!userId;
  const fullMeta = getJobsMeta();

  if (!isAuthenticated) {
    // Only expose profile names and vague total, not exact counts or filter options
    const guestMeta: JobsMeta = {
      totalJobCount: fullMeta.totalJobCount,
      totalCompanies: fullMeta.totalCompanies,
      totalRemote: fullMeta.totalRemote,
      profileCounts: Object.fromEntries(
        Object.keys(fullMeta.profileCounts).map(k => [k, 0])
      ),
      companyTypes: [],
      countries: [],
    };

    const previewJobs = getJobsPreview(FREE_PREVIEW_COUNT);
    return (
      <JobsClient
        jobs={previewJobs}
        total={FREE_PREVIEW_COUNT}
        page={1}
        perPage={FREE_PREVIEW_COUNT}
        totalPages={1}
        meta={guestMeta}
        isAuthenticated={false}
        filters={{}}
      />
    );
  }

  const params = await searchParams;
  const filters = {
    profile: typeof params.profile === 'string' ? params.profile : undefined,
    companyType: typeof params.companyType === 'string' ? params.companyType : undefined,
    country: typeof params.country === 'string' ? params.country : undefined,
    remote: typeof params.remote === 'string' ? params.remote : undefined,
    search: typeof params.search === 'string' ? params.search : undefined,
    sort: (typeof params.sort === 'string' ? params.sort : 'relevance') as 'relevance' | 'latest',
    page: typeof params.page === 'string' && Number.isFinite(parseInt(params.page, 10)) ? parseInt(params.page, 10) : 1,
    perPage: typeof params.perPage === 'string' && Number.isFinite(parseInt(params.perPage, 10)) ? parseInt(params.perPage, 10) : 15,
  };

  const result = getJobsFiltered(filters);

  return (
    <JobsClient
      jobs={result.jobs}
      total={result.total}
      page={result.page}
      perPage={result.perPage}
      totalPages={result.totalPages}
      meta={fullMeta}
      isAuthenticated={true}
      filters={filters}
    />
  );
}
