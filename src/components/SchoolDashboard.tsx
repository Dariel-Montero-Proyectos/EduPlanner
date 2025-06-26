import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckSquare, AlertTriangle, TrendingUp, BookOpen, Clock, GraduationCap, Target, Star } from 'lucide-react';
import { WeeklyPlanner } from './WeeklyPlanner';
import { SchoolSubjectsView } from './SchoolSubjectsView';
import { CalendarView } from './CalendarView';
import { NotesView } from './NotesView';
import { ProgressView } from './ProgressView';
import { HabitsView } from './HabitsView';
import { useTasks } from '@/hooks/useTasks';
import { useSubjects } from '@/hooks/useSubjects';
import { TaskCard } from './TaskCard';
import { getWeekStart, getWeekEnd, formatDate } from '@/utils/dateUtils';

interface SchoolDashboardProps {
  activeSection: string;
}

export function SchoolDashboard({ activeSection }: SchoolDashboardProps) {
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

  const overdueTasks = getOverdueTasks();
  const upcomingTasks = getUpcomingTasks();

  const schoolMotivationalQuotes = [
    "¡Cada día es una nueva oportunidad para aprender algo increíble! 🌟",
    "Los pequeños pasos te llevan a grandes logros académicos 📚",
    "Tu esfuerzo de hoy es tu éxito de mañana ✨",
    "Estudiar no es solo memorizar, es entender el mundo 🌍",
    "¡Eres capaz de lograr todo lo que te propongas! 💪",
    "La curiosidad es tu mejor herramienta de aprendizaje 🔍",
    "Cada error te acerca más al conocimiento 🎯"
  ];

  const randomQuote = schoolMotivationalQuotes[Math.floor(Math.random() * schoolMotivationalQuotes.length)];

  const renderDashboardContent = () => (
    <div className="space-y-6">
      {/* Header con frase motivacional */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-academic font-bold text-academic-dark">
            ¡Tu Panel Escolar! 📚
          </h1>
          <p className="text-academic-muted">
            Semana del {formatDate(currentWeek)} al {formatDate(weekEnd)}
          </p>
        </div>
        <div className="bg-gradient-to-r from-academic-primary/10 to-academic-accent/10 border border-academic-primary/20 p-4 max-w-md rounded-lg">
          <p className="text-sm text-academic-primary font-medium">{randomQuote}</p>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border border-academic-light hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-academic-dark">Mi Progreso Semanal</CardTitle>
            <TrendingUp className="h-4 w-4 text-academic-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-academic text-academic-primary">
              {Math.round(weekProgress)}%
            </div>
            <Progress value={weekProgress} className="mt-2 bg-academic-light [&>div]:bg-academic-primary" />
            <p className="text-xs text-academic-muted mt-1">
              {completedThisWeek} de {totalThisWeek} tareas completadas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-red-100 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-academic-dark">Tareas Atrasadas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-academic-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-academic text-academic-warning">
              {overdueTasks.length}
            </div>
            <p className="text-xs text-academic-muted">
              {overdueTasks.length === 0 ? '¡Genial! Al día' : 'Necesitan tu atención'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-emerald-100 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-academic-dark">Próximas Tareas</CardTitle>
            <Clock className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-academic text-emerald-600">
              {upcomingTasks.length}
            </div>
            <p className="text-xs text-academic-muted">
              En los próximos 3 días
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-academic-accent/30 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-academic-dark">Mis Asignaturas</CardTitle>
            <BookOpen className="h-4 w-4 text-academic-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-academic text-academic-accent">
              {subjects.length}
            </div>
            <p className="text-xs text-academic-muted">
              Materias activas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secciones de tareas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tareas atrasadas */}
        {overdueTasks.length > 0 && (
          <Card className="bg-red-50 border border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                ⚠️ Tareas Atrasadas
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
                <p className="text-sm text-red-600 text-center bg-red-100 p-2 rounded">
                  Y {overdueTasks.length - 3} tareas más por revisar...
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Próximas tareas */}
        <Card className="bg-emerald-50 border border-emerald-200">
          <CardHeader>
            <CardTitle className="text-emerald-700 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              📅 Próximas Tareas
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
              <div className="text-center py-6">
                <Star className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                <p className="text-emerald-600 font-medium">¡Excelente!</p>
                <p className="text-sm text-emerald-600">No tienes tareas urgentes</p>
              </div>
            )}
            {upcomingTasks.length > 3 && (
              <p className="text-sm text-emerald-600 text-center bg-emerald-100 p-2 rounded">
                Y {upcomingTasks.length - 3} tareas más programadas
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resumen por asignatura */}
      <Card className="bg-white border border-academic-light">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-academic-dark">
            <GraduationCap className="w-5 h-5" />
            📊 Mi Rendimiento por Asignatura
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subjects.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {subjects.map(subject => {
                const subjectTasks = weekTasks.filter(task => task.subject === subject.name);
                const completed = subjectTasks.filter(task => task.completed).length;
                const completionRate = subjectTasks.length > 0 ? (completed / subjectTasks.length) * 100 : 0;
                
                return (
                  <div key={subject.id} className="text-center p-4 rounded-lg bg-academic-neutral border border-academic-light hover:shadow-sm transition-shadow">
                    <div 
                      className="w-4 h-4 rounded-full mx-auto mb-2"
                      style={{ backgroundColor: subject.color }}
                    />
                    <h4 className="font-medium text-sm text-academic-dark mb-1">{subject.name}</h4>
                    <div className="space-y-1">
                      <p className="text-xs text-academic-muted">
                        {completed}/{subjectTasks.length} completadas
                      </p>
                      <div className="w-full bg-academic-light rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${completionRate}%`,
                            backgroundColor: subject.color 
                          }}
                        />
                      </div>
                      <p className="text-xs font-medium" style={{ color: subject.color }}>
                        {Math.round(completionRate)}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-16 h-16 text-academic-muted mx-auto mb-4" />
              <p className="text-academic-muted">Aún no has agregado asignaturas</p>
              <p className="text-sm text-academic-muted">¡Comienza agregando tus materias!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mensaje de ánimo */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
        <CardContent className="p-6 text-center">
          <Target className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <h3 className="font-academic font-bold text-slate-800 mb-2">
            ¡Sigue así, vas genial! 🎯
          </h3>
          <p className="text-slate-600">
            Recuerda: la constancia es la clave del éxito escolar.
            Cada tarea completada te acerca más a tus metas académicas.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboardContent();
      case 'planner':
        return <WeeklyPlanner />;
      case 'subjects':
        return <SchoolSubjectsView />;
      case 'calendar':
        return <CalendarView />;
      case 'notes':
        return <NotesView />;
      case 'progress':
        return <ProgressView />;
      case 'habits':
        return <HabitsView />;
      default:
        return (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg p-8 border border-academic-light">
              <BookOpen className="w-16 h-16 text-academic-muted mx-auto mb-4" />
              <h2 className="text-2xl font-academic font-bold text-academic-dark mb-2">
                Sección en construcción
              </h2>
              <p className="text-academic-muted">
                Estamos trabajando en esta funcionalidad para ti
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-academic-neutral">
      {renderContent()}
    </div>
  );
}