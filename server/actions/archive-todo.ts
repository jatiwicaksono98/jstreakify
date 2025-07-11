'use server';

import { db } from '@/server';
import { auth } from '@/server/auth';
import { todos } from '@/server/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function archiveTodo(todoId: string) {
  const user = await auth();
  if (!user) throw new Error('Unauthorized');

  await db.update(todos).set({ isArchived: true }).where(eq(todos.id, todoId));
  revalidatePath('/');
}
