'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { toggleHabitEntry } from '@/server/actions/toggle-habit';
import { HabitWithEntry } from '@/types/today-habits';
import { formatTimeJakarta } from '@/lib/utils';

export function HabitCard({
  id,
  name,
  isDoneToday,
  completedAt,
  currentStreak: initialStreak,
}: HabitWithEntry) {
  const [isDone, setIsDone] = useState(isDoneToday);
  const [doneTime, setDoneTime] = useState(completedAt ?? null);
  const [currentStreak, setCurrentStreak] = useState(initialStreak ?? 0);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (isPending) return;

    startTransition(async () => {
      const result = await toggleHabitEntry(id);
      setIsDone(result.isDone);
      setDoneTime(result.completedAt ?? null);
      setCurrentStreak(result.currentStreak ?? 0);
    });
  };

  const getCardStyle = () =>
    `mb-4 cursor-pointer transition-all duration-200 ${
      isDone
        ? 'bg-green-100 hover:bg-green-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[4px] -translate-y-[4px]'
        : 'bg-white hover:bg-gray-100'
    }`;

  return (
    <Card onClick={handleClick} className={getCardStyle()}>
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-sm mt-1 text-muted-foreground">
            {isDone ? '✅ Sudah bos' : '❌ Belum bos'}
          </div>
        </div>
        {isDone && doneTime && (
          <div className="text-sm text-muted-foreground">
            {formatTimeJakarta(doneTime)}
          </div>
        )}
        <div className="text-sm">🔥 Streak: {currentStreak}</div>
      </CardContent>
    </Card>
  );
}
