import React from 'react';
import { Habit } from '../types/habit';
import { calculateHabitStats, getStreakEmoji } from '../utils/habitUtils';
import { getTodayString, getLastNDays } from '../utils/dateUtils';
import { CheckCircle2, Circle, Flame, Target, TrendingUp, Edit3, Trash2 } from 'lucide-react';

interface HabitCardProps {
  habit: Habit;
  onToggleCompletion: (habitId: string, date: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

const categoryColors = {
  health: 'bg-green-500',
  productivity: 'bg-blue-500',
  learning: 'bg-purple-500',
  social: 'bg-pink-500',
  mindfulness: 'bg-indigo-500',
  creative: 'bg-orange-500'
};

export const HabitCard: React.FC<HabitCardProps> = ({ 
  habit, 
  onToggleCompletion, 
  onEdit, 
  onDelete 
}) => {
  const stats = calculateHabitStats(habit);
  const today = getTodayString();
  const last7Days = getLastNDays(7);
  const isCompletedToday = habit.completions[today] || false;

  const handleToggleToday = () => {
    onToggleCompletion(habit.id, today);
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-4 h-4 rounded-full ${categoryColors[habit.category]}`}></div>
          <h3 className="text-lg font-semibold text-gray-900">{habit.name}</h3>
          <span className="text-xl">{getStreakEmoji(stats.currentStreak)}</span>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(habit)}
            className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => onDelete(habit.id)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Today's Completion */}
      <div className="mb-6">
        <button
          onClick={handleToggleToday}
          className={`flex items-center gap-3 w-full p-3 rounded-lg border-2 transition-all duration-200 ${
            isCompletedToday
              ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
              : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
          }`}
        >
          {isCompletedToday ? (
            <CheckCircle2 className="text-emerald-500" size={24} />
          ) : (
            <Circle className="text-gray-400" size={24} />
          )}
          <span className="font-medium">
            {isCompletedToday ? 'Completed today!' : 'Mark as complete'}
          </span>
        </button>
      </div>

      {/* Weekly Progress */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Last 7 days</h4>
        <div className="flex gap-1">
          {last7Days.map((date) => (
            <div
              key={date}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                habit.completions[date]
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {new Date(date + 'T00:00:00').getDate()}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Flame size={16} className="text-orange-500" />
            <span className="text-lg font-bold text-gray-900">{stats.currentStreak}</span>
          </div>
          <span className="text-xs text-gray-500">Current Streak</span>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Target size={16} className="text-blue-500" />
            <span className="text-lg font-bold text-gray-900">{stats.longestStreak}</span>
          </div>
          <span className="text-xs text-gray-500">Best Streak</span>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-lg font-bold text-gray-900">{stats.completionRate}%</span>
          </div>
          <span className="text-xs text-gray-500">30-day Rate</span>
        </div>
      </div>
    </div>
  );
};