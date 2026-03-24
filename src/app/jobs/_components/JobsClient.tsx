'use client';

import { useState, useEffect, useRef, useCallback, Fragment } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PlatformNav from '@/components/platform/PlatformNav';
import Footer from '@/components/platform/Footer';
import type { JobSummary, JobDetail, JobsMeta } from '@/lib/jobs';
import { fetchJobDetail } from '../actions';

function useAntiScrape(containerRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const block = (e: Event) => e.preventDefault();
    el.addEventListener('copy', block);
    el.addEventListener('cut', block);
    el.addEventListener('contextmenu', block);
    el.addEventListener('dragstart', block);

    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'x' || e.key === 'u')) {
        e.preventDefault();
      }
    };
    el.addEventListener('keydown', onKeyDown);

    return () => {
      el.removeEventListener('copy', block);
      el.removeEventListener('cut', block);
      el.removeEventListener('contextmenu', block);
      el.removeEventListener('dragstart', block);
      el.removeEventListener('keydown', onKeyDown);
    };
  }, [containerRef]);
}

const PROFILE_LABELS: Record<string, string> = {
  all: 'All Roles',
  climate_risk: 'Climate Risk',
  sustainable_finance: 'Sustainable Finance',
  eu_taxonomy_sfdr: 'EU Taxonomy / SFDR',
  carbon_markets: 'Carbon Markets',
  clean_energy_adjacent: 'Clean Energy',
};

const PROFILE_PILL: Record<string, string> = {
  climate_risk: 'bg-rose-50 text-rose-700 border-rose-100',
  sustainable_finance: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  eu_taxonomy_sfdr: 'bg-violet-50 text-violet-700 border-violet-100',
  carbon_markets: 'bg-amber-50 text-amber-700 border-amber-100',
  clean_energy_adjacent: 'bg-cyan-50 text-cyan-700 border-cyan-100',
};

const COURSE_SUGGESTIONS: Record<string, { label: string; href: string }[]> = {
  climate_risk: [
    { label: 'Climate Science 101', href: '/courses/climate-science-101' },
    { label: 'IFRS S2 Climate Disclosures', href: '/courses/ifrs-s2' },
  ],
  sustainable_finance: [
    { label: 'ESG Reporting', href: '/courses/esg-reporting' },
    { label: 'EU Taxonomy', href: '/courses/eu-taxonomy' },
  ],
  carbon_markets: [
    { label: 'Voluntary Carbon Markets 101', href: '/courses/vcm-101' },
    { label: 'GHG Scope 3 Accounting', href: '/courses/ghg-scope-3' },
  ],
  eu_taxonomy_sfdr: [
    { label: 'EU Taxonomy', href: '/courses/eu-taxonomy' },
    { label: 'EU SFDR', href: '/courses/eu-sfdr' },
  ],
  clean_energy_adjacent: [
    { label: 'Climate Science 101', href: '/courses/climate-science-101' },
    { label: 'TNFD & Biodiversity', href: '/courses/tnfd-biodiversity' },
  ],
};

function formatProfile(p: string) {
  return PROFILE_LABELS[p] ?? p.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function formatDate(d: string | null) {
  if (!d) return '';
  if (d.includes('week') || d.includes('day') || d.includes('hour')) return d;
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'Today';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 30) return `${diffDays} days ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffDays < 60) return `${diffWeeks} weeks ago`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths} months ago`;
}

function capitalize(s: string) {
  return s.replace(/\b\w/g, c => c.toUpperCase());
}

const HIGHLIGHT_KEYWORDS = [
  'climate risk', 'climate change', 'carbon markets', 'carbon footprint', 'carbon credits',
  'carbon accounting', 'carbon offset', 'ESG', 'TCFD', 'TNFD', 'ISSB', 'IFRS S2', 'CSRD',
  'EU Taxonomy', 'SFDR', 'GHG', 'Scope 1', 'Scope 2', 'Scope 3', 'GRI',
  'sustainability', 'sustainable finance', 'green finance', 'green bonds',
  'renewable energy', 'clean energy', 'decarbonization', 'net zero', 'net-zero',
  'biodiversity', 'circular economy', 'Paris Agreement',
  'stress testing', 'scenario analysis', 'transition risk', 'physical risk',
  'risk management', 'risk assessment', 'disclosure', 'reporting',
  'BRSR', 'CDP', 'SBTi', 'SASB', 'SDGs', 'UN SDGs',
];

function highlightText(text: string): React.ReactNode[] {
  const pattern = new RegExp(
    `(${HIGHLIGHT_KEYWORDS.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
    'gi'
  );
  const parts = text.split(pattern);
  return parts.map((part, i) =>
    pattern.test(part)
      ? <span key={i} className="font-semibold text-gray-800 bg-emerald-50 px-0.5 rounded">{part}</span>
      : part
  );
}

function splitIntoBullets(text: string): string[] {
  if (/[*\-•]\s+\S/.test(text)) {
    const firstBullet = text.search(/[*\-•]\s+\S/);
    const preamble = text.slice(0, firstBullet).trim();
    const bulletSection = text.slice(firstBullet);
    const items = bulletSection.split(/\s*[*\-•]\s+/).filter(s => s.trim());
    if (preamble) {
      const preambleSentences = preamble.split(/(?<=\.)\s+(?=[A-Z])/).filter(s => s.trim());
      return [...preambleSentences, ...items];
    }
    return items;
  }

  if (/\d+[.)]\s+\S/.test(text)) {
    const items = text.split(/\s*\d+[.)]\s+/).filter(s => s.trim());
    if (items.length >= 3) return items;
  }

  const labelPattern = /(?<=\.)\s+(?=[A-Z][a-zA-Z&,/ ]{5,}:)/g;
  const chunks = text.split(labelPattern).filter(s => s.trim());

  const result: string[] = [];
  for (const chunk of chunks) {
    const sentences = chunk.split(/(?<=\.)\s+(?=[A-Z])/).filter(s => s.trim());
    result.push(...sentences);
  }

  if (result.length === 1) {
    const commaCount = (result[0].match(/,/g) || []).length;
    const periodCount = (result[0].match(/\./g) || []).length;
    if (commaCount >= 3 && periodCount <= 1) {
      const items = result[0].split(/,\s*/).filter(s => s.trim());
      if (items.length >= 3) return items;
    }
  }

  return result;
}

function BulletedText({ text }: { text: string }) {
  const bullets = splitIntoBullets(text);

  if (bullets.length <= 1) {
    return <p className="text-[13px] text-slate-600 leading-relaxed">{highlightText(text)}</p>;
  }

  return (
    <ul className="text-[13px] text-slate-600 leading-relaxed space-y-1.5 list-none pl-0">
      {bullets.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span className="text-green-400 mt-[3px] shrink-0">
            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor"><circle cx="3" cy="6" r="2.5" /></svg>
          </span>
          <span>{highlightText(item.trim())}</span>
        </li>
      ))}
    </ul>
  );
}

function DetailPanel({ job, detail }: { job: JobSummary; detail: JobDetail | null }) {
  if (!detail) {
    return (
      <tr>
        <td colSpan={5} className="p-0">
          <div className="bg-slate-50 border-y border-slate-100 px-6 py-8 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-green-200 border-t-green-600 rounded-full animate-spin" />
            <span className="ml-3 text-sm text-slate-400">Loading details...</span>
          </div>
        </td>
      </tr>
    );
  }

  const sections = [
    detail.roleSummary && { label: 'Role Details', text: detail.roleSummary, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    detail.skillsRequired && { label: 'Requirements', text: detail.skillsRequired, icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
    detail.domainContext && { label: 'Domain Context', text: detail.domainContext, icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ].filter(Boolean) as { label: string; text: string; icon: string }[];

  const meta = [
    job.jobType && { label: 'Type', value: capitalize(job.jobType) },
    job.jobLevel && { label: 'Level', value: capitalize(job.jobLevel) },
    job.experience && { label: 'Experience', value: job.experience },
    job.remote && { label: 'Work Mode', value: 'Remote' },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <tr>
      <td colSpan={5} className="p-0">
        <div className="bg-slate-50 border-y border-slate-100 px-6 py-5">
          {meta.length > 0 && (
            <div className="flex flex-wrap gap-6 mb-4 pb-3 border-b border-slate-200/60">
              {meta.map((m, i) => (
                <div key={i} className="text-[11px]">
                  <span className="block text-slate-400 font-bold uppercase tracking-widest">{m.label}</span>
                  <span className="text-slate-900 font-semibold text-sm">{m.value}</span>
                </div>
              ))}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {sections.map((s, i) => (
              <div key={i} className={`space-y-2 ${sections.length === 3 && i === 0 ? 'md:col-span-2' : ''}`}>
                <h4 className="font-bold text-green-800 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                  </svg>
                  {s.label}
                </h4>
                <BulletedText text={s.text} />
              </div>
            ))}
          </div>
        </div>
      </td>
    </tr>
  );
}

function StatCircle({ value, label, borderColor }: { value: string | number; label: string; borderColor: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-20 h-20 rounded-full border-4 ${borderColor} bg-white flex flex-col items-center justify-center shadow-md`}>
        <span className="text-2xl font-bold text-slate-800">{value}</span>
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
    </div>
  );
}

interface JobsClientProps {
  jobs: JobSummary[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  meta: JobsMeta;
  isAuthenticated: boolean;
  filters: Record<string, string | number | undefined>;
}

export default function JobsClient({ jobs, total, page, perPage, totalPages, meta, isAuthenticated, filters }: JobsClientProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  useAntiScrape(contentRef);

  const router = useRouter();
  const searchParams = useSearchParams();
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [detailCache, setDetailCache] = useState<Record<string, JobDetail>>({});
  const [loadingDetail, setLoadingDetail] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState((filters.search as string) ?? '');
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeProfile = (filters.profile as string) ?? 'all';
  const companyTypeFilter = (filters.companyType as string) ?? 'all';
  const countryFilter = (filters.country as string) ?? 'all';
  const remoteFilter = (filters.remote as string) ?? 'all';
  const sortBy = (filters.sort as string) ?? 'relevance';

  const profiles = ['all', ...Object.keys(meta.profileCounts).filter(k => k !== 'all')];

  const suggestedCourses = COURSE_SUGGESTIONS[activeProfile] || COURSE_SUGGESTIONS.climate_risk!;

  // Build new URL with updated params, resetting page to 1 on filter changes
  const updateFilters = useCallback((updates: Record<string, string>, resetPage = true) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (!value || value === 'all' || value === 'relevance') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    if (resetPage) params.delete('page');
    const qs = params.toString();
    router.push(`/jobs${qs ? `?${qs}` : ''}`, { scroll: false });
    setExpandedIdx(null);
  }, [router, searchParams]);

  const setPage = useCallback((p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (p <= 1) { params.delete('page'); } else { params.set('page', String(p)); }
    const qs = params.toString();
    router.push(`/jobs${qs ? `?${qs}` : ''}`, { scroll: false });
    setExpandedIdx(null);
  }, [router, searchParams]);

  const setPerPageNav = useCallback((pp: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (pp === 15) { params.delete('perPage'); } else { params.set('perPage', String(pp)); }
    params.delete('page');
    const qs = params.toString();
    router.push(`/jobs${qs ? `?${qs}` : ''}`, { scroll: false });
  }, [router, searchParams]);

  // Debounced search: wait 400ms after last keystroke
  const onSearchChange = useCallback((value: string) => {
    setSearchInput(value);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      updateFilters({ search: value });
    }, 400);
  }, [updateFilters]);

  const clearAll = useCallback(() => {
    setSearchInput('');
    router.push('/jobs', { scroll: false });
    setExpandedIdx(null);
  }, [router]);

  const handleExpand = useCallback(async (idx: number, jobUrl: string) => {
    if (expandedIdx === idx) {
      setExpandedIdx(null);
      return;
    }
    setExpandedIdx(idx);
    if (!detailCache[jobUrl]) {
      setLoadingDetail(jobUrl);
      const detail = await fetchJobDetail(jobUrl);
      if (detail) {
        setDetailCache(prev => ({ ...prev, [jobUrl]: detail }));
      }
      setLoadingDetail(null);
    }
  }, [expandedIdx, detailCache]);

  const hasActiveFilters = activeProfile !== 'all' || companyTypeFilter !== 'all' || countryFilter !== 'all' || remoteFilter !== 'all' || searchInput;

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] select-none" style={{ WebkitUserSelect: 'none', MozUserSelect: 'none' } as React.CSSProperties}>
      <PlatformNav />

      <main id="main-content" ref={contentRef} className="flex-1 max-w-[1100px] mx-auto w-full px-4 sm:px-6 py-8 space-y-8">
        {/* Hero card */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-8 p-8 sm:p-10 bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full -mr-24 -mt-24 pointer-events-none" />
          <div className="space-y-3 relative z-10">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-600 tracking-widest uppercase">Updated Regularly{isAuthenticated ? ' · Email alerts on' : ''}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
              Sustainability <span className="text-green-700">Opportunities.</span>
            </h1>
            <p className="text-slate-500 max-w-md text-base sm:text-lg">
              Your curated portal for high-impact roles in climate, carbon markets, ESG, and green finance.
            </p>
          </div>
          <div className="flex gap-6 sm:gap-8 relative z-10">
            <StatCircle value={isAuthenticated ? meta.totalJobCount : `${meta.totalJobCount}+`} label="Active Jobs" borderColor="border-emerald-100" />
            <StatCircle value={isAuthenticated ? meta.totalCompanies : `${meta.totalCompanies}+`} label="Companies" borderColor="border-blue-100" />
            <StatCircle value={isAuthenticated ? meta.totalRemote : `${meta.totalRemote}+`} label="Remote" borderColor="border-amber-100" />
          </div>
        </section>

        {/* Profile tabs (visible to everyone, interactive only for authenticated) */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex bg-slate-100 p-1 rounded-xl w-fit flex-wrap gap-0.5">
              {profiles.map(p => (
                <button
                  key={p}
                  onClick={() => isAuthenticated && updateFilters({ profile: p })}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                    isAuthenticated && activeProfile === p
                      ? 'bg-white text-green-700 shadow-sm'
                      : isAuthenticated
                        ? 'text-slate-500 hover:text-green-700 cursor-pointer'
                        : 'text-slate-500 cursor-default'
                  }`}
                >
                  {formatProfile(p)}
                  {isAuthenticated && <span className={`ml-1.5 ${activeProfile === p ? 'text-green-500' : 'text-slate-400'}`}>
                    {meta.profileCounts[p] ?? 0}
                  </span>}
                </button>
              ))}
            </div>

            {/* Search (authenticated only) */}
            {isAuthenticated && (
              <div className="relative min-w-0 sm:min-w-[300px]">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search roles, companies, keywords..."
                  value={searchInput}
                  onChange={e => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                />
              </div>
            )}
          </div>

          {/* Dropdown filters (authenticated only) */}
          {isAuthenticated && <div className="flex flex-wrap gap-2">
            <select
              value={countryFilter}
              onChange={e => updateFilters({ country: e.target.value })}
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
            >
              <option value="all">All Countries</option>
              {meta.countries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={companyTypeFilter}
              onChange={e => updateFilters({ companyType: e.target.value })}
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
            >
              <option value="all">All Company Types</option>
              {meta.companyTypes.map(ct => (
                <option key={ct} value={ct}>{ct}</option>
              ))}
            </select>
            <select
              value={remoteFilter}
              onChange={e => updateFilters({ remote: e.target.value })}
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
            >
              <option value="all">Remote + On-site</option>
              <option value="remote">Remote Only</option>
              <option value="onsite">On-site Only</option>
            </select>
            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="text-xs text-green-600 hover:text-green-700 font-semibold px-3 py-2"
              >
                Clear all
              </button>
            )}
          </div>}
        </section>

        {/* Results info */}
        {isAuthenticated && <div className="flex items-center justify-between px-1 -mt-4">
          <p className="text-xs text-slate-400">
            Showing <span className="font-semibold text-slate-600">{jobs.length}</span> of {total} positions
          </p>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 mr-1">Sort:</span>
            <button
              onClick={() => updateFilters({ sort: 'relevance' })}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${sortBy === 'relevance' ? 'bg-green-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              Relevance
            </button>
            <button
              onClick={() => updateFilters({ sort: 'latest' })}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${sortBy === 'latest' ? 'bg-green-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              Latest
            </button>
          </div>
        </div>}

        {jobs.length === 0 && isAuthenticated && (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <svg className="w-12 h-12 text-slate-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-slate-400 mb-2">No jobs match your filters</p>
            <button
              onClick={clearAll}
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Table */}
        {jobs.length > 0 && (
          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-bold tracking-widest">
                    <th className="px-6 py-4">Position & Company</th>
                    <th className="px-4 py-4 hidden md:table-cell">Location</th>
                    <th className="px-4 py-4 hidden lg:table-cell">Category</th>
                    <th className="px-4 py-4 hidden sm:table-cell">Posted</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobs.map((job, i) => {
                    const isExpanded = expandedIdx === i;
                    const hasDetails = isAuthenticated;
                    return (
                      <Fragment key={i}>
                        <tr
                          className={`group transition-colors ${hasDetails ? 'cursor-pointer' : ''} ${isExpanded ? 'bg-green-50/40' : i % 2 === 1 ? 'bg-slate-50/30' : ''} ${!isExpanded ? 'hover:bg-slate-50/50' : ''}`}
                          onClick={() => hasDetails && handleExpand(i, job.jobUrl)}
                        >
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-2.5">
                              {hasDetails && (
                                <svg
                                  className={`w-3 h-3 text-slate-300 group-hover:text-slate-500 shrink-0 transition-all duration-200 ${isExpanded ? 'rotate-90 text-green-600' : ''}`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2.5}
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                              )}
                              {!hasDetails && <span className="w-3" />}
                              <div className="min-w-0">
                                <p className={`font-bold leading-snug text-[13px] ${isExpanded ? 'text-green-800' : 'text-slate-900 group-hover:text-green-800'} transition-colors`}>
                                  {job.title}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  {job.company}
                                  {job.remote && (
                                    <span className="ml-2 text-[10px] font-semibold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded-full">Remote</span>
                                  )}
                                </p>
                                <p className="text-[11px] text-slate-400 md:hidden mt-0.5">
                                  {job.location}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 hidden md:table-cell">
                            {job.location && (
                              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                                <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="truncate max-w-[180px]">{job.location}</span>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3.5 hidden lg:table-cell">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight border ${PROFILE_PILL[job.profile] ?? 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                              {formatProfile(job.profile)}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 hidden sm:table-cell">
                            <span className="text-xs text-slate-500">{formatDate(job.datePosted)}</span>
                          </td>
                          <td className="px-6 py-3.5 text-right">
                            <a
                              href={job.jobUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-xs font-bold text-white bg-green-700 px-4 py-1.5 rounded-lg hover:bg-green-800 transition-all"
                            >
                              Apply
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </td>
                        </tr>
                        {isExpanded && hasDetails && <DetailPanel job={job} detail={detailCache[job.jobUrl] ?? null} />}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {isAuthenticated && totalPages > 0 && <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">
                  Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, total)} of {total}
                </span>
                <div className="flex items-center gap-1.5">
                  <label className="text-xs text-slate-400">Rows:</label>
                  <select
                    value={perPage}
                    onChange={e => setPerPageNav(Number(e.target.value))}
                    className="text-xs border border-slate-200 rounded px-1.5 py-1 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-green-500"
                  >
                    {[10, 15, 25, 50].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-green-700 hover:border-green-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
                      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('ellipsis');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === 'ellipsis' ? (
                        <span key={`e${i}`} className="px-1 text-xs text-slate-400">...</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setPage(p as number)}
                          className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                            page === p
                              ? 'bg-green-700 text-white'
                              : 'bg-white border border-slate-200 text-slate-600 hover:text-green-700 hover:border-green-200'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-green-700 hover:border-green-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              )}
            </div>}
          </section>
        )}

        {/* Auth wall for unauthenticated users */}
        {!isAuthenticated && (
          <section className="relative bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center text-center px-6 py-16 space-y-5">
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                <svg className="w-7 h-7 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">
                  Sign up to see all {meta.totalJobCount}+ jobs
                </h3>
                <p className="text-slate-500 text-sm max-w-md">
                  Create a free account to unlock the full directory with filters, search, and detailed role breakdowns. Get notified over email whenever new jobs are added.
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/sign-up"
                  className="px-6 py-2.5 bg-green-700 text-white text-sm font-bold rounded-lg hover:bg-green-800 transition-colors"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/sign-in"
                  className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Start Learning Banner */}
        <section className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-3 p-6 sm:p-8 bg-slate-800 rounded-2xl text-white space-y-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="font-bold text-lg">Start Learning</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Build the skills employers are looking for. Our courses cover the frameworks, standards, and domain knowledge mentioned in these job listings.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {suggestedCourses.map((course, i) => (
                <Link
                  key={i}
                  href={course.href}
                  className="px-4 py-2 bg-emerald-500 text-slate-900 text-xs font-bold rounded-lg hover:bg-emerald-400 transition-colors"
                >
                  {course.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 p-6 sm:p-8 bg-green-700/10 rounded-2xl border border-green-700/20 space-y-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <h3 className="font-bold text-green-800">In-Demand Skills</h3>
            </div>
            <div className="space-y-2">
              {['Climate Risk Assessment', 'ESG Reporting (GRI, SASB)', 'Carbon Accounting', 'EU Taxonomy Alignment'].map((skill, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                  <span className="text-sm text-slate-700">{skill}</span>
                </div>
              ))}
            </div>
            <Link
              href="/"
              className="inline-block mt-2 text-xs font-bold text-green-700 hover:text-green-800 transition-colors"
            >
              Browse all courses &rarr;
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
