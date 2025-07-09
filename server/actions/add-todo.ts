'use server';

import { createSafeActionClient } from 'next-safe-action';
import { AddTodoSchema } from '@/types/add-todo-schema'; // or inline if preferred
import { auth } from '@/server/auth';
import { db } from '@/server';
import { todos } from '@/server/schema';
import { revalidatePath } from 'next/cache';

const action = createSafeActionClient();

export const addTodo = action(AddTodoSchema, async ({ content }) => {
  const user = await auth();
  if (!user) throw new Error('Unauthorized');

  await db.insert(todos).values({
    userId: user.user.id,
    content,
  });

  revalidatePath('/');
});
