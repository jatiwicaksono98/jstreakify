import * as z from 'zod';

export const AddTodoSchema = z.object({
  content: z.string().min(1).max(200),
});

export type AddTodoValues = z.infer<typeof AddTodoSchema>;
