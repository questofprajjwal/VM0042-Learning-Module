'use client';

import { usePlatformProgress } from '@/lib/progress-cloud';
import type { Course } from '@/lib/types';
import CourseCard from '@/components/platform/CourseCard';
import PlatformNav from '@/components/platform/PlatformNav';
import Footer from '@/components/platform/Footer';
import { lessonIdToUrl } from '@/lib/url-helpers';
import { useState } from 'react';

interface CourseData {
  course: Course;
  totalLessons: number;
}

interface Props {
  courseData: CourseData[];
}

const CATEGORY_ORDER = ['all', 'fundamentals', 'green-finance', 'esg', 'markets'] as const;
const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  fundamentals: 'Fundamentals',
  'green-finance': 'Green Finance',
  esg: 'ESG',
  markets: 'Carbon Markets',
};

export default function LandingClient({ courseData }: Props) {
  const { mounted, getCourseProgress, lastAccessedCourse } = usePlatformProgress();
  const [activeCategory, setActiveCategory] = useState('all');

  // Build "Continue Learning" href
  let continueLessonHref: string | undefined;
  if (mounted && lastAccessedCourse) {
    const cp = getCourseProgress(lastAccessedCourse);
    if (cp?.lastAccessedLesson) {
      continueLessonHref = `/courses/${lastAccessedCourse}/${lessonIdToUrl(cp.lastAccessedLesson)}`;
    }
  }

  // Total stats
  let totalCompleted = 0;
  if (mounted) {
    for (const cd of courseData) {
      const cp = getCourseProgress(cd.course.id);
      totalCompleted += Object.keys(cp?.completedLessons ?? {}).length;
    }
  }
  const totalLessons = courseData.reduce((s, cd) => s + cd.totalLessons, 0);

  // Filter courses
  const filteredCourses = activeCategory === 'all'
    ? courseData
    : courseData.filter(cd => cd.course.category === activeCategory);

  // Only show categories that have courses
  const availableCategories = CATEGORY_ORDER.filter(
    cat => cat === 'all' || courseData.some(cd => cd.course.category === cat)
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PlatformNav lastLessonHref={continueLessonHref} />

      <main id="main-content" className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-green-700 via-emerald-700 to-teal-800 px-4 sm:px-6 py-20 sm:py-28">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

          <div className="relative max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-300" />
              <span className="text-sm font-medium text-emerald-200 tracking-wide uppercase">
                Free &amp; Open Source
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4 leading-tight">
              Learn Sustainability
            </h1>
            <p className="text-lg sm:text-xl text-emerald-100/80 mb-8 max-w-xl leading-relaxed">
              Master climate science, carbon markets, ESG reporting, and green finance with structured, expert-quality courses.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              {continueLessonHref ? (
                <>
                  <a
                    href={continueLessonHref}
                    className="inline-flex items-center gap-2 text-sm font-semibold bg-white text-green-800 px-5 py-2.5 rounded-lg hover:bg-green-50 transition-colors shadow-lg shadow-black/10"
                  >
                    Continue learning
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                  <a
                    href="#courses"
                    className="inline-flex items-center text-sm font-medium text-emerald-100 hover:text-white transition-colors"
                  >
                    Browse all courses
                  </a>
                </>
              ) : (
                <a
                  href="#courses"
                  className="inline-flex items-center gap-2 text-sm font-semibold bg-white text-green-800 px-5 py-2.5 rounded-lg hover:bg-green-50 transition-colors shadow-lg shadow-black/10"
                >
                  Browse courses
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
              )}
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10">
              {[
                { label: 'Audio Lessons', desc: 'Podcast-style narration for every lesson' },
                { label: 'Quizzes', desc: 'Test your understanding as you go' },
                { label: 'Glossary', desc: '190+ sustainability terms explained' },
                { label: 'Practitioner Tips', desc: 'Real-world examples and analogies' },
              ].map(f => (
                <div key={f.label} className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/10 px-4 py-3">
                  <p className="text-sm font-semibold text-white">{f.label}</p>
                  <p className="text-xs text-emerald-200/70 mt-0.5 leading-snug">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* Stats bar */}
            {mounted && (
              <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap gap-8">
                <div>
                  <p className="text-2xl font-bold text-white">{courseData.length}</p>
                  <p className="text-xs text-emerald-200/70 mt-0.5">Courses</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{totalLessons}</p>
                  <p className="text-xs text-emerald-200/70 mt-0.5">Lessons</p>
                </div>
                {totalCompleted > 0 && (
                  <div>
                    <p className="text-2xl font-bold text-emerald-300">{totalCompleted}</p>
                    <p className="text-xs text-emerald-200/70 mt-0.5">Completed</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Courses */}
        <div id="courses" className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
          <section aria-labelledby="courses-heading">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <h2 id="courses-heading" className="text-2xl font-bold text-gray-900 mb-1">
                  Courses
                </h2>
                <p className="text-sm text-gray-500">
                  {courseData.length} courses &middot; {totalLessons} lessons
                </p>
              </div>

              {/* Category filter pills */}
              <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter by category">
                {availableCategories.map(cat => (
                  <button
                    key={cat}
                    role="tab"
                    aria-selected={activeCategory === cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                      activeCategory === cat
                        ? 'bg-green-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {CATEGORY_LABELS[cat] ?? cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCourses.map(({ course, totalLessons: tl }) => {
                const cp = mounted ? getCourseProgress(course.id) : null;
                const completedCount = Object.keys(cp?.completedLessons ?? {}).length;
                const lastLesson = cp?.lastAccessedLesson;
                return (
                  <CourseCard
                    key={course.id}
                    course={course}
                    completedLessons={completedCount}
                    totalLessons={tl}
                    lastLessonId={lastLesson ? lessonIdToUrl(lastLesson) : undefined}
                  />
                );
              })}
            </div>

            {filteredCourses.length === 0 && (
              <p className="text-center text-gray-400 py-12">No courses in this category yet.</p>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
