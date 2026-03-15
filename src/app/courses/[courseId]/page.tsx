import { getCourse, getAllLessons, lessonIdToUrl } from '@/lib/courses';
import CourseOverviewClient from './_components/CourseOverviewClient';
import type { Metadata } from 'next';

const siteUrl = 'https://sustainabilityacademy.vercel.app';

interface Props {
  params: { courseId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = getCourse(params.courseId);
  const lessonCount = getAllLessons(course).length;
  const description = `${course.description} ${lessonCount} lessons, ~${course.estimatedHours}h. Free.`;
  const pageUrl = `${siteUrl}/courses/${params.courseId}`;

  return {
    title: course.title,
    description,
    openGraph: {
      title: `${course.title} - Green Tryst`,
      description,
      url: pageUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${course.title} - Green Tryst`,
      description,
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default function CourseOverviewPage({ params }: Props) {
  const course = getCourse(params.courseId);
  const totalLessons = getAllLessons(course).length;
  const pageUrl = `${siteUrl}/courses/${params.courseId}`;

  // ── JSON-LD: Course schema ──
  const courseJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    url: pageUrl,
    provider: {
      '@type': 'Organization',
      name: 'Green Tryst - Sustainability Academy',
      url: siteUrl,
    },
    isAccessibleForFree: true,
    inLanguage: 'en',
    numberOfLessons: totalLessons,
    timeRequired: `PT${course.estimatedHours}H`,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: `PT${course.estimatedHours}H`,
    },
    syllabusSections: course.modules.map(m => ({
      '@type': 'Syllabus',
      name: m.title,
      description: m.subtitle,
    })),
  };

  // ── JSON-LD: BreadcrumbList ──
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: course.title,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CourseOverviewClient course={course} totalLessons={totalLessons} />
    </>
  );
}
