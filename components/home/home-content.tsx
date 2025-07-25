'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { format, isValid, isSameDay } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';

import { CreateHabitDrawer } from '@/components/habit/create-habit-drawer';
import { HabitCard } from '@/components/habit/habit-card';
import { HabitWithEntry } from '@/types/today-habits';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { EditHabitDrawer } from '../habit/edit-habit-drawer';
import { deleteHabit } from '@/server/actions/delete-habit';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '../ui/alert-dialog';

type HomeContentProps = {
  userId: string;
  initialDate: Date;
  initialHabits: HabitWithEntry[];
};

export function HomeContent({ initialDate, initialHabits }: HomeContentProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const date = initialDate;
  const formattedDateForDB = format(date, 'yyyy-MM-dd');

  const { execute: deleteHabitAction, deleteStatus } = useAction(deleteHabit, {
    onSuccess: () => {
      toast.success('Habit berhasil dihapus');
      router.refresh(); // to re-fetch habits
    },
    onError: () => {
      toast.error('Gagal menghapus habit');
    },
  });

  const handleSelect = (newDate: Date | undefined) => {
    if (!newDate || !isValid(newDate)) return;
    if (isSameDay(newDate, date)) {
      setOpen(false); // Just close the calendar if the same date
      return;
    }

    const formatted = format(newDate, 'yyyy-MM-dd');
    setOpen(false); // Close popover right away

    router.push(`/?date=${formatted}`);
    router.refresh();
    // router.refresh(); // Force re-render with fresh server data
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="w-64 justify-between font-normal"
            >
              {formattedDateForDB}
              <ChevronDownIcon className="ml-2 size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={handleSelect}
            />
          </PopoverContent>
        </Popover>
      </div>

      <h1 className="text-2xl font-bold">Habits</h1>
      <CreateHabitDrawer />

      <div className="space-y-2">
        {initialHabits.length > 0 ? (
          initialHabits.map((habit) => (
            <div
              key={habit.id}
              className="flex justify-between items-start gap-2 sm:gap-4"
            >
              <div className="flex-1">
                <HabitCard {...habit} date={formattedDateForDB} />
              </div>
              <div className="pt-2 pr-2 flex flex-col gap-1">
                <EditHabitDrawer
                  habitId={habit.id}
                  initialName={habit.name}
                  initialDescription={habit.description ?? ''}
                />

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="text-xs">
                      Hapus
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus Habit?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Ini akan menghapus habit <strong>{habit.name}</strong>{' '}
                        secara permanen.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteHabitAction({ habitId: habit.id })}
                        disabled={status === 'executing'}
                      >
                        {status === 'executing' ? 'Menghapus...' : 'Hapus'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-sm">
            Tidak ada kebiasaan untuk tanggal ini.
          </p>
        )}
      </div>
    </div>
  );
}
