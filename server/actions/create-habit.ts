'use server';

import { createSafeActionClient } from 'next-safe-action';
import { habits } from '@/server/schema';
import { auth } from '@/server/auth';
import { createHabitSchema } from '@/types/create-habit-schema';
import { revalidatePath } from 'next/cache';
import { db } from '..';

const action = createSafeActionClient();

export const createHabit = action(createHabitSchema, async (data) => {
  const user = await auth();
  if (!user) throw new Error('Unauthorized');

  await db.insert(habits).values({
    userId: user.user.id,
    name: data.name,
    description: data.description,
  });

  revalidatePath('/');
});
