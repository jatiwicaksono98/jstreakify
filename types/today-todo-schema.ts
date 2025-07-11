export type TodoStatus = 'not_started' | 'in_progress' | 'done';

export interface TodoWithEntry {
  id: string;
  content: string;
  status: 'not_started' | 'in_progress' | 'done' | null;
  completedAt: Date | null;
  createdAt: Date;
}
