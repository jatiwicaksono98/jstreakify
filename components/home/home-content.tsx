'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { format, isValid, isSameDay } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
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

type HomeContentProps = {
  userId: string;
  initialDate: Date;
  initialHabits: HabitWithEntry[];
};

export function HomeContent({
  userId,
  initialDate,
  initialHabits,
}: HomeContentProps) {
  console.log('TESTING');
  console.log(initialHabits);

  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(initialDate);
  const [habits, setHabits] = useState<HabitWithEntry[]>(initialHabits);

  useEffect(() => {
    setHabits(initialHabits);
    setDate(initialDate);
  }, [initialHabits, initialDate]);
  const formattedDateText = format(date, 'EEEE, dd MMMM yyyy', {
    locale: localeID,
  });

  const formattedDateForDB = format(date, 'yyyy-MM-dd');

  const handleSelect = (newDate: Date | undefined) => {
    if (!newDate || !isValid(newDate)) return;
    if (isSameDay(newDate, date)) {
      setOpen(false); // Just close the calendar if the same date
      return;
    }
    setDate(newDate);
    setHabits([]); // optional: clears current habits to prevent flicker

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
              {formattedDateText}
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
        {habits.length > 0 ? (
          habits.map((habit) => (
            <HabitCard key={habit.id} {...habit} date={formattedDateForDB} />
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
