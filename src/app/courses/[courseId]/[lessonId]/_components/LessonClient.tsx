'use client';

import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProgress } from '@/lib/progress-cloud';
import type { LessonMeta, LessonNavContext, QuizQuestion } from '@/lib/types';
import { getColor } from '@/lib/colors';
import { lessonIdToUrl } from '@/lib/url-helpers';
import { useSwipeNavigation } from '@/lib/use-swipe';
import Quiz from '@/components/learning/Quiz';
import LessonNav from '@/components/learning/LessonNav';
import BottomLessonNav from '@/components/learning/BottomLessonNav';
import ReadingProgress from '@/components/learning/ReadingProgress';
import Breadcrumb from '@/components/platform/Breadcrumb';
import BackToTop from '@/components/learning/BackToTop';
import Confetti from '@/components/platform/Confetti';
import XPToast from '@/components/platform/XPToast';
import LessonMeter from '@/components/platform/LessonMeter';

interface Props {
  courseId: string;
  lessonId: string;
  lessonMeta: LessonMeta;
  children: React.ReactNode;   // MDXRemote output (server-rendered)
  quiz: QuizQuestion[];
  navCtx: LessonNavContext | null;
  courseColor: string;
}

export default function LessonClient({
  courseId,
  lessonId,
  lessonMeta,
  children,
  quiz,
  navCtx,
  courseColor,
}: Props) {
  const progress = useProgress(courseId);
  const router = useRouter();
  const colors = getColor(courseColor);
  const [showConfetti, setShowConfetti] = useState(false);
  const [xpToast, setXpToast] = useState({ visible: false, amount: 0 });

  // Swipe between lessons
  const goNext = useCallback(() => {
    if (navCtx?.nextLesson) {
      router.push(`/courses/${courseId}/${lessonIdToUrl(navCtx.nextLesson.id)}`);
    }
  }, [navCtx?.nextLesson, courseId, router]);

  const goPrev = useCallback(() => {
    if (navCtx?.prevLesson) {
      router.push(`/courses/${courseId}/${lessonIdToUrl(navCtx.prevLesson.id)}`);
    }
  }, [navCtx?.prevLesson, courseId, router]);

  useSwipeNavigation(navCtx?.nextLesson ? goNext : null, navCtx?.prevLesson ? goPrev : null);

  // Track last accessed lesson — guard to avoid redundant writes
  useEffect(() => {
    if (progress.mounted && progress.lastAccessedLesson !== lessonId) {
      progress.setLastAccessed(lessonId);
    }
  }, [lessonId, progress.mounted]); // eslint-disable-line react-hooks/exhaustive-deps

  // Restore scroll position from previous visit (only if meaningfully scrolled)
  useEffect(() => {
    if (!progress.mounted) return;
    const saved = progress.getScrollPosition(lessonId);
    if (saved > 100) {
      // Defer until after paint so the full lesson content is in the DOM
      const id = requestAnimationFrame(() => {
        window.scrollTo({ top: saved, behavior: 'instant' });
      });
      return () => cancelAnimationFrame(id);
    }
  }, [progress.mounted, lessonId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Save scroll position (throttled to once per 500 ms)
  useEffect(() => {
    if (!progress.mounted) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    function onScroll() {
      if (timer) return;
      timer = setTimeout(() => {
        timer = null;
        progress.saveScrollPosition(lessonId, window.scrollY);
      }, 500);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (timer) clearTimeout(timer);
    };
  }, [progress.mounted, lessonId]); // eslint-disable-line react-hooks/exhaustive-deps

  const isCompleted = progress.mounted ? progress.isCompleted(lessonId) : false;
  const quizState = progress.mounted
    ? progress.getQuizState(lessonId)
    : { answers: {}, multiSelectAnswers: {}, matchingAnswers: {}, submitted: {} };

  function handleMarkComplete() {
    if (!progress.mounted) return;
    const result = progress.markComplete(lessonId);

    if (result.xpAwarded > 0) {
      setShowConfetti(true);
      setXpToast({ visible: true, amount: result.xpAwarded });
    }

    // Navigate after a brief delay so the user sees the celebration
    setTimeout(() => {
      if (navCtx?.nextLesson) {
        router.push(`/courses/${courseId}/${lessonIdToUrl(navCtx.nextLesson.id)}`);
      }
    }, result.xpAwarded > 0 ? 1200 : 0);
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: courseId.toUpperCase(), href: `/courses/${courseId}` },
    ...(navCtx ? [{ label: navCtx.moduleTitle, href: `/courses/${courseId}` }] : []),
    { label: lessonMeta.title },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 min-[400px]:px-5 sm:px-6 py-8 pb-20 md:pb-8">
      <LessonMeter lessonSlug={`${courseId}/${lessonId}`} />
      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
      <XPToast
        xp={xpToast.amount}
        visible={xpToast.visible}
        onDone={() => setXpToast({ visible: false, amount: 0 })}
      />
      <ReadingProgress color={colors.bg} />
      {/* Mobile: simple back link; Desktop: full breadcrumb */}
      <div className="md:hidden">
        <Link
          href={`/courses/${courseId}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to course
        </Link>
      </div>
      <div className="hidden md:block">
        <Breadcrumb crumbs={breadcrumbs} />
      </div>

      {/* Lesson metadata header */}
      <div className="mt-4 mb-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mb-2">
          {navCtx && <span>{navCtx.moduleTitle}</span>}
          {navCtx && (
            <>
              <span aria-hidden>·</span>
              <span>Lesson {navCtx.lessonIndex} of {navCtx.moduleLessonCount}</span>
            </>
          )}
          {(lessonMeta.readingMinutes || lessonMeta.duration) && (
            <>
              <span aria-hidden>·</span>
              <span>{lessonMeta.readingMinutes ? `${lessonMeta.readingMinutes} min read` : `⏱ ${lessonMeta.duration}`}</span>
            </>
          )}
          {lessonMeta.vmRef && (
            <>
              <span aria-hidden>·</span>
              <span className="italic">{lessonMeta.vmRef}</span>
            </>
          )}
          {isCompleted && (
            <>
              <span aria-hidden>·</span>
              <span className="text-green-600 font-medium">✓ Completed</span>
            </>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
          {lessonMeta.title}
        </h1>
      </div>

      {/* Lesson content — rendered by MDXRemote on the server */}
      <article className="lesson-content prose-sm sm:prose max-w-none">
        {children}
      </article>

      {/* Quiz */}
      {quiz.length > 0 && (
        <Quiz
          questions={quiz}
          lessonId={lessonId}
          quizState={quizState}
          onSaveAnswer={(qIdx, answer) =>
            progress.mounted && progress.saveAnswer(lessonId, qIdx, answer)
          }
          onSaveMultiSelectAnswer={(qIdx, selected) =>
            progress.mounted && progress.saveMultiSelectAnswer(lessonId, qIdx, selected)
          }
          onSaveMatchingAnswer={(qIdx, mapping) =>
            progress.mounted && progress.saveMatchingAnswer(lessonId, qIdx, mapping)
          }
          onSubmitAnswer={qIdx =>
            progress.mounted && progress.submitAnswer(lessonId, qIdx)
          }
          onResetQuiz={() =>
            progress.mounted && progress.resetQuiz(lessonId)
          }
        />
      )}

      {/* Mark Complete */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        {!isCompleted ? (
          <button
            onClick={handleMarkComplete}
            className={`w-full sm:w-auto px-6 py-3 font-semibold rounded-xl text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${colors.btn} focus:ring-green-500`}
          >
            {navCtx?.nextLesson ? '✓ Mark Complete & Continue' : '✓ Complete Course'}
          </button>
        ) : (
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50 border border-green-200 rounded-xl text-green-700 font-medium text-sm">
              <span aria-hidden>✓</span> Lesson completed
            </div>
            {navCtx?.nextLesson && (
              <Link
                href={`/courses/${courseId}/${lessonIdToUrl(navCtx.nextLesson.id)}`}
                className={`px-6 py-2.5 font-semibold rounded-xl text-white transition-colors ${colors.btn}`}
              >
                Next Lesson →
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Inline nav - desktop only (mobile uses BottomLessonNav) */}
      {navCtx && (
        <div className="hidden md:block">
          <LessonNav
            courseId={courseId}
            prevLesson={navCtx.prevLesson}
            nextLesson={navCtx.nextLesson}
          />
        </div>
      )}

      {navCtx && (
        <BottomLessonNav
          courseId={courseId}
          prevLesson={navCtx.prevLesson}
          nextLesson={navCtx.nextLesson}
          lessonIndex={navCtx.lessonIndex}
          moduleLessonCount={navCtx.moduleLessonCount}
        />
      )}

      <BackToTop />
    </div>
  );
}
