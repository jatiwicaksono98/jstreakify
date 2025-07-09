'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { TodoWithEntry } from '@/types/today-todo-schema';
import { toggleTodoEntry } from '@/server/actions/toggle-todo';

export function TodoCard({
  id,
  content,
  isDone: initialIsDone,
}: TodoWithEntry) {
  const [isDone, setIsDone] = useState(initialIsDone ?? false);
  const [isPending, startTransition] = useTransition();

  const handleCheck = () => {
    if (isPending) return;
    startTransition(() => {
      toggleTodoEntry(id).then((res) => {
        // Optional: handle response
        setIsDone((prev) => !prev);
      });
    });
  };

  const getCardStyle = () =>
    `mb-4 cursor-pointer transition-all duration-200 ${
      isDone
        ? 'bg-green-100 hover:bg-green-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[4px] -translate-y-[4px]'
        : 'bg-white hover:bg-gray-100'
    }`;

  return (
    <Card className={getCardStyle()} onClick={handleCheck}>
      <CardContent className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={isDone}
            onCheckedChange={handleCheck}
            disabled={isPending}
          />
          <div
            className={`font-medium ${
              isDone ? 'line-through text-muted-foreground' : ''
            }`}
          >
            {content}
          </div>
        </div>
        {isDone && <div className="text-sm text-muted-foreground">✅</div>}
      </CardContent>
    </Card>
  );
}
