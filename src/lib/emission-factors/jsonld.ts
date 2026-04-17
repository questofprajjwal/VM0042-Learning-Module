// schema.org JSON-LD builders for emission factor and source pages.
// Factor -> Dataset. Source -> DataCatalog.

import type { Factor, Source } from './types';
import { formatUnit } from './unit-display';

export function buildFactorJsonLd(factor: Factor, source: Source) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${factor.activity} (${factor.region_display}) - ${source.publisher_short} ${source.vintage_year}`,
    description:
      factor.notes && factor.notes.trim().length > 0
        ? factor.notes.trim()
        : `Emission factor for ${factor.activity} in ${factor.region_display}.`,
    identifier: factor.id,
    keywords: factor.tags.join(', '),
    license: source.license,
    creator: {
      '@type': 'Organization',
      name: source.publisher,
    },
    isBasedOn: source.source_url,
    datePublished: `${factor.published_year}`,
    variableMeasured: {
      '@type': 'PropertyValue',
      name: factor.activity,
      value: factor.value,
      unitText: formatUnit(factor),
    },
    spatialCoverage: factor.region_display,
    temporalCoverage: `${factor.vintage_year}`,
  };
}

export function buildSourceJsonLd(source: Source, factorCount: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DataCatalog',
    name: source.name,
    description: source.description,
    publisher: {
      '@type': 'Organization',
      name: source.publisher,
    },
    license: source.license,
    url: source.source_url,
    datePublished: source.published_date,
    measurementTechnique: `${factorCount} emission factors`,
  };
}
