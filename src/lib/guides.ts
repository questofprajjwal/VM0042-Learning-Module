/**
 * guides.ts - Server-side guide loader.
 * Reads guide MDX files from src/content/guides/, parses frontmatter,
 * and provides helpers for the /guides routes.
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

export interface GuideMeta {
  slug: string;
  title: string;
  description: string;
  courses: string[];
  readingMinutes: number;
  lastUpdated: string;
}

const GUIDES_DIR = join(process.cwd(), 'src', 'content', 'guides');

export function getAllGuides(): GuideMeta[] {
  if (!existsSync(GUIDES_DIR)) return [];
  return readdirSync(GUIDES_DIR)
    .filter(f => f.endsWith('.mdx'))
    .map(f => {
      const slug = f.replace(/\.mdx$/, '');
      return getGuide(slug);
    })
    .filter((g): g is GuideMeta => g !== null);
}

export function getGuide(slug: string): GuideMeta | null {
  const filePath = join(GUIDES_DIR, `${slug}.mdx`);
  if (!existsSync(filePath)) return null;
  const raw = readFileSync(filePath, 'utf-8');
  const { data } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? '',
    courses: Array.isArray(data.courses) ? data.courses : [],
    readingMinutes: data.readingMinutes ?? 10,
    lastUpdated: data.lastUpdated ?? '',
  };
}

export function getGuideContent(slug: string): string {
  const filePath = join(GUIDES_DIR, `${slug}.mdx`);
  if (!existsSync(filePath)) return '';
  const raw = readFileSync(filePath, 'utf-8');
  const { content } = matter(raw);
  return content;
}

export function getGuideStaticParams(): { slug: string }[] {
  return getAllGuides().map(g => ({ slug: g.slug }));
}
