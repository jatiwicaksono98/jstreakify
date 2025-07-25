'use client';

import { Card, CardContent } from '@/components/ui/card';
import { toggleHabitEntry } from '@/server/actions/toggle-habit';
import { HabitWithEntry } from '@/types/today-habits';
import { formatTimeJakarta } from '@/lib/utils';
import { Check, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';

type HabitCardProps = HabitWithEntry & {
  date: string;
};

export function HabitCard({
  id,
  name,
  description,
  isDone,
  completedAt,
  currentStreak,
  date,
}: HabitCardProps) {
  const router = useRouter();

  const { execute, status } = useAction(toggleHabitEntry, {
    onSuccess: (result) => {
      if (!result || 'error' in result) {
        toast.error(result?.error || 'Terjadi kesalahan 😢');
        return;
      }

      toast.success(
        result.isDone
          ? 'Kebiasaan berhasil diselesaikan! 🎉'
          : 'Kebiasaan dibatalkan ❌'
      );

      router.refresh(); // Fetch updated server state
    },
    onError: () => {
      toast.error('Gagal menyimpan kebiasaan. Coba lagi ya 🙏');
    },
  });

  const handleClick = () => {
    if (status === 'executing') return;
    execute({ habitId: id, date });
  };

  const isHabitDone = isDone ?? false;
  const doneTime = completedAt ?? null;

  return (
    <Card
      onClick={handleClick}
      className={cn(
        'mb-4 transition-all duration-200 select-none border-black',
        'active:scale-[0.98]',
        isHabitDone ? 'cursor-default' : 'cursor-pointer',
        isHabitDone ? 'bg-emerald-100' : 'bg-rose-100 hover:bg-rose-200',
        isHabitDone &&
          'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[4px] -translate-y-[4px] hover:bg-emerald-200',
        status === 'executing' && 'opacity-50 pointer-events-none cursor-wait'
      )}
    >
      <CardContent className="p-4 flex justify-between items-center gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-base">{name}</p>
            {isHabitDone && doneTime ? (
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

        {/* Right: Streak + Edit Button */}
        <div className="text-sm font-medium flex items-center">
          <span>
            🔥 Streak: <span className="text-amber-600">{currentStreak}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
