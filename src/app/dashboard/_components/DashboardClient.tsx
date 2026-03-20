'use client';

import Link from 'next/link';
import { getColor } from '@/lib/colors';
import { lessonIdToUrl } from '@/lib/url-helpers';
import PlatformNav from '@/components/platform/PlatformNav';
import StreakCalendar from './StreakCalendar';

interface EnrolledCourse {
  courseId: string;
  title: string;
  icon: string;
  color: string;
  lastLesson: string | null;
  lastAccessedAt: number | null;
  completedCount: number;
  totalLessons: number;
}

interface Props {
  enrolledCourses: EnrolledCourse[];
  activityMap: Record<string, { lessonsDone: number; quizzesDone: number }>;
  totalLessonsDone: number;
}

function computeStreak(activityMap: Record<string, { lessonsDone: number; quizzesDone: number }>) {
  const today = new Date();
  let current = 0;
  let longest = 0;
  let streak = 0;

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const entry = activityMap[key];

    if (entry && (entry.lessonsDone > 0 || entry.quizzesDone > 0)) {
      streak++;
      if (i === 0 || streak > 0) current = streak;
    } else {
      if (i === 0) current = 0;
      longest = Math.max(longest, streak);
      streak = 0;
    }
  }
  longest = Math.max(longest, streak);
  if (current === 0) {
    // Check if yesterday had activity (streak still alive)
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yKey = yesterday.toISOString().slice(0, 10);
    if (activityMap[yKey]) {
      let s = 0;
      for (let i = 1; i < 365; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        if (activityMap[key]) s++;
        else break;
      }
      current = s;
    }
  }

  return { current, longest };
}

export default function DashboardClient({ enrolledCourses, activityMap, totalLessonsDone }: Props) {
  const streakData = computeStreak(activityMap);
  const sorted = [...enrolledCourses].sort((a, b) => (b.lastAccessedAt ?? 0) - (a.lastAccessedAt ?? 0));

  return (
    <div className="min-h-screen bg-gray-50">
      <PlatformNav />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Current Streak" value={`${streakData.current} day${streakData.current !== 1 ? 's' : ''}`} icon="🔥" />
          <StatCard label="Longest Streak" value={`${streakData.longest} day${streakData.longest !== 1 ? 's' : ''}`} icon="🏆" />
          <StatCard label="Lessons Done" value={String(totalLessonsDone)} icon="📖" />
          <StatCard label="Courses Started" value={String(enrolledCourses.length)} icon="🎓" />
        </div>

        {/* Streak calendar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity</h2>
          <StreakCalendar activityMap={activityMap} />
        </div>

        {/* Enrolled courses */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {sorted.length > 0 ? 'Your Courses' : 'No courses started yet'}
        </h2>

        {sorted.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <p className="text-gray-500 mb-4">Start learning to see your progress here.</p>
            <Link
              href="/"
              className="inline-flex px-5 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {sorted.map(course => {
            const colors = getColor(course.color);
            const percent = course.totalLessons > 0
              ? Math.round((course.completedCount / course.totalLessons) * 100)
              : 0;
            const continueHref = course.lastLesson
              ? `/courses/${course.courseId}/${lessonIdToUrl(course.lastLesson)}`
              : `/courses/${course.courseId}`;

            return (
              <div key={course.courseId} className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">{course.icon}</span>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/courses/${course.courseId}`}
                      className="font-semibold text-gray-900 hover:text-gray-600 transition-colors line-clamp-1"
                    >
                      {course.title}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {course.completedCount} / {course.totalLessons} lessons
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all ${colors.bg}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">{percent}%</span>
                  <Link
                    href={continueHref}
                    className={`text-sm font-semibold px-4 py-1.5 rounded-lg text-white transition-colors ${colors.btn}`}
                  >
                    Continue
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{icon}</span>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
