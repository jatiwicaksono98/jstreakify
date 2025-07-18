// types/toggle-habit-schema.ts
import { z } from 'zod';

export const ToggleHabitSchema = z.object({
  habitId: z.string(),
});

export type ToggleHabitInput = z.infer<typeof ToggleHabitSchema>;
