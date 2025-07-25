'use server';

import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';
import { db } from '..';
import { auth } from '../auth';
import { habits } from '../schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

const action = createSafeActionClient();

const updateHabitSchema = z.object({
  habitId: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
});

export const updateHabit = action(updateHabitSchema, async (data) => {
  const user = await auth();
  if (!user) throw new Error('Unauthorized');

  await db
    .update(habits)
    .set({ name: data.name, description: data.description })
    .where(eq(habits.id, data.habitId));

  revalidatePath('/');

  return { success: true };
});
