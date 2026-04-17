/**
 * Surface 3 (alternate) - Single factor page, brutalist variant.
 *
 * Dark brutalist restyling of the factor record. One number carries the
 * hero, everything else sits as austere metadata underneath. Family-based URL
 * with client-side unit switching.
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  loadResolvedFactors,
  getResolvedFactorBySlug,
  getFactorFamilyBySlug,
  getTopFactorSlugsForStaticGen,
} from '@/lib/emission-factors/loader';
import { findRelatedFactors } from '@/lib/emission-factors/related';
import { buildFactorJsonLd } from '@/lib/emission-factors/jsonld';
import { EFAltPageClient } from '../../_components/EFAltPageClient';

// See the non-alt route: top-200 SSG + ISR for the long tail.
export const dynamicParams = true;
export const revalidate = 3600;

export function generateStaticParams() {
  return getTopFactorSlugsForStaticGen(200).map((slug) => ({ slug }));
}

function truncate(str: string, max = 155): string {
  const clean = str.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max - 1).trimEnd() + '.';
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const factor = getResolvedFactorBySlug(params.slug);
  if (!factor) return { title: 'Factor not found' };
  const title = `${factor.activity} - ${factor.region_display} (${factor.source.publisher_short} ${factor.vintage_year}) - brutalist view`;
  const description = truncate(
    factor.notes && factor.notes.trim()
      ? factor.notes
      : `${factor.value} ${factor.unit_numerator}/${factor.unit_denominator} for ${factor.activity} in ${factor.region_display}, from ${factor.source.publisher_short} ${factor.vintage_year}.`,
  );
  const canonical = `https://greentryst.com/tools/emission-factors/${factor.slug}/alt`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      url: canonical,
      title,
      description,
      siteName: 'Greentryst',
    },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: false, follow: true },
  };
}

export default function FactorPageAlt({ params }: { params: { slug: string } }) {
  const family = getFactorFamilyBySlug(params.slug);
  if (family.length === 0) notFound();

  const primaryFactor = family[0];

  const all = loadResolvedFactors();
  const related = findRelatedFactors(primaryFactor, all, 4);

  let supersedingSlug: string | null = null;
  let supersedingLabel = '';
  if (primaryFactor.superseded_by) {
    const target = all.find((f) => f.id === primaryFactor.superseded_by);
    if (target) {
      supersedingSlug = target.slug;
      supersedingLabel = `${target.source.publisher_short} ${target.vintage_year}`;
    }
  }

  const jsonLd = buildFactorJsonLd(primaryFactor, primaryFactor.source);

  return (
    <div
      className="relative w-full text-white pt-16"
      style={{
        backgroundImage:
          'linear-gradient(180deg, #18181B 0%, #1A201D 35%, #1B2A25 100%)',
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <EFAltPageClient
        family={family}
        related={related}
        supersedingSlug={supersedingSlug}
        supersedingLabel={supersedingLabel}
      />
    </div>
  );
}
