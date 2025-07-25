'use server';

import { eq, and, desc, lt } from 'drizzle-orm';
import { parseISO, isSameDay } from 'date-fns';
import { revalidatePath } from 'next/cache';
import { createId } from '@paralleldrive/cuid2';
import { formatInTimeZone } from 'date-fns-tz';

import { db } from '..';
import { auth } from '../auth';
import { habitEntries, habits } from '../schema';
import { ToggleHabitSchema } from '@/types/toggle-habit-schema';
import { createSafeActionClient } from 'next-safe-action';

const action = createSafeActionClient();

export const toggleHabitEntry = action(
  ToggleHabitSchema,
  async ({ habitId, date }) => {
    const user = await auth();
    if (!user) return { error: 'Unauthorized' };

    const now = new Date();
    const today = new Date();
    const parsedDate = parseISO(date);

    const todayStr = formatInTimeZone(today, 'Asia/Jakarta', 'yyyy-MM-dd');

    // 1. Validate ownership
    const habit = await db.query.habits.findFirst({
      where: eq(habits.id, habitId),
    });

    if (!habit || habit.userId !== user.user.id) {
      return { error: 'Habit not found or not yours' };
    }

    // 2. Check for existing entry
    const existingEntry = await db.query.habitEntries.findFirst({
      where: and(
        eq(habitEntries.habitId, habitId),
        eq(habitEntries.date, date)
      ),
    });

    let isDone: boolean;
    let completedAt: Date | undefined;

    if (existingEntry) {
      isDone = !existingEntry.isDone;
      completedAt = isDone ? now : undefined;

      await db
        .update(habitEntries)
        .set({ isDone, completedAt })
        .where(eq(habitEntries.id, existingEntry.id));
    } else {
      isDone = true;
      completedAt = now;

      await db.insert(habitEntries).values({
        id: createId(),
        habitId,
        date,
        isDone,
        completedAt,
      });
    }

    let currentStreak = habit.currentStreak ?? 0;

    // 3. Recalculate streak only if toggled for today
    if (isSameDay(parsedDate, today)) {
      currentStreak = await calculateCurrentStreakUntilToday(habitId, todayStr);
      await db
        .update(habits)
        .set({ currentStreak })
        .where(eq(habits.id, habitId));
    }

    revalidatePath('/');

    return {
      isDone,
      completedAt,
      currentStreak,
    };
  }
);

async function calculateCurrentStreakUntilToday(
  habitId: string,
  todayStr: string
): Promise<number> {
  // Fetch entries before today, ordered descending
  const entries = await db.query.habitEntries.findMany({
    where: and(
      eq(habitEntries.habitId, habitId),
      lt(habitEntries.date, todayStr)
    ),
    orderBy: [desc(habitEntries.date)],
  });

  let streak = 0;
  for (const entry of entries) {
    if (!entry.isDone) break;
    streak++;
  }

  // Include today if done
  const todayEntry = await db.query.habitEntries.findFirst({
    where: and(
      eq(habitEntries.habitId, habitId),
      eq(habitEntries.date, todayStr)
    ),
  });

  if (todayEntry?.isDone) streak++;

  return streak;
}
