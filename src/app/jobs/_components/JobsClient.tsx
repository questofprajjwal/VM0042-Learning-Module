'use client';

import { useState, useEffect, useMemo, Fragment } from 'react';
import PlatformNav from '@/components/platform/PlatformNav';
import Footer from '@/components/platform/Footer';
import type { JobRow } from '@/app/api/jobs/route';

const PROFILE_LABELS: Record<string, string> = {
  all: 'All Jobs',
  climate_risk: 'Climate Risk',
  sustainable_finance: 'Sustainable Finance',
  eu_taxonomy_sfdr: 'EU Taxonomy / SFDR',
  carbon_markets: 'Carbon Markets',
};

const PROFILE_PILL: Record<string, string> = {
  climate_risk: 'bg-rose-100 text-rose-700',
  sustainable_finance: 'bg-emerald-100 text-emerald-700',
  eu_taxonomy_sfdr: 'bg-violet-100 text-violet-700',
  carbon_markets: 'bg-amber-100 text-amber-700',
};

const CITY_TO_COUNTRY: Record<string, string> = {
  mumbai: 'India', delhi: 'India', bengaluru: 'India', gurugram: 'India',
  pune: 'India', chennai: 'India', hyderabad: 'India', surat: 'India',
  'ncr': 'India', karur: 'India', thiruvananthapuram: 'India', noida: 'India',
  haryana: 'India', karnataka: 'India', maharashtra: 'India', telangana: 'India',
  'tamil nadu': 'India', 'new delhi': 'India',
  helsinki: 'Finland', espoo: 'Finland', oulu: 'Finland', lappeenranta: 'Finland',
  stockholm: 'Sweden', lund: 'Sweden', huddinge: 'Sweden', kista: 'Sweden',
  sandviken: 'Sweden', göteborg: 'Sweden',
  brussels: 'Belgium', antwerp: 'Belgium', leuven: 'Belgium', diegem: 'Belgium',
  zaventem: 'Belgium', mol: 'Belgium',
  auckland: 'New Zealand',
  praha: 'Czech Republic', brno: 'Czech Republic', ostrava: 'Czech Republic',
  sydney: 'Australia', melbourne: 'Australia', brisbane: 'Australia',
  darwin: 'Australia', geelong: 'Australia', inkerman: 'Australia',
  london: 'UK',
};

const COUNTRY_ALIASES: Record<string, string> = {
  'united kingdom': 'UK',
  'new zealand': 'New Zealand',
  'india': 'India',
  'australia': 'Australia',
  'belgium': 'Belgium',
  'sweden': 'Sweden',
  'finland': 'Finland',
  'germany': 'Germany',
  'netherlands': 'Netherlands',
  'switzerland': 'Switzerland',
  'luxembourg': 'Luxembourg',
  'portugal': 'Portugal',
  'uk': 'UK',
  'czech republic': 'Czech Republic',
};

function extractCountry(location: string | null): string | null {
  if (!location) return null;
  const loc = location.toLowerCase();
  if (loc === 'remote' || loc.startsWith('remote in')) return 'Remote';

  // Check if it ends with a known country
  const parts = location.split(',').map(p => p.trim());
  const last = parts[parts.length - 1].toLowerCase().replace(/\d+/g, '').trim();
  if (COUNTRY_ALIASES[last]) return COUNTRY_ALIASES[last];

  // Check Australian state codes
  if (/\b(nsw|vic|qld|sa|wa|nt|act|tas)\b/i.test(location)) return 'Australia';

  // Check if any part matches a city
  for (const part of parts) {
    const clean = part.toLowerCase().replace(/\d+/g, '').trim().replace(/\(.*\)/, '').trim();
    if (CITY_TO_COUNTRY[clean]) return CITY_TO_COUNTRY[clean];
    // Partial match for cities with extra info
    for (const city of Object.keys(CITY_TO_COUNTRY)) {
      if (clean.includes(city)) return CITY_TO_COUNTRY[city];
    }
  }

  // Check for "Hybrid" or "Distansjobb" with known cities
  if (loc.includes('distansjobb') || loc.includes('sverige')) return 'Sweden';
  if (loc.includes('bruxelles') || loc.includes('etterbeek')) return 'Belgium';

  return null;
}

function formatProfile(p: string) {
  return PROFILE_LABELS[p] ?? p.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function formatDate(d: string | null) {
  if (!d) return '';
  if (d.includes('week') || d.includes('day') || d.includes('hour')) return d;
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function capitalize(s: string) {
  return s.replace(/\b\w/g, c => c.toUpperCase());
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
      <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xl font-bold text-white leading-none">{value}</p>
        <p className="text-xs text-emerald-200 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function DetailPanel({ job }: { job: JobRow }) {
  const sections = [
    job.roleSummary && { label: 'Role Summary', text: job.roleSummary, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    job.skillsRequired && { label: 'Skills Required', text: job.skillsRequired, icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
    job.domainContext && { label: 'Domain Context', text: job.domainContext, icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ].filter(Boolean) as { label: string; text: string; icon: string }[];

  const meta = [
    job.jobType && { label: 'Type', value: capitalize(job.jobType) },
    job.jobLevel && { label: 'Level', value: capitalize(job.jobLevel) },
    job.experience && { label: 'Experience', value: job.experience },
    job.remote && { label: 'Work Mode', value: 'Remote' },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <tr>
      <td colSpan={6} className="p-0">
        <div className="bg-gradient-to-b from-green-50/80 to-white border-b border-green-100 px-5 py-4">
          {meta.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-4 pb-3 border-b border-green-100/60">
              {meta.map((m, i) => (
                <div key={i}>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{m.label}</p>
                  <p className="text-sm font-medium text-gray-800 mt-0.5">{m.value}</p>
                </div>
              ))}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sections.map((s, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-100 p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                  </svg>
                  <p className="text-[11px] font-semibold text-green-700 uppercase tracking-wide">{s.label}</p>
                </div>
                <p className="text-[13px] text-gray-600 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </td>
    </tr>
  );
}

export default function JobsClient() {
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const [activeProfile, setActiveProfile] = useState('all');
  const [companyTypeFilter, setCompanyTypeFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [remoteFilter, setRemoteFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load jobs');
        return res.json();
      })
      .then((data: JobRow[]) => {
        setJobs(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const companyTypes = useMemo(() => {
    const types = new Set(jobs.map(j => j.companyType).filter(Boolean));
    return Array.from(types).sort();
  }, [jobs]);

  const countries = useMemo(() => {
    const c = new Set<string>();
    jobs.forEach(j => {
      const country = extractCountry(j.location);
      if (country) c.add(country);
    });
    return Array.from(c).sort();
  }, [jobs]);

  const profiles = useMemo(() => {
    const p = new Set(jobs.map(j => j.profile));
    return ['all', ...Array.from(p)];
  }, [jobs]);

  const profileCounts = useMemo(() => {
    const counts: Record<string, number> = { all: jobs.length };
    jobs.forEach(j => { counts[j.profile] = (counts[j.profile] ?? 0) + 1; });
    return counts;
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    let result = jobs;
    if (activeProfile !== 'all') result = result.filter(j => j.profile === activeProfile);
    if (companyTypeFilter !== 'all') result = result.filter(j => j.companyType === companyTypeFilter);
    if (countryFilter !== 'all') result = result.filter(j => extractCountry(j.location) === countryFilter);
    if (remoteFilter === 'remote') result = result.filter(j => j.remote);
    else if (remoteFilter === 'onsite') result = result.filter(j => !j.remote);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        j =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          (j.location?.toLowerCase().includes(q))
      );
    }
    return result;
  }, [jobs, activeProfile, companyTypeFilter, countryFilter, remoteFilter, searchQuery]);

  useEffect(() => { setExpandedIdx(null); }, [activeProfile, companyTypeFilter, countryFilter, remoteFilter, searchQuery]);

  const uniqueCompanies = useMemo(() => new Set(jobs.map(j => j.company)).size, [jobs]);
  const remoteCount = useMemo(() => jobs.filter(j => j.remote).length, [jobs]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PlatformNav />

      <main id="main-content" className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-green-800 via-emerald-700 to-teal-700 px-4 sm:px-6 py-10 sm:py-14">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-teal-400/10 rounded-full translate-y-1/3 -translate-x-1/4" />
            <div className="absolute top-1/2 left-1/2 w-[200px] h-[200px] bg-green-400/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="relative max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-emerald-300 tracking-widest uppercase">Updated Regularly</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight">
              Sustainability Jobs Directory
            </h1>
            <p className="text-emerald-100/80 text-sm sm:text-base max-w-xl mb-6">
              Curated roles across climate, carbon markets, ESG, and green finance from leading organizations.
            </p>
            {!loading && (
              <div className="flex flex-wrap gap-3">
                <StatCard
                  label="Open Positions"
                  value={jobs.length}
                  icon={<svg className="w-4.5 h-4.5 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                />
                <StatCard
                  label="Companies"
                  value={uniqueCompanies}
                  icon={<svg className="w-4.5 h-4.5 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                />
                <StatCard
                  label="Remote Roles"
                  value={remoteCount}
                  icon={<svg className="w-4.5 h-4.5 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
              </div>
            )}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {/* Filter bar */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by title, company, or location..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-colors"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  value={countryFilter}
                  onChange={e => setCountryFilter(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors"
                >
                  <option value="all">All Countries</option>
                  {countries.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <select
                  value={companyTypeFilter}
                  onChange={e => setCompanyTypeFilter(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors"
                >
                  <option value="all">All Company Types</option>
                  {companyTypes.map(ct => (
                    <option key={ct} value={ct}>{ct}</option>
                  ))}
                </select>
                <select
                  value={remoteFilter}
                  onChange={e => setRemoteFilter(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors"
                >
                  <option value="all">Remote + On-site</option>
                  <option value="remote">Remote Only</option>
                  <option value="onsite">On-site Only</option>
                </select>
              </div>
            </div>

            {/* Profile tabs */}
            <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-gray-100">
              {profiles.map(p => (
                <button
                  key={p}
                  onClick={() => setActiveProfile(p)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
                    activeProfile === p
                      ? 'bg-green-600 text-white shadow-sm shadow-green-600/25'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                  }`}
                >
                  {formatProfile(p)}
                  <span className={`ml-1.5 ${activeProfile === p ? 'text-green-200' : 'text-gray-400'}`}>
                    {profileCounts[p] ?? 0}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Results info */}
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="text-xs text-gray-400">
              Showing <span className="font-medium text-gray-600">{filteredJobs.length}</span> of {jobs.length} positions
            </p>
            {(activeProfile !== 'all' || companyTypeFilter !== 'all' || countryFilter !== 'all' || remoteFilter !== 'all' || searchQuery) && (
              <button
                onClick={() => { setActiveProfile('all'); setCompanyTypeFilter('all'); setCountryFilter('all'); setRemoteFilter('all'); setSearchQuery(''); }}
                className="text-xs text-green-600 hover:text-green-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-8 h-8 border-2 border-green-200 border-t-green-600 rounded-full animate-spin" />
              <p className="text-sm text-gray-400">Loading jobs...</p>
            </div>
          )}

          {error && (
            <p className="text-center py-16 text-red-600 font-medium">{error}</p>
          )}

          {!loading && !error && filteredJobs.length === 0 && (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
              <svg className="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-gray-400 mb-2">No jobs match your filters</p>
              <button
                onClick={() => { setActiveProfile('all'); setCompanyTypeFilter('all'); setCountryFilter('all'); setRemoteFilter('all'); setSearchQuery(''); }}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Table */}
          {!loading && !error && filteredJobs.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm table-fixed">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left font-semibold text-gray-500 text-[11px] uppercase tracking-wider bg-gray-50/80 w-[36%]">Position</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-500 text-[11px] uppercase tracking-wider bg-gray-50/80 hidden sm:table-cell w-[15%]">Company</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-500 text-[11px] uppercase tracking-wider bg-gray-50/80 hidden md:table-cell w-[18%]">Location</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-500 text-[11px] uppercase tracking-wider bg-gray-50/80 hidden lg:table-cell w-[12%]">Category</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-500 text-[11px] uppercase tracking-wider bg-gray-50/80 hidden sm:table-cell w-[9%]">Posted</th>
                      <th className="px-3 py-3 bg-gray-50/80 w-[10%]"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredJobs.map((job, i) => {
                      const isExpanded = expandedIdx === i;
                      const hasDetails = job.roleSummary || job.skillsRequired || job.domainContext || job.jobType || job.jobLevel || job.experience;
                      return (
                        <Fragment key={i}>
                          <tr
                            className={`group transition-colors ${hasDetails ? 'cursor-pointer' : ''} ${isExpanded ? 'bg-green-50/50' : 'hover:bg-gray-50/70'} ${i % 2 === 0 && !isExpanded ? '' : !isExpanded ? 'bg-gray-50/30' : ''}`}
                            onClick={() => hasDetails && setExpandedIdx(isExpanded ? null : i)}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {hasDetails && (
                                  <svg
                                    className={`w-3 h-3 text-gray-300 group-hover:text-gray-500 shrink-0 transition-all duration-200 ${isExpanded ? 'rotate-90 text-green-600' : ''}`}
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
                                  <p className={`font-medium leading-snug text-[13px] truncate ${isExpanded ? 'text-green-800' : 'text-gray-900'}`}>{job.title}</p>
                                  <p className="text-[11px] text-gray-400 sm:hidden mt-0.5 truncate">
                                    {job.company}{job.location ? ` · ${job.location}` : ''}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell">
                              <div className="flex items-center gap-2">
                                <span className="text-[13px] text-gray-700">{job.company}</span>
                                {job.remote && (
                                  <span className="text-[10px] font-semibold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded-full leading-none">Remote</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell">
                              {job.location && (
                                <span className="text-[13px] text-gray-500 flex items-center gap-1">
                                  <svg className="w-3 h-3 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  <span className="truncate max-w-[180px]">{job.location}</span>
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 hidden lg:table-cell">
                              <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full leading-snug ${PROFILE_PILL[job.profile] ?? 'bg-gray-100 text-gray-600'}`}>
                                {formatProfile(job.profile)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right hidden sm:table-cell">
                              <span className="text-[12px] text-gray-400 whitespace-nowrap">{formatDate(job.datePosted)}</span>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <a
                                href={job.jobUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-green-600 px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors shadow-sm shadow-green-600/20"
                              >
                                Apply
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            </td>
                          </tr>
                          {isExpanded && hasDetails && <DetailPanel job={job} />}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
