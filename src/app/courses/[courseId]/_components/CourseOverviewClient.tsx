'use client';

import Link from 'next/link';
import { useProgress } from '@/lib/progress-cloud';
import type { Course } from '@/lib/types';
import { getColor } from '@/lib/colors';
import { lessonIdToUrl } from '@/lib/url-helpers';
import ProgressBar from '@/components/learning/ProgressBar';
import CourseRoadmap from '@/components/learning/CourseRoadmap';
import Breadcrumb from '@/components/platform/Breadcrumb';
import Footer from '@/components/platform/Footer';

interface Props {
  course: Course;
  totalLessons: number;
}

export default function CourseOverviewClient({ course, totalLessons }: Props) {
  const progress = useProgress(course.id);
  const colors = getColor(course.color);

  const completedCount = progress.mounted
    ? course.modules.flatMap(m => m.lessons).filter(l => progress.isCompleted(l.id)).length
    : 0;

  const percent = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  const resumeHref = progress.mounted && progress.lastAccessedLesson
    ? `/courses/${course.id}/${lessonIdToUrl(progress.lastAccessedLesson)}`
    : `/courses/${course.id}/${lessonIdToUrl(course.modules[0].lessons[0].id)}`;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 min-[400px]:px-5 sm:px-6 py-8">
        {/* Breadcrumb */}
        <Breadcrumb
          crumbs={[
            { label: 'Home', href: '/' },
            { label: course.title },
          ]}
        />

        {/* Course header */}
        <div className="mt-6 mb-8">
          <div className="flex items-start gap-4">
            <span className="text-5xl" role="img" aria-label={course.title}>
              {course.icon}
            </span>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {course.title}
              </h1>
              <p className="text-gray-500 mt-1">{course.subtitle}</p>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                <span>{totalLessons} lessons</span>
                <span>·</span>
                <span>~{course.estimatedHours}h</span>
                {progress.mounted && completedCount > 0 && (
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

          {/* Progress bar */}
          {progress.mounted && completedCount > 0 && (
            <div className="mt-4">
              <ProgressBar
                percent={percent}
                colorClass={colors.bg}
                label={`${Math.round(percent)}% complete`}
              />
            </div>
          )}

          {/* Resume CTA */}
          <div className="mt-5 flex gap-3">
            <Link
              href={resumeHref}
              className={`inline-flex items-center gap-2 px-5 py-2.5 font-medium rounded-xl text-white transition-colors ${colors.btn}`}
            >
              {completedCount > 0 ? '▶ Resume Course' : '▶ Start Course'}
            </Link>
            {completedCount > 0 && (
              <Link
                href={`/courses/${course.id}/${lessonIdToUrl(course.modules[0].lessons[0].id)}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 font-medium rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Start from Beginning
              </Link>
            )}
          </div>
        </div>

        {/* Course Roadmap */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Course Roadmap</h2>
          <CourseRoadmap
            course={course}
            completedLessons={
              progress.mounted
                ? Object.fromEntries(
                    course.modules
                      .flatMap(m => m.lessons)
                      .filter(l => progress.isCompleted(l.id))
                      .map(l => [l.id, true])
                  )
                : {}
            }
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
