import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { enrollments, lessonCompletions, dailyActivity } from '@/lib/schema';
import { eq, and, gte, sql } from 'drizzle-orm';
import { getAllCourses } from '@/lib/courses';
import DashboardClient from './_components/DashboardClient';

export const metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const dateStr = oneYearAgo.toISOString().slice(0, 10);

  const [enrolled, activity, allCourses] = await Promise.all([
    db
      .select({
        courseId: enrollments.courseId,
        startedAt: enrollments.startedAt,
        lastLesson: enrollments.lastLesson,
        lastAccessedAt: enrollments.lastAccessedAt,
        completedCount: sql<number>`(
          SELECT COUNT(*) FROM lesson_completions
          WHERE user_id = ${userId}
          AND course_id = ${enrollments.courseId}
        )`,
      })
      .from(enrollments)
      .where(eq(enrollments.userId, userId)),
    db
      .select()
      .from(dailyActivity)
      .where(and(eq(dailyActivity.userId, userId), gte(dailyActivity.activityDate, dateStr))),
    getAllCourses(),
  ]);

  const courseMap = Object.fromEntries(allCourses.map(c => [c.id, c]));

  const enrolledCourses = enrolled.map(e => {
    const course = courseMap[e.courseId];
    const totalLessons = course?.modules.reduce((sum, m) => sum + m.lessons.length, 0) ?? 0;
    return {
      courseId: e.courseId,
      title: course?.title ?? e.courseId,
      icon: course?.icon ?? '',
      color: course?.color ?? 'green',
      lastLesson: e.lastLesson,
      lastAccessedAt: e.lastAccessedAt ? new Date(e.lastAccessedAt).getTime() : null,
      completedCount: e.completedCount,
      totalLessons,
    };
  });

  const activityMap: Record<string, { lessonsDone: number; quizzesDone: number }> = {};
  for (const row of activity) {
    activityMap[row.activityDate] = {
      lessonsDone: row.lessonsDone,
      quizzesDone: row.quizzesDone,
    };
  }

  const totalLessonsDone = enrolled.reduce((sum, e) => sum + e.completedCount, 0);

  return (
    <DashboardClient
      enrolledCourses={enrolledCourses}
      activityMap={activityMap}
      totalLessonsDone={totalLessonsDone}
    />
  );
}
