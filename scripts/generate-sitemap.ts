/**
 * generate-sitemap.ts - Build-time sitemap generator.
 * Produces public/sitemap.xml covering all courses, lessons, and static pages.
 *
 * Run: npx tsx scripts/generate-sitemap.ts
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

const SITE_URL = 'https://greentryst.com';
const PUBLIC_DIR = join(__dirname, '..', 'public');

// Import course data
const { getAllCourses, getAllLessons } = require('../src/lib/courses');

interface UrlEntry {
  loc: string;
  priority: string;
  changefreq: string;
}

const urls: UrlEntry[] = [];

// Static pages
urls.push({ loc: '/', priority: '1.0', changefreq: 'weekly' });
urls.push({ loc: '/glossary', priority: '0.6', changefreq: 'monthly' });
urls.push({ loc: '/carbon/market', priority: '0.9', changefreq: 'daily' });
urls.push({ loc: '/disclaimer', priority: '0.3', changefreq: 'yearly' });

// Course pages + lessons
const courses = getAllCourses();
for (const course of courses) {
  urls.push({
    loc: `/courses/${course.id}`,
    priority: '0.8',
    changefreq: 'weekly',
  });

  const lessons = getAllLessons(course);
  for (const lesson of lessons) {
    const lessonUrl = lesson.id.replace('.', '_');
    urls.push({
      loc: `/courses/${course.id}/${lessonUrl}`,
      priority: '0.7',
      changefreq: 'monthly',
    });
  }
}

const today = new Date().toISOString().split('T')[0];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    u => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

writeFileSync(join(PUBLIC_DIR, 'sitemap.xml'), xml);
console.log(`Sitemap: ${urls.length} URLs written to public/sitemap.xml`);
