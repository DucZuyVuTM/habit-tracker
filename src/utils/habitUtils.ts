import { Habit, HabitStats } from '../types/habit';
import { getTodayString, getDateString } from './dateUtils';

export const calculateHabitStats = (habit: Habit): HabitStats => {
  const today = getTodayString();
  const completions = habit.completions;
  
  // Calculate current streak
  let currentStreak = 0;
  let date = today;
  while (completions[date]) {
    currentStreak++;
    const yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);
    date = yesterday.toISOString().split('T')[0];
  }
  
  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  const allDates = Object.keys(completions).sort();
  
  for (const dateStr of allDates) {
    if (completions[dateStr]) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }
  
  // Calculate total completions
  const totalCompletions = Object.values(completions).filter(Boolean).length;
  
  // Calculate completion rate (last 30 days)
  const last30Days = [];
  for (let i = 29; i >= 0; i--) {
    last30Days.push(getDateString(-i));
  }
  
  const completionsInLast30Days = last30Days.filter(date => completions[date]).length;
  const completionRate = (completionsInLast30Days / 30) * 100;
  
  return {
    currentStreak,
    longestStreak,
    totalCompletions,
    completionRate: Math.round(completionRate)
  };
};

export const getStreakEmoji = (streak: number): string => {
  if (streak >= 100) return '🏆';
  if (streak >= 50) return '💎';
  if (streak >= 30) return '🔥';
  if (streak >= 14) return '⚡';
  if (streak >= 7) return '🌟';
  if (streak >= 3) return '💪';
  return '🌱';
};