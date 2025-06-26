
import { Habit } from '@/types';
import { useLocalStorage } from './useLocalStorage';

export function useHabits() {
  const [habits, setHabits] = useLocalStorage<Habit[]>('university-habits', []);

  const addHabit = (habitData: Omit<Habit, 'id'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: crypto.randomUUID(),
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id ? { ...habit, ...updates } : habit
    ));
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
  };

  const toggleComplete = (id: string) => {
    setHabits(prev => prev.map(habit =>
      habit.id === id
        ? { ...habit, completed: !habit.completed }
        : habit
    ));
  };

  return {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleComplete,
  };
}
