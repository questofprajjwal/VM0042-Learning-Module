'use server';

import { auth } from '@clerk/nextjs/server';
import { getJobDetail } from '@/lib/jobs';
import type { JobDetail } from '@/lib/jobs';

export async function fetchJobDetail(jobUrl: string): Promise<JobDetail | null> {
  const { userId } = await auth();
  if (!userId) return null;
  return getJobDetail(jobUrl);
}
