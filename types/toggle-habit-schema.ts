// types/toggle-habit-schema.ts
import { z } from 'zod';

export const ToggleHabitSchema = z.object({
  habitId: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'), // YYYY-MM-DD
});

export type ToggleHabitInput = z.infer<typeof ToggleHabitSchema>;
