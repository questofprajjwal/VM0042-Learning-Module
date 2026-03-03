/**
 * courses.ts — Course registry and metadata loader
 *
 * Reads course.yaml files from src/content/<courseId>/course.yaml,
 * validates with Zod, and provides helpers for lesson enumeration.
 *
 * All functions here are designed for server-side / build-time use.
 * They use Node.js `fs` directly (not import).
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import * as yaml from 'js-yaml';
import { CourseSchema } from './schemas';
import type { Course, Module, LessonMeta, LessonNavContext, QuizQuestion } from './types';
export { lessonIdToUrl, urlToLessonId } from './url-helpers';

const CONTENT_DIR = join(process.cwd(), 'src', 'content');

// ─── Course discovery ─────────────────────────────────────────────────────────

export function getAllCourseIds(): string[] {
  if (!existsSync(CONTENT_DIR)) return [];
  return readdirSync(CONTENT_DIR)
    .filter(d => !d.startsWith('_'))
    .filter(d => existsSync(join(CONTENT_DIR, d, 'course.yaml')));
}

export function getCourse(courseId: string): Course {
  const courseYamlPath = join(CONTENT_DIR, courseId, 'course.yaml');
  if (!existsSync(courseYamlPath)) {
    throw new Error(`Course not found: ${courseId}`);
  }
  const raw = yaml.load(readFileSync(courseYamlPath, 'utf-8'));
  const result = CourseSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(`Invalid course.yaml for ${courseId}: ${result.error.message}`);
  }
  return result.data as Course;
}

export function getAllCourses(): Course[] {
  return getAllCourseIds().reduce<Course[]>((acc, id) => {
    try {
      acc.push(getCourse(id));
    } catch {
      // Skip courses that fail validation (e.g. incomplete drafts)
    }
    return acc;
  }, []);
}

// ─── Lesson helpers ───────────────────────────────────────────────────────────

export function getAllLessons(course: Course): LessonMeta[] {
  return course.modules.flatMap(m => m.lessons);
}

export function getLessonNavContext(
  course: Course,
  lessonId: string
): LessonNavContext | null {
  const allLessons = getAllLessons(course);
  const flatIdx = allLessons.findIndex(l => l.id === lessonId);
  if (flatIdx === -1) return null;

  const prevLesson = flatIdx > 0 ? allLessons[flatIdx - 1] : null;
  const nextLesson = flatIdx < allLessons.length - 1 ? allLessons[flatIdx + 1] : null;

  // Find which module this lesson belongs to
  let moduleTitle = '';
  let lessonIndex = 1;
  let moduleLessonCount = 1;
  for (const mod of course.modules) {
    const idx = mod.lessons.findIndex(l => l.id === lessonId);
    if (idx !== -1) {
      moduleTitle = mod.title;
      lessonIndex = idx + 1;
      moduleLessonCount = mod.lessons.length;
      break;
    }
  }

  return { prevLesson, nextLesson, moduleTitle, lessonIndex, moduleLessonCount };
}

export function getModuleForLesson(course: Course, lessonId: string): Module | null {
  return course.modules.find(m => m.lessons.some(l => l.id === lessonId)) ?? null;
}

// ─── Quiz loader ──────────────────────────────────────────────────────────────

export function getQuiz(courseId: string, lessonId: string): QuizQuestion[] {
  const quizPath = join(CONTENT_DIR, courseId, 'quizzes', `${lessonId}.yaml`);
  if (!existsSync(quizPath)) return [];
  try {
    const raw = yaml.load(readFileSync(quizPath, 'utf-8'));
    if (!Array.isArray(raw)) return [];
    // Validate and strip any malformed questions at build time
    const { QuizQuestionSchema } = require('./schemas');
    return raw
      .map((q: unknown) => {
        const result = QuizQuestionSchema.safeParse(q);
        return result.success ? result.data : null;
      })
      .filter(Boolean) as QuizQuestion[];
  } catch {
    return [];
  }
}

// ─── Static params helpers (for Next.js generateStaticParams) ─────────────────

export function getCourseStaticParams(): Array<{ courseId: string }> {
  return getAllCourses().map(course => ({ courseId: course.id }));
}

export function getLessonStaticParams(): Array<{ courseId: string; lessonId: string }> {
  return getAllCourses().flatMap(course => {
    return getAllLessons(course).map(l => ({
      courseId: course.id,
      lessonId: l.id.replace('.', '_'),  // dots not valid in URL segments on some systems
    }));
  });
}

