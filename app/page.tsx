import { HabitCard } from '@/components/habit/habit-card';
import { TodoCard } from '@/components/todo/todo-card';
import { TodoDrawer } from '@/components/todo/todo-drawer';
import { Button } from '@/components/ui/button';
import { getTodayDate } from '@/lib/utils';
import { auth } from '@/server/auth';
import { getHabitsForToday } from '@/server/queries/get-today-habits';
import { getTodosWithTodayStatus } from '@/server/queries/get-today-todos';
import { HabitWithEntry } from '@/types/today-habits';
import { TodoWithEntry } from '@/types/today-todo-schema';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await auth();
  if (!user) redirect('/auth/login');

  const today = getTodayDate();
  const habits: HabitWithEntry[] = await getHabitsForToday(user.user.id, today);
  const todos: TodoWithEntry[] = await getTodosWithTodayStatus(
    user.user.id,
    today
  );

  // Define sort order
  const statusOrder = {
    not_started: 0,
    in_progress: 1,
    done: 2,
  };

  // Default to 'not_started' if status is null
  const sortedTodos = [...todos].sort((a, b) => {
    const statusOrder = {
      not_started: 0,
      in_progress: 1,
      done: 2,
    };

    const aOrder = statusOrder[a.status ?? 'not_started'];
    const bOrder = statusOrder[b.status ?? 'not_started'];

    if (aOrder !== bOrder) return aOrder - bOrder;

    // If both are 'done', sort by completedAt DESC
    if (a.status === 'done' && b.status === 'done') {
      const aTime = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      const bTime = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      return bTime - aTime;
    }

    // Keep default for same status
    return 0;
  });
  return (
    <div>
      <Button variant="elevated">{today}</Button>

      <h1 className="text-2xl font-bold py-4">Habits</h1>
      {habits.map((habit) => (
        <HabitCard key={habit.id} {...habit} />
      ))}

      <h1 className="text-2xl font-bold py-4">To Do</h1>
      <TodoDrawer />
      <div className="py-4">
        {sortedTodos.map((todo) => (
          <TodoCard key={todo.id} {...todo} />
        ))}
      </div>
    </div>
  );
}
