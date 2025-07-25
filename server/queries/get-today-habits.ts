'use server';

import { habits, habitEntries } from '@/server/schema';
import { and, asc, eq } from 'drizzle-orm';
import { HabitWithEntry } from '@/types/today-habits';
import { db } from '..';
import { revalidatePath } from 'next/cache';

export async function getHabitsForDate(
  userId: string,
  date: string
): Promise<HabitWithEntry[]> {
  const results = await db
    .select()
    .from(habits)
    .leftJoin(
      habitEntries,
      and(eq(habits.id, habitEntries.habitId), eq(habitEntries.date, date))
    )
    .where(and(eq(habits.userId, userId), eq(habits.isArchived, false)))
    .orderBy(asc(habits.createdAt));

  const formattedResults: HabitWithEntry[] = results.map((habit) => ({
    id: habit.habits.id,
    name: habit.habits.name,
    description: habit.habits.description,
    createdAt: habit.habits.createdAt,
    isArchived: habit.habits.isArchived,
    isDone: habit.habit_entries?.isDone ?? false,
    completedAt: habit.habit_entries?.completedAt ?? null,
    currentStreak: habit.habits.currentStreak, // Placeholder, calculate if needed
  }));

  revalidatePath('/');

  return formattedResults;
}
