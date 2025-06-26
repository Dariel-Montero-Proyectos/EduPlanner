export interface Task {
  id: string;
  name: string;
  subject: string;
  dueDate: Date;
  type: 'homework' | 'group-work' | 'reading' | 'exam' | 'project' | 'presentation';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: Date;
  description?: string;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  code: string;
  professor?: string;
  credits?: number;
  classroom?: string; // Added for school subjects
}

export interface Habit {
  id: string;
  name: string;
  type: 'study' | 'sleep' | 'exercise' | 'nutrition' | 'other';
  target: number;
  unit: string;
  completed: boolean;
  date: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subject?: string;
  createdAt: Date;
  updatedAt: Date;
  pinned: boolean;
}

export interface AcademicEvent {
  id: string;
  title: string;
  date: Date;
  type: 'exam' | 'assignment' | 'holiday' | 'important';
  subject?: string;
  description?: string;
}

export type TaskType = Task['type'];
export type Priority = Task['priority'];
export type HabitType = Habit['type'];
