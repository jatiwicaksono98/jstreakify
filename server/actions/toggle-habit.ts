// server/actions/toggle-habit.ts
'use server';

import { createSafeActionClient } from 'next-safe-action';
import { eq, and } from 'drizzle-orm';
import { db } from '..';
import { auth } from '../auth';
import { getTodayDate } from '@/lib/utils';
import { formatInTimeZone } from 'date-fns-tz';
import { ToggleHabitSchema } from '@/types/toggle-habit-schema';
import { habitEntries, habits } from '../schema';

const action = createSafeActionClient();

export const toggleHabitEntry = action(
  ToggleHabitSchema,
  async ({ habitId }) => {
    const user = await auth();
    if (!user) {
      return { error: 'Unauthorized' };
    }

    const now = new Date(); // UTC
    const today = getTodayDate(); // 'YYYY-MM-DD' Jakarta-local

    const habit = await db.query.habits.findFirst({
      where: eq(habits.id, habitId),
    });

    if (!habit) {
      return { error: 'Habit not found' };
    }

    const existingEntry = await db.query.habitEntries.findFirst({
      where: and(
        eq(habitEntries.habitId, habitId),
        eq(habitEntries.date, today)
      ),
    });

    // Idempotent: already completed today
    if (existingEntry?.isDone) {
      return {
        isDone: true,
        completedAt: existingEntry.completedAt,
        currentStreak: habit.currentStreak,
      };
    }

    // Insert today's entry
    await db.insert(habitEntries).values({
      habitId,
      date: today,
      completedAt: now,
      isDone: true,
    });

    // Calculate streak
    const yesterdayStr = formatInTimeZone(
      new Date(Date.now() - 86_400_000),
      'Asia/Jakarta',
      'yyyy-MM-dd'
    );

    const isContinuing = habit.lastCompletedDate === yesterdayStr;
    const newStreak = isContinuing ? habit.currentStreak + 1 : 1;
    const newLongest = Math.max(habit.longestStreak, newStreak);

    await db
      .update(habits)
      .set({
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastCompletedDate: today,
      })
      .where(eq(habits.id, habitId));

    return {
      isDone: true,
      completedAt: now,
      currentStreak: newStreak,
    };
  }
);
