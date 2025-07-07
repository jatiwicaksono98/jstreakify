import { HabitCard } from '@/components/habit/habit-card';
import { Button } from '@/components/ui/button';
import { db } from '@/server';
import { auth } from '@/server/auth';
import { habitEntries, habits } from '@/server/schema';
import { and, desc, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await auth();

  if (!user) {
    redirect('/auth/login');
  }

  const test = new Date();
  const offsetToday = new Date(
    test.getTime() + 7 * 60 * 60 * 1000 + 2 * 24 * 60 * 60 * 1000
  ); // Add 7 hours
  const today = offsetToday.toISOString().slice(0, 10); // 'YYYY-MM-DD'

  console.log(today);

  let data: {
    id: string;
    name: string;
    currentStreak: number;
    longestStreak: number;
    isDoneToday: boolean | null;
    completedAt: Date | null;
  }[] = [];

  try {
    data = await db
      .select({
        id: habits.id,
        name: habits.name,
        currentStreak: habits.currentStreak,
        longestStreak: habits.longestStreak,
        isDoneToday: habitEntries.isDone,
        completedAt: habitEntries.completedAt,
      })
      .from(habits)
      .leftJoin(
        habitEntries,
        and(eq(habitEntries.habitId, habits.id), eq(habitEntries.date, today))
      )
      .where(eq(habits.userId, user.user.id))
      .orderBy(desc(habits.createdAt));
  } catch (error) {
    console.error('[Dashboard] Failed to fetch habits:', error);
    // Optional: use a logging service like Sentry here
    // captureException(error);
  }

  return (
    <div>
      <Button className="mb-4" variant="elevated">
        {today.toString()}
      </Button>
      {data.map((habit) => (
        <HabitCard
          key={habit.id}
          id={habit.id}
          name={habit.name}
          isDoneToday={habit.isDoneToday}
          completedAt={habit.completedAt}
          currentStreak={habit.currentStreak}
        />
      ))}
    </div>
  );
}
