import { getAllGuides } from '@/lib/guides';
import PlatformNav from '@/components/platform/PlatformNav';
import Footer from '@/components/platform/Footer';
import Link from 'next/link';
import type { Metadata } from 'next';

const siteUrl = 'https://greentryst.com';

export const metadata: Metadata = {
  title: 'Guides - Green Tryst',
  description: 'Practitioner guides answering the most common sustainability, ESG, and carbon markets questions.',
  openGraph: {
    title: 'Guides - Green Tryst',
    description: 'Practitioner guides answering the most common sustainability, ESG, and carbon markets questions.',
    url: `${siteUrl}/guides`,
  },
  alternates: {
    canonical: `${siteUrl}/guides`,
  },
};

export default function GuidesIndexPage() {
  const guides = getAllGuides();

  const guidesJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Sustainability Guides',
    description: 'Practitioner guides for sustainability, ESG, and carbon markets professionals.',
    url: `${siteUrl}/guides`,
    itemListElement: guides.map((g, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${siteUrl}/guides/${g.slug}`,
      name: g.title,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guidesJsonLd) }}
      />
      <PlatformNav />

      {/* Hero */}
      <div className="bg-gradient-to-b from-emerald-50/60 to-white border-b border-emerald-100/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium mb-4">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            Practitioner Guides
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Guides</h1>
          <p className="text-gray-500 max-w-xl">
            Practitioner answers to the questions sustainability professionals ask most. Each guide connects you to the relevant courses for deeper learning.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {guides.length === 0 ? (
          <p className="text-gray-400">Guides are coming soon.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {guides.map(guide => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group block bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-emerald-200 transition-all duration-200 no-underline"
              >
                <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400" />
                <div className="p-5">
                  <h2 className="font-semibold text-gray-900 text-base leading-snug mb-2 group-hover:text-emerald-700 transition-colors">
                    {guide.title}
                  </h2>
                  <p className="text-sm text-gray-500 line-clamp-3 mb-4">{guide.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {guide.readingMinutes} min
                      </span>
                      {guide.courses.length > 0 && (
                        <>
                          <span className="text-gray-300">|</span>
                          <span>{guide.courses.length} courses</span>
                        </>
                      )}
                    </div>
                    <svg className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
