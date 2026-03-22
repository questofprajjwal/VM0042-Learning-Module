import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';

export interface JobRow {
  datePosted: string | null;
  profile: string;
  title: string;
  company: string;
  companyType: string;
  location: string | null;
  jobType: string | null;
  jobLevel: string | null;
  remote: boolean;
  experience: string | null;
  roleSummary: string | null;
  skillsRequired: string | null;
  domainContext: string | null;
  relevance: number;
  jobUrl: string;
}

export async function GET() {
  const filePath = path.join(process.cwd(), 'src', 'jobs', 'jobs.xlsx');

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Jobs file not found' }, { status: 404 });
  }

  const buf = fs.readFileSync(filePath);
  const workbook = XLSX.read(buf, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

  const jobs: JobRow[] = raw.map((row) => ({
    datePosted: row['Date Posted'] ? String(row['Date Posted']) : null,
    profile: String(row['Profile'] ?? ''),
    title: String(row['Title'] ?? ''),
    company: String(row['Company'] ?? ''),
    companyType: String(row['Company Type'] ?? ''),
    location: row['Location'] ? String(row['Location']) : null,
    jobType: row['Job Type'] ? String(row['Job Type']) : null,
    jobLevel: row['Job Level'] ? String(row['Job Level']) : null,
    remote: row['Remote'] === true || String(row['Remote']).toUpperCase() === 'TRUE',
    experience: row['Experience'] ? String(row['Experience']) : null,
    roleSummary: row['Role Summary'] ? String(row['Role Summary']) : null,
    skillsRequired: row['Skills Required'] ? String(row['Skills Required']) : null,
    domainContext: row['Domain Context'] ? String(row['Domain Context']) : null,
    relevance: Number(row['Relevance'] ?? 0),
    jobUrl: String(row['Job URL'] ?? ''),
  }));

  // Sort: relevance DESC, then date posted DESC
  jobs.sort((a, b) => {
    if (b.relevance !== a.relevance) return b.relevance - a.relevance;
    const da = a.datePosted ? new Date(a.datePosted).getTime() : 0;
    const db = b.datePosted ? new Date(b.datePosted).getTime() : 0;
    return db - da;
  });

  return NextResponse.json(jobs);
}
