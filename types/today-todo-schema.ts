export interface TodoWithEntry {
  id: string;
  content: string;
  isDone: boolean | null;
  completedAt: Date | null;
}
