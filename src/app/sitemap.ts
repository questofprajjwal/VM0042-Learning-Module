import { MetadataRoute } from 'next';
import { getAllCourses, getAllLessons } from '@/lib/courses';
import { lessonIdToUrl } from '@/lib/url-helpers';

const siteUrl = 'https://greentryst.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const courses = getAllCourses();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${siteUrl}/glossary`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/disclaimer`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/feedback`, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Course overview pages
  const coursePages: MetadataRoute.Sitemap = courses.map(course => ({
    url: `${siteUrl}/courses/${course.id}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Lesson pages
  const lessonPages: MetadataRoute.Sitemap = courses.flatMap(course =>
    getAllLessons(course).map(lesson => ({
      url: `${siteUrl}/courses/${course.id}/${lessonIdToUrl(lesson.id)}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );

  return [...staticPages, ...coursePages, ...lessonPages];
}
