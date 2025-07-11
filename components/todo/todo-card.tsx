'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toggleTodoEntry } from '@/server/actions/toggle-todo';
import { TodoWithEntry } from '@/types/today-todo-schema';
import { Loader2, Archive } from 'lucide-react';
import { archiveTodo } from '@/server/actions/archive-todo';

export function TodoCard({
  id,
  content,
  isDone: initialIsDone,
}: TodoWithEntry) {
  const [isDone, setIsDone] = useState(initialIsDone ?? false);
  const [isPending, startTransition] = useTransition();
  const [isArchiving, startArchiveTransition] = useTransition();

  const handleToggle = () => {
    if (isPending || isArchiving) return;
    startTransition(async () => {
      const res = await toggleTodoEntry(id);
      setIsDone(res.isDone);
    });
  };

  const handleArchive = () => {
    if (isPending || isArchiving) return;
    startArchiveTransition(async () => {
      await archiveTodo(id); // You’ll implement this server action
    });
  };

  const getCardStyle = () =>
    `mb-4 transition-all duration-200 ${
      isDone
        ? 'bg-green-100 hover:bg-green-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[4px] -translate-y-[4px]'
        : 'bg-white hover:bg-gray-100'
    } ${
      isPending || isArchiving
        ? 'pointer-events-none opacity-50 cursor-wait'
        : 'cursor-pointer'
    }`;

  return (
    <Card onClick={handleToggle} className={getCardStyle()}>
      <CardContent className="p-4 flex justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <Checkbox checked={isDone} onCheckedChange={handleToggle} disabled />
          <div
            className={`font-medium ${
              isDone ? 'line-through text-muted-foreground' : ''
            }`}
          >
            {content}
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
