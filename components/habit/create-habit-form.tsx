'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createHabitSchema,
  CreateHabitInput,
} from '@/types/create-habit-schema';
import { Form, FormField, FormItem, FormLabel, FormControl } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { createHabit } from '@/server/actions/create-habit';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';

export function CreateHabitForm({ onSuccess }: { onSuccess: () => void }) {
  const form = useForm<CreateHabitInput>({
    resolver: zodResolver(createHabitSchema),
  });

  const { execute, status } = useAction(createHabit, {
    onSuccess: () => {
      toast.success('Habit berhasil dibuat');
      form.reset();
      onSuccess();
    },
    onError: (err) => {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('An unknown error occurred');
      }
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => execute(data))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Habit</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Baca Alkitab" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi (opsional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Catatan tambahan..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={status === 'executing'}
          className="w-full"
        >
          {status === 'executing' ? 'Membuat...' : 'Buat Habit'}
        </Button>
      </form>
    </Form>
  );
}
