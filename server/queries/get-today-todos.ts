import { and, eq } from 'drizzle-orm';
import { db } from '..';
import { todos, todoEntries } from '../schema';

export async function getTodosWithTodayStatus(userId: string, date: string) {
  const result = await db
    .select({
      id: todos.id,
      content: todos.content,
      createdAt: todos.createdAt,
      completedAt: todoEntries.completedAt,
      status: todoEntries.status,
    })
    .from(todos)
    .leftJoin(
      todoEntries,
      and(eq(todos.id, todoEntries.todoId), eq(todoEntries.date, date))
    )
    .where(and(eq(todos.userId, userId), eq(todos.isArchived, false)));

  // Sort by status
  const statusOrder = {
    not_started: 0,
    in_progress: 1,
    done: 2,
  };

  return result.sort((a, b) => {
    const aOrder = statusOrder[a.status ?? 'not_started'];
    const bOrder = statusOrder[b.status ?? 'not_started'];
    return aOrder - bOrder;
  });
}
