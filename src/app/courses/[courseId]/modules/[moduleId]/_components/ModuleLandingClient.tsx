'use client';

import Link from 'next/link';
import { useProgress } from '@/lib/progress-cloud';
import type { Course, Module } from '@/lib/types';
import { getColor } from '@/lib/colors';
import { lessonIdToUrl } from '@/lib/url-helpers';
import ProgressBar from '@/components/learning/ProgressBar';
import Breadcrumb from '@/components/platform/Breadcrumb';
import Footer from '@/components/platform/Footer';

interface Props {
  course: Course;
  module: Module;
  moduleIndex: number;
  prevModule: Module | null;
  nextModule: Module | null;
  totalReadingMinutes: number;
}

export default function ModuleLandingClient({
  course,
  module: mod,
  moduleIndex,
  prevModule,
  nextModule,
  totalReadingMinutes,
}: Props) {
  const progress = useProgress(course.id);
  const colors = getColor(mod.color);

  const lessons = mod.lessons;
  const completedCount = progress.mounted
    ? lessons.filter(l => progress.isCompleted(l.id)).length
    : 0;
  const percent = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

  const firstLessonHref = `/courses/${course.id}/${lessonIdToUrl(lessons[0].id)}`;
  const nextIncomplete = progress.mounted
    ? lessons.find(l => !progress.isCompleted(l.id))
    : null;
  const resumeHref = nextIncomplete
    ? `/courses/${course.id}/${lessonIdToUrl(nextIncomplete.id)}`
    : firstLessonHref;

  const hasProgress = progress.mounted && completedCount > 0;
  const allDone = progress.mounted && completedCount === lessons.length;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 min-[400px]:px-5 sm:px-6 py-8">
        <Breadcrumb
          crumbs={[
            { label: 'Home', href: '/' },
            { label: course.title, href: `/courses/${course.id}` },
            { label: mod.title },
          ]}
        />

        <div className="mt-6 mb-8">
          <div className="flex items-start gap-4">
            <span className="text-5xl" role="img" aria-label={mod.title}>
              {mod.icon}
            </span>
            <div className="flex-1">
              <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${colors.text}`}>
                Module {moduleIndex + 1} of {course.modules.length}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {mod.title}
              </h1>
              <p className="text-gray-500 mt-1">{mod.subtitle}</p>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-400 flex-wrap">
                <span>{lessons.length} lessons</span>
                {totalReadingMinutes > 0 && (
                  <>
                    <span>·</span>
                    <span>~{totalReadingMinutes} min read</span>
                  </>
                )}
                {hasProgress && (
                  <>
                    <span>·</span>
                    <span className="text-green-600 font-medium">
                      {completedCount} completed
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {hasProgress && (
            <div className="mt-4">
              <ProgressBar
                percent={percent}
                colorClass={colors.bg}
                label={`${Math.round(percent)}% complete`}
              />
            </div>
          )}

          <div className="mt-5 flex gap-3 flex-wrap">
            <Link
              href={resumeHref}
              className={`inline-flex items-center gap-2 px-5 py-2.5 font-medium rounded-xl text-white transition-colors ${colors.btn}`}
            >
              {allDone ? 'Review Module' : hasProgress ? 'Resume Module' : 'Start Module'}
            </Link>
            {hasProgress && !allDone && (
              <Link
                href={firstLessonHref}
                className="inline-flex items-center gap-2 px-5 py-2.5 font-medium rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Start from Beginning
              </Link>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Lessons in this module</h2>
          <ol className="space-y-2">
            {lessons.map((lesson, idx) => {
              const isDone = progress.mounted && progress.isCompleted(lesson.id);
              const href = `/courses/${course.id}/${lessonIdToUrl(lesson.id)}`;
              return (
                <li key={lesson.id}>
                  <Link
                    href={href}
                    className="group flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm transition-all"
                  >
                    <div
                      className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 ${
                        isDone
                          ? 'bg-green-500 border-green-500 text-white'
                          : `${colors.light} ${colors.text} border-transparent`
                      }`}
                      aria-hidden
                    >
                      {isDone ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate group-hover:text-gray-700">
                        {lesson.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Lesson {lesson.id}
                        {typeof lesson.readingMinutes === 'number' && lesson.readingMinutes > 0 && (
                          <> · ~{lesson.readingMinutes} min read</>
                        )}
                      </p>
                    </div>
                    <svg
                      className="w-4 h-4 text-gray-400 flex-shrink-0 group-hover:text-gray-600 transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>

        {(prevModule || nextModule) && (
          <div className="mt-10 pt-6 border-t border-gray-200 flex items-center justify-between gap-4">
            {prevModule ? (
              <Link
                href={`/courses/${course.id}/modules/${prevModule.id}`}
                className="flex-1 max-w-xs group rounded-xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm transition-all p-4"
              >
                <p className="text-xs text-gray-500 mb-1">← Previous Module</p>
                <p className="font-medium text-gray-900 group-hover:text-gray-700 truncate">
                  {prevModule.title}
                </p>
              </Link>
            ) : (
              <div className="flex-1 max-w-xs" />
            )}
            {nextModule ? (
              <Link
                href={`/courses/${course.id}/modules/${nextModule.id}`}
                className="flex-1 max-w-xs group rounded-xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm transition-all p-4 text-right"
              >
                <p className="text-xs text-gray-500 mb-1">Next Module →</p>
                <p className="font-medium text-gray-900 group-hover:text-gray-700 truncate">
                  {nextModule.title}
                </p>
              </Link>
            ) : (
              <div className="flex-1 max-w-xs" />
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
