
import { useState, useEffect } from 'react';
import { Task } from '@/types';
import { useLocalStorage } from './useLocalStorage';

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('university-tasks', []);

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const getTasksByWeek = (weekStart: Date) => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate >= weekStart && taskDate < weekEnd;
    });
  };

  const getOverdueTasks = () => {
    const now = new Date();
    return tasks.filter(task => 
      !task.completed && new Date(task.dueDate) < now
    );
  };

  const getUpcomingTasks = (days = 3) => {
    const now = new Date();
    const future = new Date(now);
    future.setDate(future.getDate() + days);
    
    return tasks.filter(task => 
      !task.completed && 
      new Date(task.dueDate) >= now && 
      new Date(task.dueDate) <= future
    );
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    getTasksByWeek,
    getOverdueTasks,
    getUpcomingTasks,
  };
}
