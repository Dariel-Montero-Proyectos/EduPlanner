import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckSquare, AlertTriangle, TrendingUp, BookOpen, Clock, Target } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { useSubjects } from '@/hooks/useSubjects';
import { TaskCard } from './TaskCard';
import { getWeekStart, getWeekEnd, formatDate } from '@/utils/dateUtils';

export function Dashboard() {
  const { tasks, toggleComplete, deleteTask, getOverdueTasks, getUpcomingTasks } = useTasks();
  const { subjects } = useSubjects();

  const currentWeek = getWeekStart(new Date());
  const weekEnd = getWeekEnd(new Date());
  const weekTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    return taskDate >= currentWeek && taskDate <= weekEnd;
  });

  const completedThisWeek = weekTasks.filter(task => task.completed).length;
  const totalThisWeek = weekTasks.length;
  const weekProgress = totalThisWeek > 0 ? (completedThisWeek / totalThisWeek) * 100 : 0;

  // Progreso Total (todas las tareas)
  const totalTasks = tasks.length;
  const completedTotalTasks = tasks.filter(task => task.completed).length;
  const totalProgress = totalTasks > 0 ? (completedTotalTasks / totalTasks) * 100 : 0;

  const overdueTasks = getOverdueTasks();
  const upcomingTasks = getUpcomingTasks();

  const motivationalQuotes = [
    "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
    "La educación es el arma más poderosa que puedes usar para cambiar el mundo.",
    "No te rindas, cada experto fue una vez un principiante.",
    "El aprendizaje nunca agota la mente.",
    "La perseverancia es la clave del éxito académico."
  ];

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-sm">
          <div>
            <h1 className="text-3xl font-academic font-bold text-slate-800">
              Dashboard Académico
            </h1>
            <p className="text-slate-600">
              Semana del {formatDate(currentWeek)} al {formatDate(weekEnd)}
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-4 max-w-md rounded-lg">
            <p className="text-sm italic text-blue-700">💡 {randomQuote}</p>
          </div>
        </div>

        {/* Stats Cards - SIN AMARILLO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Progreso Total - MORADO EN LUGAR DE AMARILLO */}
          <Card className="bg-white border border-purple-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Progreso Total</CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-academic text-slate-800">
                {Math.round(totalProgress)}%
              </div>
              <Progress 
                value={totalProgress} 
                className="mt-2 h-2 bg-purple-100"
                style={{
                  '--progress-background': 'rgb(196 181 253)',
                  '--progress-foreground': 'rgb(147 51 234)'
                } as React.CSSProperties}
              />
              <p className="text-xs text-slate-500 mt-1">
                {completedTotalTasks} de {totalTasks} tareas completadas
              </p>
            </CardContent>
          </Card>

          {/* Progreso Semanal */}
          <Card className="bg-white border border-blue-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Progreso Semanal</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-academic text-slate-800">
                {Math.round(weekProgress)}%
              </div>
              <Progress 
                value={weekProgress} 
                className="mt-2 h-2 bg-blue-100"
                style={{
                  '--progress-background': 'rgb(219 234 254)',
                  '--progress-foreground': 'rgb(37 99 235)'
                } as React.CSSProperties}
              />
              <p className="text-xs text-slate-500 mt-1">
                {completedThisWeek} de {totalThisWeek} tareas completadas
              </p>
            </CardContent>
          </Card>

          {/* Tareas Vencidas */}
          <Card className="bg-white border border-red-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Tareas Vencidas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-academic text-red-600">
                {overdueTasks.length}
              </div>
              <p className="text-xs text-slate-500">
                Requieren atención inmediata
              </p>
            </CardContent>
          </Card>

          {/* Próximas */}
          <Card className="bg-white border border-emerald-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Próximas</CardTitle>
              <Clock className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-academic text-emerald-600">
                {upcomingTasks.length}
              </div>
              <p className="text-xs text-slate-500">
                En los próximos 3 días
              </p>
            </CardContent>
          </Card>

          {/* Materias Activas */}
          <Card className="bg-white border border-indigo-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Materias Activas</CardTitle>
              <BookOpen className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-academic text-indigo-600">
                {subjects.length}
              </div>
              <p className="text-xs text-slate-500">
                Cursos registrados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overdue Tasks */}
          {overdueTasks.length > 0 && (
            <Card className="bg-red-50 border border-red-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-red-700 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Tareas Vencidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {overdueTasks.slice(0, 3).map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={toggleComplete}
                    onDelete={deleteTask}
                  />
                ))}
                {overdueTasks.length > 3 && (
                  <p className="text-sm text-red-600 text-center font-medium">
                    Y {overdueTasks.length - 3} más...
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Upcoming Tasks */}
          <Card className="bg-emerald-50 border border-emerald-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-emerald-700 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Próximas Tareas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingTasks.slice(0, 3).map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={toggleComplete}
                  onDelete={deleteTask}
                />
              ))}
              {upcomingTasks.length === 0 && (
                <p className="text-sm text-emerald-700 text-center py-4 font-medium">
                  🎉 ¡No hay tareas urgentes! Buen trabajo.
                </p>
              )}
              {upcomingTasks.length > 3 && (
                <p className="text-sm text-emerald-700 text-center font-medium">
                  Y {upcomingTasks.length - 3} más...
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* This Week's Tasks Summary */}
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Calendar className="w-5 h-5" />
              Resumen de la Semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {subjects.map(subject => {
                const subjectTasks = weekTasks.filter(task => task.subject === subject.name);
                const completed = subjectTasks.filter(task => task.completed).length;
                
                return (
                  <div key={subject.id} className="text-center p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <div 
                      className="w-3 h-3 rounded-full mx-auto mb-2"
                      style={{ backgroundColor: subject.color }}
                    />
                    <h4 className="font-medium text-sm text-slate-800">{subject.name}</h4>
                    <p className="text-xs text-slate-600">
                      {completed}/{subjectTasks.length} completadas
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Progreso Total por Materia - SIN AMARILLO */}
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Target className="w-5 h-5" />
              Progreso Total por Materia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjects.map(subject => {
                const subjectAllTasks = tasks.filter(task => task.subject === subject.name);
                const completedAll = subjectAllTasks.filter(task => task.completed).length;
                const progressPercent = subjectAllTasks.length > 0 ? (completedAll / subjectAllTasks.length) * 100 : 0;
                
                return (
                  <div key={subject.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: subject.color }}
                        />
                        <span className="font-medium text-sm text-slate-800">{subject.name}</span>
                      </div>
                      <span className="text-sm text-slate-600 font-medium">
                        {completedAll}/{subjectAllTasks.length} ({Math.round(progressPercent)}%)
                      </span>
                    </div>
                    <Progress 
                      value={progressPercent} 
                      className="h-2 bg-slate-100"
                      style={{ 
                        '--progress-foreground': subject.color,
                        '--progress-background': 'rgb(241 245 249)'
                      } as React.CSSProperties}
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}