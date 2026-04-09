import { getGuide, getGuideContent, getGuideStaticParams } from '@/lib/guides';
import { getCourse } from '@/lib/courses';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { getMDXComponents } from '@/components/content/mdx-components';
import PlatformNav from '@/components/platform/PlatformNav';
import Footer from '@/components/platform/Footer';
import GuideCourseCards from '@/components/platform/GuideCourseCards';
import Link from 'next/link';
import type { Metadata } from 'next';

const siteUrl = 'https://greentryst.com';

export const dynamicParams = false;

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getGuideStaticParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getGuide(params.slug);
  if (!guide) return { title: 'Guide Not Found' };

  const pageUrl = `${siteUrl}/guides/${params.slug}`;
  return {
    title: `${guide.title} - Green Tryst`,
    description: guide.description,
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: pageUrl,
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title: guide.title,
      description: guide.description,
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default function GuidePage({ params }: Props) {
  const guide = getGuide(params.slug);
  if (!guide) return null;

  const mdxContent = getGuideContent(params.slug);
  const pageUrl = `${siteUrl}/guides/${params.slug}`;

  // Load course data for bottom cards
  const courses = guide.courses
    .map(id => { try { return getCourse(id); } catch { return null; } })
    .filter((c): c is NonNullable<typeof c> => c !== null);

  // JSON-LD: Article
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    url: pageUrl,
    dateModified: guide.lastUpdated || undefined,
    isAccessibleForFree: true,
    inLanguage: 'en',
    author: {
      '@type': 'Organization',
      name: 'Green Tryst - Sustainability Academy',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Green Tryst - Sustainability Academy',
      url: siteUrl,
    },
  };

  // JSON-LD: BreadcrumbList
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: `${siteUrl}/guides` },
      { '@type': 'ListItem', position: 3, name: guide.title, item: pageUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PlatformNav />

      {/* Hero section with background */}
      <div className="bg-gradient-to-b from-emerald-50/60 to-white border-b border-emerald-100/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-5" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/guides" className="hover:text-gray-600 transition-colors">Guides</Link>
            <span>/</span>
            <span className="text-gray-600 truncate">{guide.title}</span>
          </nav>

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium mb-4">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            Practitioner Guide
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-3">
            {guide.title}
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed mb-5 max-w-2xl">
            {guide.description}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {guide.readingMinutes} min read
            </span>
            {guide.lastUpdated && (
              <>
                <span className="text-gray-300">|</span>
                <span>Updated {guide.lastUpdated}</span>
              </>
            )}
            {courses.length > 0 && (
              <>
                <span className="text-gray-300">|</span>
                <span>{courses.length} related courses</span>
              </>
            )}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* MDX Content */}
        <article className="guide-content lesson-content">
          <MDXRemote
            source={mdxContent}
            components={getMDXComponents()}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </article>

        {/* Bottom course cards */}
        <GuideCourseCards courses={courses} />
      </main>
      <Footer />
    </>
  );
}
