export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  color: string;
  createdAt: string;
  completions: Record<string, boolean>; // date string -> completion status
}

export type HabitCategory = 'health' | 'productivity' | 'learning' | 'social' | 'mindfulness' | 'creative';

export interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate: number;
}