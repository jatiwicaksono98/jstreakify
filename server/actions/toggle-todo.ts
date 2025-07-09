'use server';

import { db } from '@/server';
import { auth } from '@/server/auth';
import { todoEntries } from '@/server/schema';
import { getTodayDate, getOffsetDateAndTime } from '@/lib/utils';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function toggleTodoEntry(todoId: string) {
  const user = await auth();
  if (!user) throw new Error('Unauthorized');

  const today = getTodayDate();
  const now = getOffsetDateAndTime();

  const existing = await db.query.todoEntries.findFirst({
    where: and(eq(todoEntries.todoId, todoId), eq(todoEntries.date, today)),
  });

  if (existing) {
    const updated = await db
      .update(todoEntries)
      .set({
        isDone: !existing.isDone,
        completedAt: !existing.isDone ? now : null,
      })
      .where(eq(todoEntries.id, existing.id))
      .returning();

    revalidatePath('/');
    return updated[0];
  }

  // No entry yet for today → create one
  await db.insert(todoEntries).values({
    todoId,
    date: today,
    isDone: true,
    completedAt: now,
  });

  revalidatePath('/');
}
