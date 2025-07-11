'use server';

import { db } from '@/server';
import { auth } from '@/server/auth';
import { todoEntries } from '@/server/schema';
import { getTodayDate, getOffsetDateAndTime } from '@/lib/utils';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { TodoStatus } from '@/types/today-todo-schema';

export async function toggleTodoEntry(todoId: string) {
  const user = await auth();
  if (!user) throw new Error('Unauthorized');

  const today = getTodayDate();
  const now = getOffsetDateAndTime();

  const existing = await db.query.todoEntries.findFirst({
    where: and(eq(todoEntries.todoId, todoId), eq(todoEntries.date, today)),
  });

  const nextStatus = (status: TodoStatus | null): TodoStatus => {
    if (status === 'not_started' || status === null) return 'in_progress';
    if (status === 'in_progress') return 'done';
    return 'not_started'; // if 'done'
  };

  const newStatus = nextStatus(existing?.status ?? null);

  if (existing) {
    const updated = await db
      .update(todoEntries)
      .set({
        status: newStatus,
        completedAt: newStatus === 'done' ? now : null,
      })
      .where(eq(todoEntries.id, existing.id))
      .returning();

    revalidatePath('/');
    return updated[0];
  }

  // No entry yet → start at in_progress
  const inserted = await db
    .insert(todoEntries)
    .values({
      todoId,
      date: today,
      status: 'in_progress',
      completedAt: null,
    })
    .returning();

  revalidatePath('/');
  return inserted[0];
}
