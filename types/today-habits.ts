export interface HabitWithEntry {
  id: string;
  name: string;
  currentStreak: number;
  longestStreak: number;
  isDoneToday: boolean | null;
  completedAt: Date | null;
}
