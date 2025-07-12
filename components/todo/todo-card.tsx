'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toggleTodoEntry } from '@/server/actions/toggle-todo';
import { TodoWithEntry, TodoStatus } from '@/types/today-todo-schema';
import { Loader2, Archive } from 'lucide-react';
import { archiveTodo } from '@/server/actions/archive-todo';
import { getAgeFromNow, formatFullDateTimeIndo } from '@/lib/utils';

export function TodoCard({
  id,
  content,
  status: initialStatus,
  completedAt,
  createdAt,
}: TodoWithEntry) {
  const [status, setStatus] = useState<TodoStatus | null>(initialStatus);
  const [isPending, startTransition] = useTransition();
  const [isArchiving, startArchiveTransition] = useTransition();

  const handleToggle = () => {
    if (isPending || isArchiving) return;
    startTransition(async () => {
      const res = await toggleTodoEntry(id);
      setStatus(res.status);
    });
  };

  const handleArchive = () => {
    if (isPending || isArchiving) return;
    startArchiveTransition(async () => {
      await archiveTodo(id);
    });
  };

  const getCardStyle = () => {
    const base =
      'mb-4 transition-all duration-200 p-0 ' +
      (isPending || isArchiving
        ? 'pointer-events-none opacity-50 cursor-wait'
        : 'cursor-pointer');

    if (status === 'done') {
      return (
        base +
        ' bg-green-100 hover:bg-green-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[4px] -translate-y-[4px]'
      );
    }

    if (status === 'in_progress') {
      return base + ' bg-yellow-100 hover:bg-yellow-200';
    }

    return base + ' bg-white hover:bg-gray-100';
  };

  const isDone = status === 'done';
  const ageText = getAgeFromNow(new Date(createdAt));
  const completedTimeText =
    isDone && completedAt
      ? `, Completed at ${formatFullDateTimeIndo(new Date(completedAt))}`
      : '';
  return (
    <Card onClick={handleToggle} className={getCardStyle()}>
      <CardContent className="p-4 flex justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <Checkbox checked={isDone} onCheckedChange={handleToggle} disabled />
          <div className={`font-medium `}>
            <span
              className={` ${
                isDone ? 'line-through text-muted-foreground' : ''
              }`}
            >
              {content}
            </span>

            <span className="text-sm text-muted-foreground">
              &nbsp;&nbsp;({ageText}
              {completedTimeText})
            </span>
          </div>
        </div>

        {(isPending || isArchiving) && (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleArchive();
          }}
          className="text-muted-foreground hover:text-red-600 transition-colors"
          title="Archive"
        >
          <Archive className="h-5 w-5" />
        </button>
      </CardContent>
    </Card>
  );
}
