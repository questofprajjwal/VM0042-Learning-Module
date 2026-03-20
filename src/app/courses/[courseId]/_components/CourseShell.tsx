'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import PlatformNav from '@/components/platform/PlatformNav';
import Sidebar from '@/components/learning/Sidebar';
import { useProgress } from '@/lib/progress-cloud';
import { lessonIdToUrl, urlToLessonId } from '@/lib/url-helpers';
import type { Course } from '@/lib/types';

interface Props {
  course: Course;
  children: React.ReactNode;
}

export default function CourseShell({ course, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Derive current lesson ID from URL path: /courses/vm0042/0_1 → "0.1"
  const pathParts = pathname.split('/');
  const urlLessonId = pathParts[3]; // /courses/[courseId]/[lessonId]
  const currentLessonId = urlLessonId ? urlToLessonId(urlLessonId) : null;

  const progress = useProgress(course.id);

  const completedLessons: Record<string, boolean> = {};
  if (progress.mounted) {
    for (const mod of course.modules) {
      for (const l of mod.lessons) {
        if (progress.isCompleted(l.id)) completedLessons[l.id] = true;
      }
    }
  }

  let lastLessonHref: string | undefined;
  if (progress.mounted && progress.lastAccessedLesson) {
    lastLessonHref = `/courses/${course.id}/${lessonIdToUrl(progress.lastAccessedLesson)}`;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PlatformNav lastLessonHref={lastLessonHref} />

      {/* Mobile topbar */}
      <div className="md:hidden sticky top-14 z-20 bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open course navigation"
          aria-expanded={sidebarOpen}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          ☰
        </button>
        <span className="text-sm font-medium text-gray-700 truncate">
          {course.icon} {course.title}
        </span>
      </div>

      <div className="flex flex-1">
        <Sidebar
          course={course}
          currentLessonId={currentLessonId}
          completedLessons={completedLessons}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main
          id="main-content"
          className="flex-1 min-w-0"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
