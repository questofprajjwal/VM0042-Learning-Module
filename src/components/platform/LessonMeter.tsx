'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';

const COOKIE_NAME = 'sa_lessons_read';
const FREE_LIMIT = 3;

function getLessonsRead(): string[] {
  try {
    const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
    if (!match) return [];
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return [];
  }
}

function setLessonsRead(slugs: string[]) {
  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const value = encodeURIComponent(JSON.stringify(slugs));
  document.cookie = `${COOKIE_NAME}=${value}; path=/; expires=${endOfMonth.toUTCString()}; SameSite=Lax`;
}

interface Props {
  lessonSlug: string;
}

export default function LessonMeter({ lessonSlug }: Props) {
  const { isSignedIn, isLoaded } = useAuth();
  const [gated, setGated] = useState(false);

  useEffect(() => {
    if (!isLoaded || isSignedIn) return;

    const read = getLessonsRead();
    if (!read.includes(lessonSlug)) {
      const updated = [...read, lessonSlug];
      setLessonsRead(updated);
      if (updated.length > FREE_LIMIT) {
        setGated(true);
      }
    } else if (read.length > FREE_LIMIT) {
      setGated(true);
    }
  }, [isLoaded, isSignedIn, lessonSlug]);

  if (!gated) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Gradient overlay that dims content below the fold */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white" />

      {/* CTA card */}
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-gray-200 p-6 sm:p-8 max-w-md w-full mx-4 mb-0 sm:mb-0 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          You&apos;ve read your {FREE_LIMIT} free lessons this month
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          Sign up for free to continue learning with unlimited access, progress tracking, quizzes, and streaks.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/sign-up"
            className="flex-1 px-5 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors text-center"
          >
            Sign up free
          </Link>
          <Link
            href="/sign-in"
            className="flex-1 px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors text-center"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
