// app/page.tsx
import { HabitCard } from '@/components/habit/habit-card';
import { Button } from '@/components/ui/button';
import { getTodayDate } from '@/lib/utils';
import { auth } from '@/server/auth';
import { getHabitsForToday } from '@/server/queries/get-today-habits';
import { HabitWithEntry } from '@/types/today-habits';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await auth();
  if (!user) redirect('/auth/login');

  const today = getTodayDate();
  const habits: HabitWithEntry[] = await getHabitsForToday(user.user.id, today);
  return (
    <div>
      <Button className="mb-4" variant="elevated">
        {today}
      </Button>
      {habits.map((habit) => (
        <HabitCard key={habit.id} {...habit} />
      ))}
    </div>
  );
}
