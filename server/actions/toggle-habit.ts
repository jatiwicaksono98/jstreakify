'use server';

import { createSafeActionClient } from 'next-safe-action';
import { eq, and } from 'drizzle-orm';
import { db } from '..';
import { auth } from '../auth';
import { ToggleHabitSchema } from '@/types/toggle-habit-schema';
import { habitEntries, habits } from '../schema';
import { parseISO } from 'date-fns';
import { createId } from '@paralleldrive/cuid2';

const action = createSafeActionClient();

export const toggleHabitEntry = action(
  ToggleHabitSchema,
  async ({ habitId, date }) => {
    const user = await auth();
    if (!user) return { error: 'Unauthorized' };

    const parsedDate = parseISO(date);
    const now = new Date();

    // ✅ Check if the habit exists and belongs to the user
    const habit = await db.query.habits.findFirst({
      where: eq(habits.id, habitId),
    });

    if (!habit || habit.userId !== user.user.id) {
      return { error: 'Habit not found or not yours' };
    }

    // ✅ Check for existing entry on that date
    const existingEntry = await db.query.habitEntries.findFirst({
      where: and(
        eq(habitEntries.habitId, habitId),
        eq(habitEntries.date, date)
      ),
    });

    // ✅ If entry exists
    if (existingEntry) {
      const isCurrentlyDone = existingEntry.isDone;

      if (isCurrentlyDone) {
        // Toggle OFF
        await db
          .update(habitEntries)
          .set({ isDone: false, completedAt: null })
          .where(eq(habitEntries.id, existingEntry.id));

        return {
          isDone: false,
          completedAt: null,
          currentStreak: 0, // 🔧 placeholder for recalculation
        };
      } else {
        // Toggle ON again
        await db
          .update(habitEntries)
          .set({ isDone: true, completedAt: now })
          .where(eq(habitEntries.id, existingEntry.id));

        return {
          isDone: true,
          completedAt: now,
          currentStreak: 1, // 🔧 placeholder
        };
      }
    }

    // ✅ Insert new entry as done
    await db.insert(habitEntries).values({
      id: createId(),
      habitId,
      date,
      completedAt: now,
      isDone: true,
    });

    return {
      isDone: true,
      completedAt: now,
      currentStreak: 1, // 🔧 placeholder
    };
  }
);
