
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Calendar, CheckSquare, Target, Award } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { useSubjects } from '@/hooks/useSubjects';
import { getWeekStart, getWeekEnd } from '@/utils/dateUtils';

export function ProgressView() {
  const { tasks } = useTasks();
  const { subjects } = useSubjects();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');

  const now = new Date();
  const weekStart = getWeekStart(now);
  const weekEnd = getWeekEnd(now);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const getFilteredTasks = () => {
    switch (selectedPeriod) {
      case 'week':
        return tasks.filter(task => {
          const taskDate = new Date(task.dueDate);
          return taskDate >= weekStart && taskDate <= weekEnd;
        });
      case 'month':
        return tasks.filter(task => {
          const taskDate = new Date(task.dueDate);
          return taskDate >= monthStart && taskDate <= monthEnd;
        });
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();
  const completedTasks = filteredTasks.filter(task => task.completed);
  const completionRate = filteredTasks.length > 0 ? (completedTasks.length / filteredTasks.length) * 100 : 0;

  // Statistics by subject
  const subjectStats = subjects.map(subject => {
    const subjectTasks = filteredTasks.filter(task => task.subject === subject.name);
    const completed = subjectTasks.filter(task => task.completed).length;
    const total = subjectTasks.length;
    const rate = total > 0 ? (completed / total) * 100 : 0;
    
    return {
      subject: subject.name,
      color: subject.color,
      completed,
      total,
      rate,
    };
  }).filter(stat => stat.total > 0);

  // Statistics by priority
  const priorityStats = ['high', 'medium', 'low'].map(priority => {
    const priorityTasks = filteredTasks.filter(task => task.priority === priority);
    const completed = priorityTasks.filter(task => task.completed).length;
    const total = priorityTasks.length;
    const rate = total > 0 ? (completed / total) * 100 : 0;
    
    return {
      priority,
      completed,
      total,
      rate,
    };
  }).filter(stat => stat.total > 0);

  const priorityLabels = {
    high: 'Alta',
    medium: 'Media',
    low: 'Baja',
  };

  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-blue-100 text-blue-800', 
    low: 'bg-green-100 text-green-800',
  };

  // Statistics by task type
  const typeStats = ['homework', 'group-work', 'reading', 'exam', 'project', 'presentation'].map(type => {
    const typeTasks = filteredTasks.filter(task => task.type === type);
    const completed = typeTasks.filter(task => task.completed).length;
    const total = typeTasks.length;
    const rate = total > 0 ? (completed / total) * 100 : 0;
    
    return {
      type,
      completed,
      total,
      rate,
    };
  }).filter(stat => stat.total > 0);

  const typeLabels = {
    'homework': 'Tareas',
    'group-work': 'Trabajo en Grupo',
    'reading': 'Lecturas',
    'exam': 'Exámenes',
    'project': 'Proyectos',
    'presentation': 'Presentaciones',
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'week':
        return `Semana del ${weekStart.getDate()}/${weekStart.getMonth() + 1}`;
      case 'month':
        return now.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
      default:
        return 'Todo el tiempo';
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-academic font-bold text-slate-800">
            Seguimiento de Progreso
          </h1>
          <p className="text-slate-600">
            Análisis y estadísticas de tu rendimiento académico
          </p>
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'all')}
          className="px-4 py-2 border rounded-md bg-white text-sm text-slate-700 w-full sm:w-48"
        >
          <option value="week">Esta semana</option>
          <option value="month">Este mes</option>
          <option value="all">Todo el tiempo</option>
        </select>
      </div>

      {/* Period Summary */}
      <Card className="bg-white border border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Calendar className="w-5 h-5" />
            Resumen - {getPeriodLabel()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-2xl md:text-3xl font-academic font-bold text-slate-800">
                {filteredTasks.length}
              </div>
              <p className="text-sm text-slate-500">Total Tareas</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-2xl md:text-3xl font-academic font-bold text-green-600">
                {completedTasks.length}
              </div>
              <p className="text-sm text-slate-500">Completadas</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-2xl md:text-3xl font-academic font-bold text-blue-600">
                {filteredTasks.length - completedTasks.length}
              </div>
              <p className="text-sm text-slate-500">Pendientes</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-2xl md:text-3xl font-academic font-bold text-indigo-600">
                {Math.round(completionRate)}%
              </div>
              <p className="text-sm text-slate-500">Progreso</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-800">Progreso General</span>
              <span className="text-sm text-slate-500">{Math.round(completionRate)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div 
                className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress by Subject */}
        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <BarChart3 className="w-5 h-5" />
              Progreso por Materia
            </CardTitle>
          </CardHeader>
          <CardContent>
            {subjectStats.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No hay datos para este período</p>
              </div>
            ) : (
              <div className="space-y-4">
                {subjectStats.map(stat => (
                  <div key={stat.subject} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: stat.color }}
                        />
                        <span className="text-sm font-medium text-slate-800">{stat.subject}</span>
                      </div>
                      <div className="text-sm text-slate-600">
                        {stat.completed}/{stat.total} ({Math.round(stat.rate)}%)
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${stat.rate}%`,
                          backgroundColor: stat.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress by Priority */}
        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Target className="w-5 h-5" />
              Progreso por Prioridad
            </CardTitle>
          </CardHeader>
          <CardContent>
            {priorityStats.length === 0 ? (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No hay datos para este período</p>
              </div>
            ) : (
              <div className="space-y-4">
                {priorityStats.map(stat => (
                  <div key={stat.priority} className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200">
                    <div className="flex items-center gap-3">
                      <Badge className={priorityColors[stat.priority as keyof typeof priorityColors]}>
                        {priorityLabels[stat.priority as keyof typeof priorityLabels]}
                      </Badge>
                      <div className="flex-1">
                        <div className="w-24 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${stat.rate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-slate-700">
                      {stat.completed}/{stat.total}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Progress by Task Type */}
      <Card className="bg-white border border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <CheckSquare className="w-5 h-5" />
            Progreso por Tipo de Tarea
          </CardTitle>
        </CardHeader>
        <CardContent>
          {typeStats.length === 0 ? (
            <div className="text-center py-8">
              <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No hay datos para este período</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {typeStats.map(stat => (
                <div key={stat.type} className="p-4 bg-slate-50 rounded border border-slate-200 text-center">
                  <h4 className="font-medium text-sm mb-2 text-slate-800">
                    {typeLabels[stat.type as keyof typeof typeLabels]}
                  </h4>
                  <div className="text-2xl font-bold text-indigo-600 mb-1">
                    {Math.round(stat.rate)}%
                  </div>
                  <p className="text-xs text-slate-500">
                    {stat.completed} de {stat.total} completadas
                  </p>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${stat.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievement Summary */}
      <Card className="bg-white border border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Award className="w-5 h-5" />
            Logros y Tendencias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-lg">
              <TrendingUp className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-bold text-lg">Productividad</h3>
              <p className="text-sm opacity-90">
                {completionRate >= 80 ? 'Excelente' : 
                 completionRate >= 60 ? 'Buena' : 
                 completionRate >= 40 ? 'Regular' : 'Necesita mejora'}
              </p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-600 to-green-800 text-white rounded-lg">
              <CheckSquare className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-bold text-lg">Tareas Completadas</h3>
              <p className="text-sm opacity-90">
                {completedTasks.length} en {getPeriodLabel().toLowerCase()}
              </p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-lg">
              <Target className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-bold text-lg">Meta de Eficiencia</h3>
              <p className="text-sm opacity-90">
                {completionRate >= 75 ? '¡Meta alcanzada!' : `${Math.round(75 - completionRate)}% para la meta`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
