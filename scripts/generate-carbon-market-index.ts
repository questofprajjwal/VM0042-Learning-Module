/**
 * generate-carbon-market-index.ts
 *
 * Build-time script that merges four project CSVs (Verra VCS, CCB, PWRP, Gold
 * Standard) into a single normalized catalogue at public/carbon-market-index.json.
 * Consumed by the static /carbon/market page which filters in memory.
 *
 * Run: npx tsx scripts/generate-carbon-market-index.ts
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = join(__dirname, '..');
const PUBLIC_DIR = join(ROOT, 'public');
const DATA_ROOT = resolve(
  ROOT,
  '..',
  'LearningPlatform',
  'CarbonMarket Aggregator',
  'data',
);

// Handle the case where the aggregator folder sits as a sibling of the repo
// root (the canonical layout on disk).
const DATA_DIR = existsSync(DATA_ROOT)
  ? DATA_ROOT
  : resolve(ROOT, '..', 'CarbonMarket Aggregator', 'data');

if (!existsSync(DATA_DIR)) {
  // Aggregator CSVs live outside the repo and are only present on the
  // machine that authors the index. In any other build environment
  // (Vercel, clean clones) we ship the pre-generated JSON files already
  // committed to public/ and skip regeneration.
  console.warn(
    `[carbon-market] Aggregator data not found at ${DATA_DIR}. Skipping regeneration; using committed public/carbon-market-index.json.`,
  );
  process.exit(0);
}

type Registry = 'verra_vcs' | 'verra_ccb' | 'verra_pwrp' | 'goldstandard';
type StatusBucket = 'Registered' | 'Validation' | 'Development' | 'Inactive' | 'Other';

interface ProjectRecord {
  id: string;
  registry: Registry;
  name: string;
  developer: string | null;
  methodology: string | null;
  projectType: string | null;
  country: string | null;
  region: string | null;
  status: string;
  statusBucket: StatusBucket;
  estAnnualReductions: number | null;
  estUnit: 'tCO2e' | 'tonnes_plastic';
  registrationDate: string | null;
  creditingPeriodStart: string | null;
  creditingPeriodEnd: string | null;
  additionalCertifications: string[];
  registryUrl: string;
}

// Tiny CSV parser that handles quoted fields with embedded commas and doubled
// quotes. Avoids pulling in a dependency for a one-off build script.
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let field = '';
  let row: string[] = [];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (c === '\r') {
      // swallow
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function readCsvDict(path: string): Record<string, string>[] {
  const raw = readFileSync(path, 'utf-8');
  const rows = parseCsv(raw).filter(r => r.some(cell => cell.length > 0));
  if (rows.length === 0) return [];
  const header = rows[0];
  return rows.slice(1).map(r => {
    const o: Record<string, string> = {};
    header.forEach((h, i) => {
      o[h] = (r[i] ?? '').trim();
    });
    return o;
  });
}

function parseNumber(raw: string | undefined | null): number | null {
  if (!raw) return null;
  const cleaned = raw.replace(/,/g, '').trim();
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function parseDate(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const s = raw.trim();
  if (!s) return null;
  // Verra CSVs emit YYYY-MM-DD; Gold Standard uses ISO timestamps.
  const m = s.match(/^(\d{4}-\d{2}-\d{2})/);
  if (m) return m[1];
  const d = new Date(s);
  if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return null;
}

function normalizeVerraStatus(s: string): StatusBucket {
  const v = s.toLowerCase();
  if (v === 'registered' || v === 'registration and verification approval requested') {
    return 'Registered';
  }
  if (v === 'under development') return 'Development';
  if (
    v.startsWith('under validation') ||
    v === 'registration requested' ||
    v === 'verification approval requested' ||
    v.startsWith('crediting period renewal') ||
    v === 'requantification requested'
  ) {
    return 'Validation';
  }
  if (
    v === 'inactive' ||
    v === 'withdrawn' ||
    v === 'rejected by administrator' ||
    v.includes('denied') ||
    v.startsWith('on hold') ||
    v === 'late to verify'
  ) {
    return 'Inactive';
  }
  return 'Other';
}

function normalizeGsStatus(s: string): StatusBucket {
  if (s === 'GOLD_STANDARD_CERTIFIED_PROJECT' || s === 'GOLD_STANDARD_CERTIFIED_DESIGN') {
    return 'Registered';
  }
  if (s === 'LISTED') return 'Validation';
  return 'Other';
}

// Fallback region inference for Gold Standard projects (the CSV has no region).
const COUNTRY_TO_REGION: Record<string, string> = {
  // Africa
  Kenya: 'Africa', Uganda: 'Africa', Ethiopia: 'Africa', Tanzania: 'Africa',
  Rwanda: 'Africa', Ghana: 'Africa', Nigeria: 'Africa', Malawi: 'Africa',
  Zambia: 'Africa', Zimbabwe: 'Africa', Mozambique: 'Africa', 'South Africa': 'Africa',
  Senegal: 'Africa', Madagascar: 'Africa', "Cote d'Ivoire": 'Africa', Cameroon: 'Africa',
  Morocco: 'Africa', Egypt: 'Africa', Tunisia: 'Africa', Algeria: 'Africa',
  'Burkina Faso': 'Africa', Mali: 'Africa', Benin: 'Africa', Togo: 'Africa',
  Namibia: 'Africa', Botswana: 'Africa', Lesotho: 'Africa', Sudan: 'Africa',
  'South Sudan': 'Africa', Liberia: 'Africa', 'Sierra Leone': 'Africa',
  'Democratic Republic of the Congo': 'Africa', Congo: 'Africa', Angola: 'Africa',
  Somalia: 'Africa', Eritrea: 'Africa', Djibouti: 'Africa',
  // Asia
  India: 'Asia', China: 'Asia', Indonesia: 'Asia', Vietnam: 'Asia', Thailand: 'Asia',
  Cambodia: 'Asia', Laos: 'Asia', Myanmar: 'Asia', Philippines: 'Asia',
  Bangladesh: 'Asia', Pakistan: 'Asia', 'Sri Lanka': 'Asia', Nepal: 'Asia',
  Bhutan: 'Asia', Mongolia: 'Asia', Japan: 'Asia', 'South Korea': 'Asia',
  'North Korea': 'Asia', Taiwan: 'Asia', Malaysia: 'Asia', Singapore: 'Asia',
  Kazakhstan: 'Asia', Uzbekistan: 'Asia', Turkmenistan: 'Asia', Kyrgyzstan: 'Asia',
  Tajikistan: 'Asia', Afghanistan: 'Asia', 'Timor-Leste': 'Asia',
  // Europe
  Germany: 'Europe', France: 'Europe', Italy: 'Europe', Spain: 'Europe',
  Portugal: 'Europe', 'United Kingdom': 'Europe', Ireland: 'Europe', Netherlands: 'Europe',
  Belgium: 'Europe', Luxembourg: 'Europe', Switzerland: 'Europe', Austria: 'Europe',
  Poland: 'Europe', Czechia: 'Europe', 'Czech Republic': 'Europe', Slovakia: 'Europe',
  Hungary: 'Europe', Romania: 'Europe', Bulgaria: 'Europe', Greece: 'Europe',
  Croatia: 'Europe', Slovenia: 'Europe', Serbia: 'Europe', Albania: 'Europe',
  'Bosnia and Herzegovina': 'Europe', Montenegro: 'Europe', 'North Macedonia': 'Europe',
  Denmark: 'Europe', Sweden: 'Europe', Norway: 'Europe', Finland: 'Europe',
  Iceland: 'Europe', Estonia: 'Europe', Latvia: 'Europe', Lithuania: 'Europe',
  Ukraine: 'Europe', Belarus: 'Europe', Moldova: 'Europe', Russia: 'Europe',
  Turkey: 'Europe',
  // Middle East
  'Saudi Arabia': 'Middle East', 'United Arab Emirates': 'Middle East', Qatar: 'Middle East',
  Bahrain: 'Middle East', Kuwait: 'Middle East', Oman: 'Middle East', Yemen: 'Middle East',
  Iraq: 'Middle East', Iran: 'Middle East', Jordan: 'Middle East', Lebanon: 'Middle East',
  Syria: 'Middle East', Israel: 'Middle East', Palestine: 'Middle East',
  // Latin America
  Mexico: 'Latin America', Guatemala: 'Latin America', Belize: 'Latin America',
  'El Salvador': 'Latin America', Honduras: 'Latin America', Nicaragua: 'Latin America',
  'Costa Rica': 'Latin America', Panama: 'Latin America', Cuba: 'Latin America',
  Haiti: 'Latin America', 'Dominican Republic': 'Latin America', Jamaica: 'Latin America',
  'Trinidad and Tobago': 'Latin America', Colombia: 'Latin America', Venezuela: 'Latin America',
  Ecuador: 'Latin America', Peru: 'Latin America', Bolivia: 'Latin America',
  Brazil: 'Latin America', Paraguay: 'Latin America', Uruguay: 'Latin America',
  Argentina: 'Latin America', Chile: 'Latin America', Guyana: 'Latin America',
  Suriname: 'Latin America',
  // North America
  'United States': 'North America', 'United States of America': 'North America',
  Canada: 'North America', Bermuda: 'North America',
  // Oceania
  Australia: 'Oceania', 'New Zealand': 'Oceania', Fiji: 'Oceania',
  'Papua New Guinea': 'Oceania', 'Solomon Islands': 'Oceania', Vanuatu: 'Oceania',
  Samoa: 'Oceania', Tonga: 'Oceania', Kiribati: 'Oceania',
};

function regionFor(country: string | null, fallback?: string): string | null {
  if (fallback) return fallback;
  if (!country) return null;
  return COUNTRY_TO_REGION[country] ?? null;
}

function vcsUrl(id: string): string {
  return `https://registry.verra.org/app/projectDetail/VCS/${id}`;
}

function ingestVcs(): ProjectRecord[] {
  const rows = readCsvDict(join(DATA_DIR, 'verra/vcs/projects.csv'));
  return rows.map<ProjectRecord>(r => ({
    id: `vcs-${r['ID']}`,
    registry: 'verra_vcs',
    name: r['Name'] || '(untitled project)',
    developer: r['Proponent'] || null,
    methodology: r['Methodology'] || null,
    projectType: r['Project Type'] || null,
    country: r['Country/Area'] || null,
    region: r['Region'] || null,
    status: r['Status'] || '',
    statusBucket: normalizeVerraStatus(r['Status'] || ''),
    estAnnualReductions: parseNumber(r['Estimated Annual Emission Reductions']),
    estUnit: 'tCO2e',
    registrationDate: parseDate(r['Project Registration Date']),
    creditingPeriodStart: parseDate(r['Crediting Period Start Date']),
    creditingPeriodEnd: parseDate(r['Crediting Period End Date']),
    additionalCertifications: [],
    registryUrl: r['Project URL'] || vcsUrl(r['ID']),
  }));
}

function ingestCcb(): ProjectRecord[] {
  const rows = readCsvDict(join(DATA_DIR, 'verra/ccb/projects.csv'));
  return rows.map<ProjectRecord>(r => {
    const distinctions = (r['Distinctions'] || '')
      .split(';')
      .map(s => s.trim())
      .filter(Boolean);
    const certs = ['CCB', ...distinctions];
    return {
      id: `ccb-${r['ID']}`,
      registry: 'verra_ccb',
      name: r['Name'] || '(untitled project)',
      developer: r['Proponent'] || null,
      methodology: null,
      projectType: r['CCB Project Type'] || null,
      country: r['Country/Area'] || null,
      region: r['Region'] || null,
      status: r['Status'] || '',
      statusBucket: normalizeVerraStatus(r['Status'] || ''),
      estAnnualReductions: null,
      estUnit: 'tCO2e',
      registrationDate: null,
      creditingPeriodStart: null,
      creditingPeriodEnd: null,
      additionalCertifications: Array.from(new Set(certs)),
      registryUrl: r['Project URL'] || vcsUrl(r['ID']),
    };
  });
}

function ingestPwrp(): ProjectRecord[] {
  const rows = readCsvDict(join(DATA_DIR, 'verra/pwrp/projects.csv'));
  return rows.map<ProjectRecord>(r => ({
    id: `pwrp-${r['ID']}`,
    registry: 'verra_pwrp',
    name: r['Name'] || '(untitled project)',
    developer: r['Proponent'] || null,
    methodology: null,
    projectType: r['Project Type'] || null,
    country: r['Country/Area'] || null,
    region: r['Region'] || null,
    status: r['Status'] || '',
    statusBucket: normalizeVerraStatus(r['Status'] || ''),
    estAnnualReductions: parseNumber(
      r['Average Amount of Plastic Waste Collected/Recycled'],
    ),
    estUnit: 'tonnes_plastic',
    registrationDate: parseDate(r['Project Registration Date']),
    creditingPeriodStart: null,
    creditingPeriodEnd: null,
    additionalCertifications: [],
    registryUrl: r['Project URL'] || vcsUrl(r['ID']),
  }));
}

function ingestGoldStandard(): ProjectRecord[] {
  const rows = readCsvDict(join(DATA_DIR, 'goldstandard/projects.csv'));
  return rows.map<ProjectRecord>(r => {
    const country = r['country'] || null;
    return {
      id: `gs-${r['id']}`,
      registry: 'goldstandard',
      name: r['name'] || '(untitled project)',
      developer: r['project_developer'] || null,
      methodology: r['methodology'] || null,
      projectType: r['type'] || null,
      country,
      region: regionFor(country),
      status: r['status'] || '',
      statusBucket: normalizeGsStatus(r['status'] || ''),
      estAnnualReductions: parseNumber(r['estimated_annual_credits']),
      estUnit: 'tCO2e',
      registrationDate: parseDate(r['created_at']),
      creditingPeriodStart: parseDate(r['crediting_period_start_date']),
      creditingPeriodEnd: parseDate(r['crediting_period_end_date']),
      additionalCertifications: [],
      registryUrl: r['project_url'] || `https://registry.goldstandard.org/projects/details/${r['id']}`,
    };
  });
}

function main() {
  const vcs = ingestVcs();
  const ccb = ingestCcb();
  const pwrp = ingestPwrp();
  const gs = ingestGoldStandard();

  const all: ProjectRecord[] = [...vcs, ...ccb, ...pwrp, ...gs];

  // Aggregates pulled from program_summary.json for the live stat tiles.
  const summary = JSON.parse(
    readFileSync(join(DATA_DIR, 'verra/program_summary.json'), 'utf-8'),
  );
  const issued =
    (summary.VCS?.issued ?? 0) +
    (summary.CCB?.issued ?? 0) +
    (summary.PWRP?.issued ?? 0);
  const retired =
    (summary.VCS?.retired ?? 0) +
    (summary.CCB?.retired ?? 0) +
    (summary.PWRP?.retired ?? 0);
  const buffer = summary.VCS?.resourcesBufferCreditsDeposited ?? 0;

  // Pre-compute facet counts so the client can render the left rail without a
  // second pass over the full dataset.
  const countBy = (key: keyof ProjectRecord): Record<string, number> => {
    const out: Record<string, number> = {};
    for (const p of all) {
      const v = p[key];
      if (typeof v === 'string' && v) out[v] = (out[v] ?? 0) + 1;
    }
    return out;
  };

  const payload = {
    generatedAt: new Date().toISOString(),
    totals: {
      projects: all.length,
      vcusIssued: issued,
      vcusRetired: retired,
      bufferPool: buffer,
    },
    facets: {
      registry: countBy('registry'),
      methodology: countBy('methodology'),
      country: countBy('country'),
      statusBucket: countBy('statusBucket'),
    },
    projects: all,
  };

  if (!existsSync(PUBLIC_DIR)) mkdirSync(PUBLIC_DIR, { recursive: true });
  writeFileSync(
    join(PUBLIC_DIR, 'carbon-market-index.json'),
    JSON.stringify(payload),
  );

  // Separate description side-file, lazy-loaded by the client only when a user
  // expands a row. Keeping it out of the main index avoids a ~7 MB hit on the
  // initial payload.
  const detailsDir = join(DATA_DIR, 'verra/vcs/project_details');
  const descriptions: Record<string, string> = {};
  if (existsSync(detailsDir)) {
    const files = readdirSync(detailsDir).filter(f => f.endsWith('.json'));
    for (const f of files) {
      try {
        const raw = JSON.parse(readFileSync(join(detailsDir, f), 'utf-8'));
        const id = raw.resourceIdentifier || f.replace(/\.json$/, '');
        const desc = (raw.description || '').trim();
        if (desc) descriptions[`vcs-${id}`] = desc;
      } catch {
        // skip malformed
      }
    }
  }
  writeFileSync(
    join(PUBLIC_DIR, 'carbon-market-descriptions.json'),
    JSON.stringify(descriptions),
  );
  const descMb = (JSON.stringify(descriptions).length / 1024 / 1024).toFixed(2);
  console.log(
    `[carbon-market] ${Object.keys(descriptions).length} descriptions written (${descMb} MB)`,
  );
  const sizeMb = (
    JSON.stringify(payload).length /
    1024 /
    1024
  ).toFixed(2);
  console.log(
    `[carbon-market] ${all.length} projects written (${sizeMb} MB). ` +
      `VCS=${vcs.length} CCB=${ccb.length} PWRP=${pwrp.length} GS=${gs.length}`,
  );
}

main();
