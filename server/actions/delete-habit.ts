// server/actions/delete-habit.ts
'use server';

import { createSafeActionClient } from 'next-safe-action';
import { auth } from '../auth';
import { habits } from '../schema';
import { eq } from 'drizzle-orm';
import { db } from '..';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const action = createSafeActionClient();

export const deleteHabit = action(
  z.object({ habitId: z.string() }),
  async ({ habitId }) => {
    const user = await auth();
    if (!user) throw new Error('Unauthorized');

    await db.delete(habits).where(eq(habits.id, habitId));

    revalidatePath('/');
  }
);
