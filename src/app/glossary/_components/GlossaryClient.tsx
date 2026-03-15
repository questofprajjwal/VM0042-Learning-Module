'use client';

import { useState, useMemo } from 'react';

interface GlossaryEntry {
  term: string;
  slug: string;
  definition: string;
  category: string;
  related: string[];
}

interface Props {
  entries: GlossaryEntry[];
}

const categoryLabels: Record<string, string> = {
  'carbon-markets': 'Carbon Markets',
  'climate-science': 'Climate Science',
  'climate-finance': 'Climate Finance',
  'ghg-accounting': 'GHG Accounting',
  'esg': 'ESG',
  'reporting-standards': 'Reporting Standards',
  'sustainability': 'Sustainability',
  'governance': 'Governance',
  'biodiversity': 'Biodiversity',
  'human-rights': 'Human Rights',
  'social-safeguards': 'Social Safeguards',
  'eu-taxonomy': 'EU Taxonomy',
};

const categoryColors: Record<string, string> = {
  'carbon-markets': 'bg-green-100 text-green-700',
  'climate-science': 'bg-blue-100 text-blue-700',
  'climate-finance': 'bg-indigo-100 text-indigo-700',
  'ghg-accounting': 'bg-amber-100 text-amber-700',
  'esg': 'bg-violet-100 text-violet-700',
  'reporting-standards': 'bg-rose-100 text-rose-700',
  'sustainability': 'bg-teal-100 text-teal-700',
  'governance': 'bg-orange-100 text-orange-700',
  'biodiversity': 'bg-emerald-100 text-emerald-700',
  'human-rights': 'bg-red-100 text-red-700',
  'social-safeguards': 'bg-pink-100 text-pink-700',
  'eu-taxonomy': 'bg-cyan-100 text-cyan-700',
};

export default function GlossaryClient({ entries }: Props) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => [...new Set(entries.map(e => e.category))].sort(),
    [entries]
  );

  const filtered = useMemo(() => {
    let result = entries;
    if (activeCategory) {
      result = result.filter(e => e.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        e =>
          e.term.toLowerCase().includes(q) ||
          e.definition.toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => a.term.localeCompare(b.term));
  }, [entries, search, activeCategory]);

  // Group by first letter
  const grouped = useMemo(() => {
    const groups: Record<string, GlossaryEntry[]> = {};
    for (const entry of filtered) {
      const letter = entry.term[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(entry);
    }
    return groups;
  }, [filtered]);

  const letters = Object.keys(grouped).sort();

  // Build slug->term map for related links
  const slugToTerm = useMemo(() => {
    const map: Record<string, string> = {};
    for (const e of entries) map[e.slug] = e.term;
    return map;
  }, [entries]);

  return (
    <div>
      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search terms..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !activeCategory ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-gray-900 text-white'
                  : `${categoryColors[cat] || 'bg-gray-100 text-gray-600'} hover:opacity-80`
              }`}
            >
              {categoryLabels[cat] || cat}
            </button>
          ))}
        </div>
      </div>

      {/* Alphabet jump links */}
      <div className="flex flex-wrap gap-1 mb-6">
        {letters.map(letter => (
          <a
            key={letter}
            href={`#letter-${letter}`}
            className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-600 hover:bg-green-100 hover:text-green-700 rounded transition-colors"
          >
            {letter}
          </a>
        ))}
      </div>

      {/* Term list */}
      {filtered.length === 0 && (
        <p className="text-gray-500 text-sm py-8 text-center">No terms found.</p>
      )}

      {letters.map(letter => (
        <div key={letter} id={`letter-${letter}`} className="mb-8">
          <h2 className="text-2xl font-bold text-gray-300 mb-3 border-b border-gray-100 pb-1">
            {letter}
          </h2>
          <div className="space-y-4">
            {grouped[letter].map(entry => (
              <div
                key={entry.slug}
                id={`term-${entry.slug}`}
                className="bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-gray-900">
                    {entry.term}
                  </h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                      categoryColors[entry.category] || 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {categoryLabels[entry.category] || entry.category}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {entry.definition}
                </p>
                {entry.related.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="text-xs text-gray-400">Related:</span>
                    {entry.related.map(slug => (
                      <a
                        key={slug}
                        href={`#term-${slug}`}
                        className="text-xs text-green-600 hover:text-green-800 hover:underline"
                      >
                        {slugToTerm[slug] || slug}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
