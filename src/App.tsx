import React, { useState, useEffect } from 'react';
import { Habit } from './types/habit';
import { HabitCard } from './components/HabitCard';
import { HabitForm } from './components/HabitForm';
import { StatsOverview } from './components/StatsOverview';
import { saveHabits, loadHabits } from './utils/storage';
import { Plus, Activity } from 'lucide-react';

function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();

  // Load habits on mount
  useEffect(() => {
    const savedHabits = loadHabits();
    setHabits(savedHabits);
  }, []);

  // Save habits whenever they change
  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  const handleCreateHabit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      completions: {}
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const handleEditHabit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => {
    if (!editingHabit) return;
    
    setHabits(prev => prev.map(habit => 
      habit.id === editingHabit.id 
        ? { ...habit, ...habitData }
        : habit
    ));
    setEditingHabit(undefined);
  };

  const handleDeleteHabit = (habitId: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== habitId));
  };

  const handleToggleCompletion = (habitId: string, date: string) => {
    setHabits(prev => prev.map(habit => 
      habit.id === habitId 
        ? {
            ...habit,
            completions: {
              ...habit.completions,
              [date]: !habit.completions[date]
            }
          }
        : habit
    ));
  };

  const openCreateForm = () => {
    setEditingHabit(undefined);
    setIsFormOpen(true);
  };

  const openEditForm = (habit: Habit) => {
    setEditingHabit(habit);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingHabit(undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl text-white">
                <Activity size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Habit Tracker</h1>
                <p className="text-gray-600">Build better habits, one day at a time</p>
              </div>
            </div>
            <button
              onClick={openCreateForm}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium shadow-lg shadow-emerald-500/25"
            >
              <Plus size={20} />
              New Habit
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <StatsOverview habits={habits} />

        {/* Habits Grid */}
        {habits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.map(habit => (
              <div key={habit.id} className="group">
                <HabitCard
                  habit={habit}
                  onToggleCompletion={handleToggleCompletion}
                  onEdit={openEditForm}
                  onDelete={handleDeleteHabit}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="p-6 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-2xl inline-block mb-6">
              <Activity size={48} className="text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Start Building Great Habits
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Create your first habit and begin your journey towards a better, more productive life.
            </p>
            <button
              onClick={openCreateForm}
              className="px-8 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium shadow-lg shadow-emerald-500/25"
            >
              Create Your First Habit
            </button>
          </div>
        )}
      </main>

      {/* Habit Form Modal */}
      <HabitForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSave={editingHabit ? handleEditHabit : handleCreateHabit}
        editingHabit={editingHabit}
      />
    </div>
  );
}

export default App;