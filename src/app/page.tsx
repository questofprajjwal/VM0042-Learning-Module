import { getAllCourses, getAllLessons } from '@/lib/courses';
import LandingClient from './_components/LandingClient';

const siteUrl = 'https://greentryst.com';

export default function HomePage() {
  const courses = getAllCourses();
  const courseData = courses.map(course => ({
    course: course,
    totalLessons: getAllLessons(course).length,
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Green Tryst - Sustainability Academy',
    url: siteUrl,
    description:
      'Free, expert-authored courses on climate science, carbon markets, ESG reporting, GHG accounting, and more.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const coursesJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: courses
      .filter(c => c.status === 'published')
      .map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Course',
          name: c.title,
          description: c.description,
          url: `${siteUrl}/courses/${c.id}`,
          provider: {
            '@type': 'Organization',
            name: 'Green Tryst - Sustainability Academy',
          },
          isAccessibleForFree: true,
        },
      })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(coursesJsonLd) }}
      />
      <LandingClient courseData={courseData} />
    </>
  );
}
