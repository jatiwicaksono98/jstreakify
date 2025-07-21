export type HabitWithEntry = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date | null;
  isArchived: boolean;
  isDone?: boolean;
  completedAt?: Date | null;
  currentStreak?: number;
};
