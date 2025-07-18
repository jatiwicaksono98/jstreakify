'use server';
import { db } from '@/server';
import { habitEntries, habits } from '@/server/schema';
import { and, desc, eq } from 'drizzle-orm';

export async function getHabitsForToday(userId: string, today: string) {
  try {
    return await db
      .select({
        id: habits.id,
        name: habits.name,
        description: habits.description,
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
      .where(eq(habits.userId, userId))
      .orderBy(desc(habits.createdAt));
  } catch (error) {
    console.error('[getHabitsForToday] Failed to fetch habits:', error);
    return [];
  }
}
