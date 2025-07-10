'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAction } from 'next-safe-action/hooks';
import { addTodo } from '@/server/actions/add-todo';

const AddTodoSchema = z.object({
  content: z.string().min(1).max(200),
});

type AddTodoValues = z.infer<typeof AddTodoSchema>;

export function AddTodoForm({ onSuccess }: { onSuccess?: () => void }) {
  const form = useForm<AddTodoValues>({
    resolver: zodResolver(AddTodoSchema),
    defaultValues: { content: '' },
  });
  const { execute, status } = useAction(addTodo, {
    onSuccess: () => {
      onSuccess?.();
      form.reset();
    },
  });

  const onSubmit = (values: AddTodoValues) => {
    execute(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.stopPropagation();
          form.handleSubmit(onSubmit);
        }}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>To‑Do</FormLabel>
              <FormControl>
                <Input placeholder="Write your task…" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={status === 'executing'}
          className="w-full"
        >
          {status === 'executing' ? 'Adding...' : 'Add To‑Do'}
        </Button>
      </form>
    </Form>
  );
}
