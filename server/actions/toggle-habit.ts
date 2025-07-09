'use server';

import { db } from '@/server';
import { habitEntries, habits } from '@/server/schema';
import { auth } from '@/server/auth';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getOffsetDateAndTime, getTodayDate } from '@/lib/utils';

export async function toggleHabitEntry(habitId: string) {
  const user = await auth();
  if (!user) throw new Error('Unauthorized');

  const now = getOffsetDateAndTime(); // timestamp with UTC+7
  const today = getTodayDate(); // 'YYYY-MM-DD'

  const existing = await db.query.habitEntries.findFirst({
    where: and(eq(habitEntries.habitId, habitId), eq(habitEntries.date, today)),
  });

  const habit = await db.query.habits.findFirst({
    where: eq(habits.id, habitId),
  });

  if (!habit) throw new Error('Habit not found');

  if (existing) {
    // ✅ TOGGLE OFF
    const updated = await db
      .update(habitEntries)
      .set({
        isDone: !existing.isDone,
        completedAt: !existing.isDone ? now : undefined,
      })
      .where(eq(habitEntries.id, existing.id))
      .returning();

    if (!updated[0].isDone) {
      await db
        .update(habits)
        .set({
          currentStreak: 0,
          lastCompletedDate: null,
        })
        .where(eq(habits.id, habitId));
    }

    revalidatePath('/');
    return {
      isDone: updated[0].isDone,
      completedAt: updated[0].completedAt,
    };
  }

  // ✅ TOGGLE ON
  await db.insert(habitEntries).values({
    habitId,
    date: today,
    completedAt: now,
    isDone: true,
  });

  // Streak logic
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  const continueStreak = habit.lastCompletedDate === yesterdayStr;
  const newStreak = continueStreak ? habit.currentStreak + 1 : 1;
  const newLongest = Math.max(habit.longestStreak, newStreak);

  await db
    .update(habits)
    .set({
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastCompletedDate: today,
    })
    .where(eq(habits.id, habitId));

  revalidatePath('/');

  return {
    isDone: true,
    completedAt: now,
    currentStreak: newStreak,
  };
}
