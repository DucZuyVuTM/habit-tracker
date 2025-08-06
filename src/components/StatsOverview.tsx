import React from 'react';
import { Habit } from '../types/habit';
import { calculateHabitStats } from '../utils/habitUtils';
import { TrendingUp, Target, Calendar, Award } from 'lucide-react';

interface StatsOverviewProps {
  habits: Habit[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ habits }) => {
  const totalHabits = habits.length;
  const totalCompletions = habits.reduce((sum, habit) => {
    const stats = calculateHabitStats(habit);
    return sum + stats.totalCompletions;
  }, 0);

  const averageCompletionRate = habits.length > 0 
    ? Math.round(habits.reduce((sum, habit) => {
        const stats = calculateHabitStats(habit);
        return sum + stats.completionRate;
      }, 0) / habits.length)
    : 0;

  const longestStreak = habits.reduce((max, habit) => {
    const stats = calculateHabitStats(habit);
    return Math.max(max, stats.longestStreak);
  }, 0);

  const stats = [
    {
      label: 'Total Habits',
      value: totalHabits,
      icon: Target,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Completions',
      value: totalCompletions,
      icon: Calendar,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Avg. Rate',
      value: `${averageCompletionRate}%`,
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Best Streak',
      value: longestStreak,
      icon: Award,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className={`inline-flex p-3 rounded-lg ${stat.bgColor} mb-3`}>
            <stat.icon size={24} className={stat.color} />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
          <div className="text-sm text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};