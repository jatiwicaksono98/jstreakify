'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { toggleHabitEntry } from '@/server/actions/toggle-habit';

export function HabitCard({
  id,
  name,
  isDoneToday,
  completedAt,
  currentStreak,
}: {
  id: string;
  name: string;
  isDoneToday: boolean | null;
  completedAt?: Date | null;
  currentStreak: number | null;
}) {
  const [isDone, setIsDone] = useState(isDoneToday);
  const [time, setTime] = useState(completedAt ?? null);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = await toggleHabitEntry(id);
      setIsDone(result.isDone);
      setTime(result.completedAt ?? null);
    });
  };

  const cardStyle = `
    mb-4 cursor-pointer transition-all duration-200
    ${
      isDone
        ? 'bg-green-100 hover:bg-green-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[4px] -translate-y-[4px]'
        : 'bg-white hover:bg-gray-100'
    }
  `;

  return (
    <Card onClick={handleClick} className={cardStyle}>
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <div className="font-semibold">{name}</div>
          {isDone ? (
            <div className="text-green-600 text-sm mt-1">✅ Sudah bos</div>
          ) : (
            <div className="text-muted-foreground text-sm mt-1">
              ❌ Belum bos
            </div>
          )}
        </div>
        {isDone && time && (
          <div className="text-sm text-muted-foreground">
            {time.toLocaleTimeString()}
          </div>
        )}
        <div className="text-sm">🔥 Streak: {currentStreak ?? 0}</div>
      </CardContent>
    </Card>
  );
}
