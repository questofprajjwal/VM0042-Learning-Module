'use server';

import { auth } from '@clerk/nextjs/server';
import { getJobDetail, getJobsPreview } from '@/lib/jobs';
import type { JobDetail } from '@/lib/jobs';

const PREVIEW_COUNT = 5;

export async function fetchJobDetail(jobUrl: string): Promise<JobDetail | null> {
  const { userId } = await auth();

  if (!userId) {
    // Allow detail fetches only for the 5 preview jobs
    const previewUrls = new Set(getJobsPreview(PREVIEW_COUNT).map(j => j.jobUrl));
    if (!previewUrls.has(jobUrl)) return null;
  }

  return getJobDetail(jobUrl);
}
