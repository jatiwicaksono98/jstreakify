import { db } from '@/server';
import { todos, todoEntries } from '@/server/schema';
import { and, eq } from 'drizzle-orm';

export async function getTodosWithTodayStatus(userId: string, today: string) {
  return await db
    .select({
      id: todos.id,
      content: todos.content,
      isDone: todoEntries.isDone,
      completedAt: todoEntries.completedAt,
    })
    .from(todos)
    .leftJoin(
      todoEntries,
      and(eq(todoEntries.todoId, todos.id), eq(todoEntries.date, today))
    )
    .where(eq(todos.userId, userId));
}
