'use client';

import { useMemo, useState } from 'react';

interface Props {
  activityMap: Record<string, { lessonsDone: number; quizzesDone: number }>;
}

const DAYS = ['Mon', '', 'Wed', '', 'Fri', '', ''];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getIntensity(lessonsDone: number, quizzesDone: number): number {
  const total = lessonsDone + quizzesDone;
  if (total === 0) return 0;
  if (total === 1) return 1;
  if (total <= 3) return 2;
  return 3;
}

const COLORS = [
  'bg-gray-100',
  'bg-green-200',
  'bg-green-400',
  'bg-green-600',
];

export default function StreakCalendar({ activityMap }: Props) {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date();
    const weeks: Array<Array<{ date: string; intensity: number; lessonsDone: number; quizzesDone: number } | null>> = [];
    const monthLabels: Array<{ label: string; weekIdx: number }> = [];

    // Build 53 weeks (371 days) ending today
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 371 + (7 - today.getDay()));

    let lastMonth = -1;

    for (let w = 0; w < 53; w++) {
      const week: typeof weeks[0] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + w * 7 + d);

        if (date > today) {
          week.push(null);
          continue;
        }

        const key = date.toISOString().slice(0, 10);
        const entry = activityMap[key];
        const lessonsDone = entry?.lessonsDone ?? 0;
        const quizzesDone = entry?.quizzesDone ?? 0;

        if (date.getMonth() !== lastMonth && d === 0) {
          monthLabels.push({ label: MONTHS[date.getMonth()], weekIdx: w });
          lastMonth = date.getMonth();
        }

        week.push({
          date: key,
          intensity: getIntensity(lessonsDone, quizzesDone),
          lessonsDone,
          quizzesDone,
        });
      }
      weeks.push(week);
    }

    return { weeks, monthLabels };
  }, [activityMap]);

  return (
    <div className="relative overflow-x-auto">
      {/* Month labels */}
      <div className="flex text-xs text-gray-400 mb-1 ml-8">
        {monthLabels.map((m, i) => (
          <span
            key={i}
            className="absolute"
            style={{ left: `${m.weekIdx * 14 + 32}px` }}
          >
            {m.label}
          </span>
        ))}
      </div>

      <div className="flex gap-0.5 mt-5">
        {/* Day labels */}
        <div className="flex flex-col gap-0.5 mr-1 text-xs text-gray-400 shrink-0">
          {DAYS.map((day, i) => (
            <div key={i} className="h-[11px] flex items-center justify-end pr-1 w-6">
              {day}
            </div>
          ))}
        </div>

        {/* Grid */}
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-0.5">
            {week.map((day, di) => (
              <div
                key={di}
                className={`w-[11px] h-[11px] rounded-sm ${day ? COLORS[day.intensity] : 'bg-transparent'} ${day ? 'cursor-pointer' : ''}`}
                onMouseEnter={(e) => {
                  if (!day) return;
                  const total = day.lessonsDone + day.quizzesDone;
                  const text = total === 0
                    ? `No activity on ${day.date}`
                    : `${day.lessonsDone} lesson${day.lessonsDone !== 1 ? 's' : ''}, ${day.quizzesDone} quiz${day.quizzesDone !== 1 ? 'zes' : ''} on ${day.date}`;
                  const rect = e.currentTarget.getBoundingClientRect();
                  setTooltip({ text, x: rect.left + rect.width / 2, y: rect.top - 8 });
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-400 justify-end">
        <span>Less</span>
        {COLORS.map((c, i) => (
          <div key={i} className={`w-[11px] h-[11px] rounded-sm ${c}`} />
        ))}
        <span>More</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg shadow-lg pointer-events-none whitespace-nowrap -translate-x-1/2 -translate-y-full"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
