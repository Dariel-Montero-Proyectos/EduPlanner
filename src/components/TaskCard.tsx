import React from 'react';
import { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Clock, BookOpen, AlertTriangle, Trash2 } from 'lucide-react';
import { formatDate, isOverdue, isToday, isTomorrow, daysUntil } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (task: Task) => void;
  compactMode?: boolean; // Nueva prop para modo compacto
}

const taskTypeLabels = {
  homework: 'Tarea',
  'group-work': 'Trabajo Grupo',
  reading: 'Lectura',
  exam: 'Examen',
  project: 'Proyecto',
  presentation: 'Presentación'
};

const priorityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-blue-100 text-blue-800 border-blue-200',
  high: 'bg-red-100 text-red-800 border-red-200'
};

export function TaskCard({ 
  task, 
  onToggleComplete, 
  onDelete, 
  onEdit,
  compactMode = false // Valor por defecto para modo compacto
}: TaskCardProps) {
  const dueDate = new Date(task.dueDate);
  const overdue = isOverdue(dueDate) && !task.completed;
  const today = isToday(dueDate);
  const tomorrow = isTomorrow(dueDate);
  const daysLeft = daysUntil(dueDate);

  const getUrgencyInfo = () => {
    if (overdue) return { text: 'Vencida', color: 'text-red-600', icon: AlertTriangle };
    if (today) return { text: 'Hoy', color: 'text-orange-600', icon: Clock };
    if (tomorrow) return { text: 'Mañana', color: 'text-blue-600', icon: Clock };
    if (daysLeft <= 3 && daysLeft > 0) return { text: `${daysLeft} días`, color: 'text-indigo-600', icon: Calendar };
    return null;
  };

  const urgencyInfo = getUrgencyInfo();

  return (
    <div className={cn(
      "p-2 border rounded-lg transition-all duration-200 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700",
      task.completed ? 'opacity-70' : 'hover:shadow-sm',
      compactMode ? 'text-xs' : 'text-sm', // Tamaño de texto variable
      overdue && !task.completed && "border-red-200 bg-red-50/30"
    )}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-1">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => onToggleComplete(task.id)}
              className={compactMode ? "h-4 w-4" : "h-5 w-5"}
            />
            <h4 className={cn(
              "font-medium truncate",
              task.completed ? 'line-through text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-slate-200',
              compactMode ? 'text-xs' : 'text-sm'
            )}>
              {task.name}
            </h4>
          </div>
          
          <div className="flex flex-wrap items-center gap-1 mt-1">
            <Badge className={cn(
              "px-1.5 py-0.5",
              priorityColors[task.priority],
              compactMode ? 'text-[0.65rem]' : 'text-xs'
            )}>
              {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
            </Badge>
            
            {task.subject && (
              <Badge variant="outline" className={cn(
                "border-slate-300 dark:border-slate-600",
                compactMode ? 'text-[0.65rem] px-1.5 py-0.5' : 'text-xs'
              )}>
                {task.subject}
              </Badge>
            )}
            
            {urgencyInfo && (
              <Badge variant="outline" className={cn(
                "flex items-center gap-1",
                urgencyInfo.color,
                compactMode ? 'text-[0.65rem] px-1.5 py-0.5' : 'text-xs'
              )}>
                <urgencyInfo.icon className="w-3 h-3" />
                {urgencyInfo.text}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task.id)}
            className={cn(
              "text-slate-400 hover:text-red-500",
              compactMode ? 'h-5 w-5' : 'h-6 w-6'
            )}
          >
            <Trash2 className={compactMode ? "w-3 h-3" : "w-4 h-4"} />
          </Button>
        </div>
      </div>
      
      {!compactMode && task.description && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate">
          {task.description}
        </p>
      )}
    </div>
  );
}