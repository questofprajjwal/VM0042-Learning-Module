import { notFound } from 'next/navigation';
import {
  getCourse,
  getModuleById,
  getModuleStaticParams,
} from '@/lib/courses';
import { lessonIdToUrl } from '@/lib/url-helpers';
import ModuleLandingClient from './_components/ModuleLandingClient';
import type { Metadata } from 'next';

const siteUrl = 'https://greentryst.com';

export const dynamicParams = false;

interface Props {
  params: { courseId: string; moduleId: string };
}

export async function generateStaticParams() {
  return getModuleStaticParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = getCourse(params.courseId);
  const mod = getModuleById(course, params.moduleId);
  if (!mod) return {};

  const lessonCount = mod.lessons.length;
  const readingMinutes = mod.lessons.reduce(
    (sum, l) => sum + (l.readingMinutes ?? 0),
    0
  );
  const description = `${mod.subtitle} ${lessonCount} lessons${
    readingMinutes > 0 ? `, ~${readingMinutes} min read` : ''
  }. Part of ${course.title} on Green Tryst.`;

  const pageUrl = `${siteUrl}/courses/${params.courseId}/modules/${params.moduleId}`;
  const title = `${mod.title} - ${course.title}`;

  return {
    title,
    description,
    openGraph: {
      title: `${mod.title} - ${course.title}`,
      description,
      url: pageUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${mod.title} - ${course.title}`,
      description,
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default function ModulePage({ params }: Props) {
  const course = getCourse(params.courseId);
  const mod = getModuleById(course, params.moduleId);
  if (!mod) notFound();

  const moduleIndex = course.modules.findIndex(m => m.id === mod.id);
  const prevModule = moduleIndex > 0 ? course.modules[moduleIndex - 1] : null;
  const nextModule =
    moduleIndex >= 0 && moduleIndex < course.modules.length - 1
      ? course.modules[moduleIndex + 1]
      : null;

  const totalReadingMinutes = mod.lessons.reduce(
    (sum, l) => sum + (l.readingMinutes ?? 0),
    0
  );

  const pageUrl = `${siteUrl}/courses/${params.courseId}/modules/${params.moduleId}`;
  const courseUrl = `${siteUrl}/courses/${params.courseId}`;

  // ── JSON-LD: LearningResource for the module ──
  const learningResourceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: mod.title,
    description: mod.subtitle,
    url: pageUrl,
    inLanguage: 'en',
    isAccessibleForFree: true,
    learningResourceType: 'Module',
    numberOfLessons: mod.lessons.length,
    ...(totalReadingMinutes > 0 && {
      timeRequired: `PT${totalReadingMinutes}M`,
    }),
    isPartOf: {
      '@type': 'Course',
      name: course.title,
      url: courseUrl,
    },
    provider: {
      '@type': 'Organization',
      name: 'Green Tryst - Sustainability Academy',
      url: siteUrl,
    },
  };

  // ── JSON-LD: BreadcrumbList (Home → Course → Module) ──
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
        item: courseUrl,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: mod.title,
        item: pageUrl,
      },
    ],
  };

  // ── JSON-LD: ItemList of lessons in the module ──
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${mod.title} - Lessons`,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: mod.lessons.length,
    itemListElement: mod.lessons.map((lesson, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: lesson.title,
      url: `${courseUrl}/${lessonIdToUrl(lesson.id)}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <ModuleLandingClient
        course={course}
        module={mod}
        moduleIndex={moduleIndex}
        prevModule={prevModule}
        nextModule={nextModule}
        totalReadingMinutes={totalReadingMinutes}
      />
    </>
  );
}
