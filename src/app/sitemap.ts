import { MetadataRoute } from 'next';
import { getAllCourses, getAllLessons } from '@/lib/courses';
import { lessonIdToUrl } from '@/lib/url-helpers';
import { getAllGuides } from '@/lib/guides';

const siteUrl = 'https://greentryst.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const courses = getAllCourses();
  const guides = getAllGuides();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${siteUrl}/guides`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/glossary`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/disclaimer`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/feedback`, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Guide pages
  const guidePages: MetadataRoute.Sitemap = guides.map(guide => ({
    url: `${siteUrl}/guides/${guide.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Course overview pages
  const coursePages: MetadataRoute.Sitemap = courses.map(course => ({
    url: `${siteUrl}/courses/${course.id}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Module landing pages
  const modulePages: MetadataRoute.Sitemap = courses.flatMap(course =>
    course.modules.map(mod => ({
      url: `${siteUrl}/courses/${course.id}/modules/${mod.id}`,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    }))
  );

  // Lesson pages
  const lessonPages: MetadataRoute.Sitemap = courses.flatMap(course =>
    getAllLessons(course).map(lesson => ({
      url: `${siteUrl}/courses/${course.id}/${lessonIdToUrl(lesson.id)}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );

  return [...staticPages, ...guidePages, ...coursePages, ...modulePages, ...lessonPages];
}
