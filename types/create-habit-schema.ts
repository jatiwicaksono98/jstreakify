import * as z from 'zod';

export const createHabitSchema = z.object({
  name: z.string().min(1, 'Wajib diisi'),
  description: z.string().optional(),
});

export type CreateHabitInput = z.infer<typeof createHabitSchema>;
