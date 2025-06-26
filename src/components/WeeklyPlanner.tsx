import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Plus, Calendar } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { TaskCard } from './TaskCard';
import { AddTaskForm } from './AddTaskForm';
import { getWeekStart, getWeekEnd, formatDate } from '@/utils/dateUtils';
import { Task } from '@/types';

export function WeeklyPlanner() {
  const { tasks, addTask, toggleComplete, deleteTask } = useTasks();
  const [currentWeek, setCurrentWeek] = useState(getWeekStart(new Date()));
  const [showAddTask, setShowAddTask] = useState(false);

  const weekEnd = getWeekEnd(currentWeek);
  const weekTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    return taskDate >= currentWeek && taskDate <= weekEnd;
  });

  const goToPreviousWeek = () => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() - 7);
    setCurrentWeek(newWeek);
  };

  const goToNextWeek = () => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + 7);
    setCurrentWeek(newWeek);
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(getWeekStart(new Date()));
  };

  // Group tasks by day
  const tasksByDay = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(currentWeek);
      day.setDate(day.getDate() + i);
      
      const dayTasks = weekTasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        return taskDate.toDateString() === day.toDateString();
      });

      days.push({
        date: day,
        tasks: dayTasks,
        isToday: day.toDateString() === new Date().toDateString()
      });
    }
    return days;
  };

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    addTask(taskData);
    setShowAddTask(false);
  };

  const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header responsivo */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200">
            Planificador Semanal
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
            {formatDate(currentWeek)} - {formatDate(weekEnd)}
          </p>
        </div>

        <div className="flex items-center gap-2 justify-between">
          <Button
            variant="outline"
            onClick={goToCurrentWeek}
            className="flex items-center gap-1 md:gap-2 px-2 md:px-4"
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Hoy</span>
          </Button>

          <Button
            onClick={() => setShowAddTask(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 md:gap-2 px-2 md:px-4"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Tarea</span>
          </Button>
        </div>
      </div>

      {/* Week Navigation - Responsive */}
      <div className="flex items-center justify-between gap-2 md:justify-center md:gap-4">
        <Button variant="outline" onClick={goToPreviousWeek} className="p-2">
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-1 md:gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span className="text-sm md:text-base font-medium text-slate-800 dark:text-slate-200 truncate max-w-[150px] md:max-w-none">
            Semana del {currentWeek.getDate()} de {currentWeek.toLocaleDateString('es-ES', { month: 'long' })}
          </span>
        </div>

        <Button variant="outline" onClick={goToNextWeek} className="p-2">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Add Task Form */}
      {showAddTask && (
        <div className="animate-fade-in">
          <AddTaskForm 
            onSubmit={handleAddTask}
            onCancel={() => setShowAddTask(false)}
          />
        </div>
      )}

      {/* ==== MEJORA: DISEÑO RESPONSIVO PARA TAREAS ==== */}
      {/* Weekly Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 md:gap-4">
        {tasksByDay().map((day, index) => (
          <Card 
            key={day.date.toISOString()} 
            className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${
              day.isToday ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-center dark:text-slate-300">
                <div className="flex flex-col items-center">
                  <span>{dayNames[index]}</span>
                  <span className={`text-lg font-bold ${
                    day.isToday 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-slate-600 dark:text-slate-400'
                  }`}>
                    {day.date.getDate()}
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Contenedor con altura máxima y scroll */}
              <div className={`max-h-[300px] overflow-y-auto pr-1 ${
                day.tasks.length > 3 ? 'min-h-[200px]' : ''
              }`}>
                {day.tasks.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-4">
                    Sin tareas
                  </p>
                ) : (
                  day.tasks.map(task => (
                    <div key={task.id} className="mb-2 last:mb-0">
                      <TaskCard
                        task={task}
                        onToggleComplete={toggleComplete}
                        onDelete={deleteTask}
                      />
                    </div>
                  ))
                )}
              </div>
              
              {day.tasks.length > 0 && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <Badge variant="outline" className="w-full justify-center text-xs border-slate-300 dark:border-slate-600">
                    {day.tasks.filter(t => t.completed).length}/{day.tasks.length} completadas
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Week Summary */}
      <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200 text-base md:text-xl">
            <Calendar className="w-4 h-4 md:w-5 md:h-5" />
            Resumen de la Semana
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 text-center">
            <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                {weekTasks.length}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {weekTasks.filter(t => t.completed).length}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Completadas</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {weekTasks.filter(t => !t.completed).length}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Pendientes</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {weekTasks.length > 0 ? Math.round((weekTasks.filter(t => t.completed).length / weekTasks.length) * 100) : 0}%
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Progreso</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}