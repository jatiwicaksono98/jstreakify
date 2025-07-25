'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { updateHabit } from '@/server/actions/edit-habit';

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

type FormInput = z.infer<typeof schema>;

export function EditHabitForm({
  habitId,
  initialName,
  initialDescription,
  onSuccess,
}: {
  habitId: string;
  initialName: string;
  initialDescription?: string | null;
  onSuccess: () => void;
}) {
  const form = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialName,
      description: initialDescription ?? '',
    },
  });

  const { execute, status } = useAction(updateHabit, {
    onSuccess: () => {
      toast.success('Habit berhasil diupdate');
      onSuccess();
      window.location.reload(); // ensure revalidation
    },
    onError: (err) => {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Terjadi kesalahan');
      }
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => execute({ habitId, ...data }))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Habit</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Baca buku" {...field} />
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
          {status === 'executing' ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </form>
    </Form>
  );
}
