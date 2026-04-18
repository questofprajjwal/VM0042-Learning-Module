'use client';

import { Fragment, useEffect, useState } from 'react';
import { ExternalLink, GraduationCap, ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';
import { ProjectRecord, REGISTRY_LABEL, COURSE_METHODOLOGIES } from './types';
import type { Sort, SortKey } from './CarbonMarketClient';

const REGISTRY_CHIP: Record<ProjectRecord['registry'], string> = {
  verra_vcs: 'bg-gt-leaf/15 text-gt-medium',
  verra_ccb: 'bg-gt-forest/15 text-gt-medium',
  verra_pwrp: 'bg-cyan-100 text-cyan-900',
  goldstandard: 'bg-amber-100 text-amber-900',
};

const REGISTRY_SHORT: Record<ProjectRecord['registry'], string> = {
  verra_vcs: 'VCS',
  verra_ccb: 'CCB',
  verra_pwrp: 'PWRP',
  goldstandard: 'GS',
};

const STATUS_DOT: Record<ProjectRecord['statusBucket'], string> = {
  Registered: 'bg-gt-leaf',
  Validation: 'bg-sky-500',
  Development: 'bg-violet-500',
  Inactive: 'bg-red-500',
  Other: 'bg-gt-text-dim',
};

const STATUS_TEXT: Record<ProjectRecord['statusBucket'], string> = {
  Registered: 'text-gt-text-muted',
  Validation: 'text-gt-text-muted',
  Development: 'text-gt-text-muted',
  Inactive: 'text-red-600',
  Other: 'text-gt-text-muted',
};

function formatReductions(n: number | null, unit: ProjectRecord['estUnit']): string {
  if (n == null) return '—';
  const suffix = unit === 'tonnes_plastic' ? 't plastic' : 'tCO2e';
  return `${n.toLocaleString('en-US')} ${suffix}`;
}

function th(extra = ''): string {
  return `text-left px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-gt-text-dim whitespace-nowrap ${extra}`;
}

type DescriptionMap = Record<string, string>;

let descCache: Promise<DescriptionMap> | null = null;
function loadDescriptions(): Promise<DescriptionMap> {
  if (!descCache) {
    descCache = fetch('/carbon-market-descriptions.json')
      .then(r => (r.ok ? r.json() : {}))
      .catch(() => ({}));
  }
  return descCache;
}

interface Props {
  projects: ProjectRecord[];
  sort: Sort;
  onSort: (key: SortKey) => void;
}

function SortButton({
  label,
  sortKey,
  align,
  sort,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  align?: 'left' | 'right';
  sort: Sort;
  onSort: (key: SortKey) => void;
}) {
  const active = sort.key === sortKey;
  const Icon = active ? (sort.dir === 'asc' ? ArrowUp : ArrowDown) : null;
  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.16em] hover:text-gt-medium transition-colors ${active ? 'text-gt-medium' : 'text-gt-text-dim'} ${align === 'right' ? 'flex-row-reverse' : ''}`}
    >
      {label}
      {Icon ? <Icon className="w-3 h-3" strokeWidth={2.2} /> : null}
    </button>
  );
}

export default function ProjectTable({ projects, sort, onSort }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [descriptions, setDescriptions] = useState<DescriptionMap | null>(null);

  useEffect(() => {
    if (expanded.size > 0 && !descriptions) {
      loadDescriptions().then(setDescriptions);
    }
  }, [expanded, descriptions]);

  function toggle(id: string) {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <>
      {/* Mobile card list */}
      <div className="md:hidden flex flex-col gap-3">
        {projects.map(p => {
          const courseSlug = p.methodology ? COURSE_METHODOLOGIES[p.methodology] : null;
          const hasDescription = p.registry === 'verra_vcs';
          const isOpen = expanded.has(p.id);
          const desc = hasDescription && descriptions ? descriptions[p.id] : null;
          return (
            <article
              key={p.id}
              className="bg-white border border-gt-border-light rounded-2xl shadow-gt-card p-4"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${REGISTRY_CHIP[p.registry]}`}
                >
                  {REGISTRY_SHORT[p.registry]}
                </span>
                <span className={`inline-flex items-center gap-1.5 text-[11px] ${STATUS_TEXT[p.statusBucket]}`}>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[p.statusBucket]}`}
                    aria-hidden
                  />
                  {p.statusBucket}
                </span>
                {p.registrationDate ? (
                  <span className="ml-auto text-[11px] font-['JetBrains_Mono'] text-gt-text-dim">
                    {p.registrationDate.slice(0, 7)}
                  </span>
                ) : null}
              </div>

              <a
                href={p.registryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-2 inline-flex items-start gap-1 font-semibold text-[15px] text-gt-text leading-snug hover:text-gt-medium"
              >
                <span>{p.name}</span>
                <ExternalLink
                  className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gt-text-dim group-hover:text-gt-medium"
                  strokeWidth={2}
                />
              </a>
              {p.developer ? (
                <p className="mt-0.5 text-[12px] text-gt-text-dim line-clamp-1">{p.developer}</p>
              ) : null}

              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[12px]">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-gt-text-dim">
                    Methodology
                  </div>
                  <div className="mt-0.5 font-['JetBrains_Mono'] text-gt-text flex items-center gap-1.5 flex-wrap">
                    {p.methodology ?? '—'}
                    {courseSlug ? (
                      <a
                        href={`/courses/${courseSlug}`}
                        className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider text-gt-medium"
                      >
                        <GraduationCap className="w-3 h-3" strokeWidth={2.2} />
                        Course
                      </a>
                    ) : null}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-gt-text-dim">
                    Country
                  </div>
                  <div className="mt-0.5 text-gt-text truncate">{p.country ?? '—'}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-gt-text-dim">
                    Est. annual
                  </div>
                  <div className="mt-0.5 font-['JetBrains_Mono'] text-gt-text">
                    {formatReductions(p.estAnnualReductions, p.estUnit)}
                  </div>
                </div>
              </div>

              {p.additionalCertifications.length ? (
                <div className="flex flex-wrap gap-1 mt-3">
                  {p.additionalCertifications.slice(0, 3).map(c => (
                    <span
                      key={c}
                      className="px-1.5 py-0.5 rounded bg-gt-medium/10 text-gt-medium text-[10px] font-semibold"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              ) : null}

              {hasDescription ? (
                <button
                  type="button"
                  onClick={() => toggle(p.id)}
                  className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.16em] text-gt-medium"
                >
                  {isOpen ? 'Hide summary' : 'Project summary'}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    strokeWidth={2.2}
                  />
                </button>
              ) : null}

              {isOpen ? (
                <div className="mt-3 pt-3 border-t border-gt-border-light">
                  {descriptions === null ? (
                    <p className="text-xs text-gt-text-dim">Loading description…</p>
                  ) : desc ? (
                    <p className="text-[13px] leading-relaxed text-gt-text-muted whitespace-pre-line">
                      {desc.length > 500 ? `${desc.slice(0, 500).trimEnd()}…` : desc}
                    </p>
                  ) : (
                    <p className="text-xs text-gt-text-dim">No description available.</p>
                  )}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white border border-gt-border-light rounded-2xl shadow-gt-card overflow-hidden">
      <table className="w-full text-sm table-fixed">
        <colgroup>
          <col className="w-[38%]" />
          <col className="w-[9%]" />
          <col className="w-[12%]" />
          <col className="w-[13%]" />
          <col className="w-[11%]" />
          <col className="w-[11%]" />
          <col className="w-[6%]" />
        </colgroup>
        <thead>
          <tr className="border-b border-gt-border-light bg-gt-pale">
            <th className={th()}>
              <SortButton label="Project" sortKey="name" sort={sort} onSort={onSort} />
            </th>
            <th className={th()}>Registry</th>
            <th className={th()}>Methodology</th>
            <th className={th()}>Country</th>
            <th className={th()}>Status</th>
            <th className={th('!text-right')}>
              <SortButton
                label="Est. annual"
                sortKey="reductions"
                align="right"
                sort={sort}
                onSort={onSort}
              />
            </th>
            <th className={th('!text-right')}>
              <SortButton
                label="Reg."
                sortKey="date"
                align="right"
                sort={sort}
                onSort={onSort}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.map(p => {
            const courseSlug = p.methodology ? COURSE_METHODOLOGIES[p.methodology] : null;
            const hasDescription = p.registry === 'verra_vcs';
            const isOpen = expanded.has(p.id);
            const desc = hasDescription && descriptions ? descriptions[p.id] : null;

            return (
              <Fragment key={p.id}>
                <tr
                  onClick={() => hasDescription && toggle(p.id)}
                  className={`border-b border-gt-border-light/60 transition-colors ${hasDescription ? 'cursor-pointer hover:bg-gt-pale/70' : ''} ${isOpen ? 'bg-gt-pale/60' : ''}`}
                >
                  <td className="px-3 py-3 align-top">
                    <div className="flex items-start gap-2">
                      {hasDescription ? (
                        <ChevronDown
                          className={`w-3.5 h-3.5 mt-1 shrink-0 text-gt-text-dim transition-transform ${isOpen ? 'rotate-180' : ''}`}
                          strokeWidth={2.2}
                        />
                      ) : (
                        <span className="w-3.5 shrink-0" aria-hidden />
                      )}
                      <div className="min-w-0 flex-1">
                        <a
                          href={p.registryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="group inline-flex items-start gap-1 font-semibold text-gt-text leading-snug hover:text-gt-medium"
                        >
                          <span className="line-clamp-2">{p.name}</span>
                          <ExternalLink
                            className="w-3 h-3 mt-0.5 shrink-0 text-gt-text-dim group-hover:text-gt-medium"
                            strokeWidth={2}
                          />
                        </a>
                        {p.developer ? (
                          <div className="text-[11px] text-gt-text-dim line-clamp-1 mt-0.5">
                            {p.developer}
                          </div>
                        ) : null}
                        {p.additionalCertifications.length ? (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {p.additionalCertifications.slice(0, 3).map(c => (
                              <span
                                key={c}
                                className="px-1.5 py-0.5 rounded bg-gt-medium/10 text-gt-medium text-[10px] font-semibold"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 align-top">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${REGISTRY_CHIP[p.registry]}`}
                      title={REGISTRY_LABEL[p.registry]}
                    >
                      {REGISTRY_SHORT[p.registry]}
                    </span>
                  </td>
                  <td className="px-3 py-3 align-top font-['JetBrains_Mono'] text-[12px] text-gt-text">
                    {p.methodology ? (
                      <div className="flex flex-col gap-1 items-start">
                        <span className="truncate max-w-full">{p.methodology}</span>
                        {courseSlug ? (
                          <a
                            href={`/courses/${courseSlug}`}
                            onClick={e => e.stopPropagation()}
                            className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider text-gt-medium hover:text-gt-dark"
                          >
                            <GraduationCap className="w-3 h-3" strokeWidth={2.2} />
                            Course
                          </a>
                        ) : null}
                      </div>
                    ) : (
                      <span className="text-gt-text-dim">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3 align-top text-[13px] text-gt-text">
                    <div className="truncate">{p.country ?? '—'}</div>
                    {p.region ? (
                      <div className="text-[11px] text-gt-text-dim truncate">{p.region}</div>
                    ) : null}
                  </td>
                  <td className="px-3 py-3 align-top">
                    <span className={`inline-flex items-center gap-1.5 text-[12px] ${STATUS_TEXT[p.statusBucket]}`}>
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT[p.statusBucket]}`}
                        aria-hidden
                      />
                      {p.statusBucket}
                    </span>
                  </td>
                  <td className="px-3 py-3 align-top text-right font-['JetBrains_Mono'] text-[11px] text-gt-text whitespace-nowrap">
                    {formatReductions(p.estAnnualReductions, p.estUnit)}
                  </td>
                  <td className="px-3 py-3 align-top text-right font-['JetBrains_Mono'] text-[11px] text-gt-text-dim whitespace-nowrap">
                    {p.registrationDate ? p.registrationDate.slice(0, 7) : '—'}
                  </td>
                </tr>
                {isOpen ? (
                  <tr className="border-b border-gt-border-light/60 bg-gt-pale/40">
                    <td colSpan={7} className="px-8 py-5">
                      {descriptions === null ? (
                        <p className="text-xs text-gt-text-dim">Loading description…</p>
                      ) : desc ? (
                        <div className="max-w-3xl">
                          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gt-text-dim">
                            Project summary
                          </span>
                          <p className="mt-2 text-[13px] leading-relaxed text-gt-text-muted whitespace-pre-line">
                            {desc.length > 500 ? `${desc.slice(0, 500).trimEnd()}…` : desc}
                          </p>
                          <a
                            href={p.registryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-gt-medium hover:text-gt-dark"
                          >
                            View full project on Verra
                            <ExternalLink className="w-3 h-3" strokeWidth={2} />
                          </a>
                        </div>
                      ) : (
                        <p className="text-xs text-gt-text-dim">
                          No description available for this project.
                        </p>
                      )}
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            );
          })}
        </tbody>
      </table>
      </div>
    </>
  );
}
