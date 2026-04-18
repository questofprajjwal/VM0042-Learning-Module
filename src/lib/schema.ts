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

// Feedback submissions — bugs, feature requests, content feedback,
// general questions. Services enquiries live in a separate table
// because they are sales leads with different fields and workflow.
export const feedbackSubmissions = sqliteTable(
  'feedback_submissions',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    type: text('type').notNull(), // 'bug' | 'feature' | 'content' | 'other' | 'services'
    userId: text('user_id'),
    email: text('email').notNull(),
    message: text('message').notNull(),
    metadata: text('metadata'), // jsonb string, optional
    pageUrl: text('page_url'),
    userAgent: text('user_agent'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    handledAt: integer('handled_at', { mode: 'timestamp' }),
  },
  (t) => [
    index('feedback_created_idx').on(t.createdAt),
    index('feedback_type_idx').on(t.type),
  ],
);

// Services enquiries — sales leads for premium custom engagements
// (Climate Risk Assessment, Double Materiality, etc.). Separate from
// feedback because the fields, workflow, and response tone differ.
export const serviceEnquiries = sqliteTable(
  'service_enquiries',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    email: text('email').notNull(),
    company: text('company').notNull(),
    role: text('role'),
    // Engagement id from the Services page (e.g., 'climate-risk',
    // 'double-materiality'). 'unsure' is allowed when the prospect
    // does not yet know which engagement fits.
    engagement: text('engagement').notNull(),
    timeline: text('timeline').notNull(), // 'immediate' | '1-3m' | '3-6m' | '6m+' | 'flexible'
    budget: text('budget'), // 'lt-5k' | '5-15k' | '15-50k' | '50k+' | 'unsure'
    message: text('message').notNull(),
    userId: text('user_id'),
    pageUrl: text('page_url'),
    userAgent: text('user_agent'),
    status: text('status').notNull().default('new'), // 'new' | 'contacted' | 'qualified' | 'closed'
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    handledAt: integer('handled_at', { mode: 'timestamp' }),
  },
  (t) => [
    index('enquiry_created_idx').on(t.createdAt),
    index('enquiry_status_idx').on(t.status),
    index('enquiry_engagement_idx').on(t.engagement),
  ],
);

// ─── Emission Factors product ─────────────────────────────────────────────────
// Factor content itself lives as YAML in src/content/emission-factors/.
// Turso holds only dynamic signed-in and public-submission state.

export const efIssueReports = sqliteTable(
  'ef_issue_reports',
  {
    id: text('id').primaryKey(),
    factorId: text('factor_id').notNull(),
    submittedAt: integer('submitted_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    reporterEmail: text('reporter_email'),
    description: text('description').notNull(),
    status: text('status').notNull().default('open'), // 'open' | 'triaged' | 'resolved' | 'wontfix'
    editorNote: text('editor_note'),
    resolvedAt: integer('resolved_at', { mode: 'timestamp' }),
  },
  (t) => [
    index('ef_issues_factor_idx').on(t.factorId),
    index('ef_issues_status_idx').on(t.status),
  ],
);

export const efSavedFactors = sqliteTable(
  'ef_saved_factors',
  {
    userId: text('user_id').notNull(),
    factorId: text('factor_id').notNull(),
    savedAt: integer('saved_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    folder: text('folder'),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.factorId] }),
    index('ef_saved_user_idx').on(t.userId),
  ],
);

export const efCiteLists = sqliteTable(
  'ef_cite_lists',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    name: text('name').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [index('ef_cite_lists_user_idx').on(t.userId)],
);

export const efCiteListItems = sqliteTable(
  'ef_cite_list_items',
  {
    citeListId: text('cite_list_id').notNull(),
    factorId: text('factor_id').notNull(),
    addedAt: integer('added_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    note: text('note'),
  },
  (t) => [
    primaryKey({ columns: [t.citeListId, t.factorId] }),
    index('ef_cite_list_items_list_idx').on(t.citeListId),
  ],
);

export const efSearchHistory = sqliteTable(
  'ef_search_history',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    query: text('query').notNull(),
    searchedAt: integer('searched_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [index('ef_search_user_idx').on(t.userId)],
);

/**
 * SustainIQ query log. One row per successfully streamed answer.
 *
 * Dual purpose:
 *   1. User-visible history — replaces / mirrors the localStorage store at
 *      src/app/ask/_lib/history.ts so chat history is cross-device and
 *      survives cache clears.
 *   2. Admin observability — question trends, answer quality, latency,
 *      token consumption, thumbs feedback. Feeds a future analytics page.
 *
 * Populated by the client: POST /api/ask/log after the stream closes. The
 * Vercel stream route is a pure passthrough to the HF ask-server and
 * cannot see the final text, so the browser (which assembled the full
 * answer) is the only place with the complete record.
 */
export const sustainiqQueries = sqliteTable(
  'sustainiq_queries',
  {
    // Client-generated UUID — same id as the HistoryEntry.id in
    // localStorage, so the two stores stay in lockstep.
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    query: text('query').notNull(),
    answer: text('answer').notNull(),
    // JSON-stringified arrays of {document, section, pages, course} and
    // {courseId, courseTitle, lessonId, lessonTitle, url}.
    sources: text('sources'),
    lessons: text('lessons'),
    // Generation metadata.
    model: text('model'),
    reviseCount: integer('revise_count').default(0),
    latencyMs: integer('latency_ms'),
    tokensIn: integer('tokens_in'),
    tokensOut: integer('tokens_out'),
    // Cap / tier snapshot at query time.
    tier: text('tier'),
    // 'success' | 'error' | 'aborted' (client stopped the stream early).
    status: text('status').notNull().default('success'),
    errorMessage: text('error_message'),
    // 'up' | 'down' | null. Mutable after insert via PATCH.
    feedback: text('feedback'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [
    index('sustainiq_user_idx').on(t.userId, t.createdAt),
    index('sustainiq_created_idx').on(t.createdAt),
  ],
);

export const userResumes = sqliteTable(
  'user_resumes',
  {
    userId: text('user_id').primaryKey(),
    fileName: text('file_name').notNull(),
    mimeType: text('mime_type').notNull(),
    // Key of the object in the private greentryst-resumes R2 bucket.
    // The raw PDF/DOCX is stored there permanently (until the user deletes
    // their resume) so we can re-parse, let the user re-download, or
    // diagnose failures without re-upload.
    fileR2Key: text('file_r2_key').notNull(),
    // 'uploading' | 'parsing' | 'ready' | 'error'
    status: text('status').notNull().default('uploading'),
    extractedText: text('extracted_text'),
    embedding: text('embedding'), // JSON stringified Float32Array
    profile: text('profile'), // JSON: {skills, frameworks, seniority, domains}
    error: text('error'), // For storing failure reasons
    uploadedAt: integer('uploaded_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    processedAt: integer('processed_at', { mode: 'timestamp' }),
  },
  (t) => [index('resumes_uploaded_idx').on(t.uploadedAt)],
);
