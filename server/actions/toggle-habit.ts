'use server';

import { getTodayDate } from '@/lib/utils';
import { formatInTimeZone } from 'date-fns-tz';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '..';
import { auth } from '../auth';
import { habitEntries, habits } from '../schema';

export async function toggleHabitEntry(habitId: string) {
  const user = await auth();
  if (!user) throw new Error('Unauthorized');

  const now = new Date(); // ✅ Use UTC timestamp only
  const today = getTodayDate(); // Still safe — returns 'YYYY-MM-DD' in Jakarta zone

  const existing = await db.query.habitEntries.findFirst({
    where: and(eq(habitEntries.habitId, habitId), eq(habitEntries.date, today)),
  });

  const habit = await db.query.habits.findFirst({
    where: eq(habits.id, habitId),
  });

  if (!habit) throw new Error('Habit not found');

  if (existing) {
    const updated = await db
      .update(habitEntries)
      .set({
        isDone: !existing.isDone,
        completedAt: !existing.isDone ? now : undefined, // ✅ Save UTC
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

  // ✅ First-time toggle on
  await db.insert(habitEntries).values({
    habitId,
    date: today,
    completedAt: now, // ✅ Save UTC
    isDone: true,
  });

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatInTimeZone(
    yesterday,
    'Asia/Jakarta',
    'yyyy-MM-dd'
  );

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
