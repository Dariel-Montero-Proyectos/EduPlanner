import React from 'react';
import { CheckSquare, Calendar, Book } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTasks } from '@/hooks/useTasks';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function CompletedView() {
  const { tasks } = useTasks();
  const completedTasks = tasks.filter(task => task.completed);

  const getTypeColor = (type: string) => {
    const colors = {
      homework: 'bg-blue-100 text-blue-800 border-blue-200',
      exam: 'bg-red-100 text-red-800 border-red-200',
      project: 'bg-purple-100 text-purple-800 border-purple-200',
      reading: 'bg-green-100 text-green-800 border-green-200',
      'group-work': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      presentation: 'bg-pink-100 text-pink-800 border-pink-200'
    };
    return colors[type as keyof typeof colors] || 'bg-slate-100 text-slate-800 border-slate-200';
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      homework: 'Tarea',
      exam: 'Examen',
      project: 'Proyecto',
      reading: 'Lectura',
      'group-work': 'Trabajo en Grupo',
      presentation: 'Presentación'
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-lg">
          <CheckSquare className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Tareas Completadas
          </h1>
          <p className="text-slate-600 mt-1">
            ¡Felicitaciones por completar {completedTasks.length} {completedTasks.length === 1 ? 'tarea' : 'tareas'}!
          </p>
        </div>
      </div>

      {completedTasks.length === 0 ? (
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="p-4 bg-slate-50 rounded-full w-fit mx-auto mb-4">
              <CheckSquare className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">
              No hay tareas completadas
            </h3>
            <p className="text-slate-500">
              Cuando completes tareas, aparecerán aquí para que puedas celebrar tus logros
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {completedTasks.map((task) => (
            <Card key={task.id} className="bg-white border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg line-through decoration-green-500 text-slate-600 font-medium">
                      {task.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Book className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <span className="text-sm text-slate-600 font-medium truncate">
                        {task.subject}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className={`${getTypeColor(task.type)} font-medium flex-shrink-0`}>
                    {getTypeLabel(task.type)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Completada: {format(new Date(task.dueDate), 'PP', { locale: es })}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge className="bg-green-50 text-green-700 border border-green-200 font-medium">
                    <CheckSquare className="w-3 h-3 mr-1" />
                    Completada
                  </Badge>
                </div>
                {task.description && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-sm text-slate-600 line-through decoration-slate-400">
                      {task.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}