'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { toggleHabitEntry } from '@/server/actions/toggle-habit';
import { HabitWithEntry } from '@/types/today-habits';
import { formatTimeJakarta } from '@/lib/utils';
import { Check, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAction } from 'next-safe-action/hooks';

export function HabitCard({
  id,
  name,
  description,
  isDoneToday,
  completedAt,
  currentStreak: initialStreak,
}: HabitWithEntry) {
  const [isDone, setIsDone] = useState(isDoneToday);
  const [doneTime, setDoneTime] = useState<Date | null>(completedAt ?? null);
  const [currentStreak, setCurrentStreak] = useState(initialStreak ?? 0);

  const { execute, status } = useAction(toggleHabitEntry, {
    onSuccess: (result) => {
      if (!result || 'error' in result) {
        toast.error(result?.error || 'Terjadi kesalahan 😢');
        rollbackState();
        return;
      }

      setDoneTime(result.completedAt ?? new Date());
      setCurrentStreak(result.currentStreak ?? currentStreak);
      toast.success('Kebiasaan berhasil diselesaikan! 🎉');
    },
    onError: () => {
      rollbackState();
      toast.error('Gagal menyimpan kebiasaan. Coba lagi ya 🙏');
    },
  });

  // ⬅️ rollback helper
  const rollbackState = () => {
    setIsDone(isDoneToday);
    setDoneTime(completedAt ?? null);
    setCurrentStreak(initialStreak ?? 0);
  };

  const handleClick = () => {
    if (status === 'executing' || isDone) return;

    const optimisticTime = new Date();

    // ✅ Optimistic UI update
    setIsDone(true);
    setDoneTime(optimisticTime);
    setCurrentStreak((prev) => prev + 1);

    execute({ habitId: id });
  };

  return (
    <Card
      onClick={!isDone ? handleClick : undefined}
      className={cn(
        'mb-4 transition-all duration-200 select-none border-black',
        'active:scale-[0.98]',
        isDone ? 'cursor-default' : 'cursor-pointer',
        isDone ? 'bg-emerald-100' : 'bg-rose-100 hover:bg-rose-200',
        isDone &&
          'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[4px] -translate-y-[4px] hover:bg-emerald-200',
        status === 'executing' && 'opacity-50 pointer-events-none cursor-wait'
      )}
    >
      <CardContent className="p-4 flex justify-between items-center gap-4">
        {/* Left: Habit Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-base">{name}</p>
            {isDone && doneTime ? (
              <div className="flex items-center gap-1 text-emerald-700">
                <Check className="w-4 h-4 stroke-[3]" />
                <span className="text-sm font-medium">
                  {formatTimeJakarta(doneTime)}
                </span>
              </div>
            ) : (
              <X className="w-4 h-4 stroke-[3] text-rose-600" />
            )}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {/* Center: Loader */}
        <div className="w-5 h-5 flex items-center justify-center">
          {status === 'executing' && (
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          )}
        </div>

        {/* Right: Streak */}
        <div className="text-right whitespace-nowrap text-sm font-medium">
          🔥 Streak: <span className="text-amber-600">{currentStreak}</span>
        </div>
      </CardContent>
    </Card>
  );
}
