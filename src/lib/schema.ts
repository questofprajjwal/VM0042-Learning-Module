import { sqliteTable, text, integer, primaryKey, index } from 'drizzle-orm/sqlite-core';

export const enrollments = sqliteTable(
  'enrollments',
  {
    userId: text('user_id').notNull(),
    courseId: text('course_id').notNull(),
    startedAt: integer('started_at', { mode: 'timestamp' }).notNull(),
    lastLesson: text('last_lesson'),
    lastAccessedAt: integer('last_accessed_at', { mode: 'timestamp' }),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.courseId] }),
    index('enrollments_user_idx').on(t.userId),
  ],
);

export const lessonCompletions = sqliteTable(
  'lesson_completions',
  {
    userId: text('user_id').notNull(),
    courseId: text('course_id').notNull(),
    lessonId: text('lesson_id').notNull(),
    completedAt: integer('completed_at', { mode: 'timestamp' }).notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.courseId, t.lessonId] }),
    index('completions_user_idx').on(t.userId),
  ],
);

export const quizAttempts = sqliteTable(
  'quiz_attempts',
  {
    userId: text('user_id').notNull(),
    courseId: text('course_id').notNull(),
    lessonId: text('lesson_id').notNull(),
    questionIdx: integer('question_idx').notNull(),
    selected: integer('selected'),
    multiSelected: text('multi_selected'),
    matching: text('matching'),
    submitted: integer('submitted', { mode: 'boolean' }).notNull().default(false),
    answeredAt: integer('answered_at', { mode: 'timestamp' }),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.courseId, t.lessonId, t.questionIdx] }),
    index('quiz_user_idx').on(t.userId),
  ],
);

export const dailyActivity = sqliteTable(
  'daily_activity',
  {
    userId: text('user_id').notNull(),
    activityDate: text('activity_date').notNull(),
    lessonsDone: integer('lessons_done').notNull().default(0),
    quizzesDone: integer('quizzes_done').notNull().default(0),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.activityDate] }),
    index('activity_user_idx').on(t.userId),
  ],
);
