import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';
import { Task, TaskType, Priority } from '@/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useSubjects } from '@/hooks/useSubjects';

interface AddTaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onCancel?: () => void;
}

export function AddTaskForm({ onSubmit, onCancel }: AddTaskFormProps) {
  const { subjects } = useSubjects();
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    dueDate: new Date(),
    type: 'homework' as TaskType,
    priority: 'medium' as Priority,
    description: '',
    completed: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.subject) return;
    
    onSubmit(formData);
    setFormData({
      name: '',
      subject: '',
      dueDate: new Date(),
      type: 'homework',
      priority: 'medium',
      description: '',
      completed: false
    });
  };

  return (
    <Card className="bg-white border border-slate-200 mx-0 md:mx-auto max-w-full md:max-w-2xl shadow-sm">
      <CardHeader className="p-3 md:p-6 bg-white border-b border-slate-100">
        <CardTitle className="text-slate-800 font-semibold text-base md:text-xl">
          Nueva Tarea
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taskName" className="text-slate-700 font-medium text-sm">
                Nombre de la tarea
              </Label>
              <Input
                id="taskName"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ej: Ensayo sobre la Revolución Francesa"
                className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="text-slate-700 font-medium text-sm">
                Materia
              </Label>
              <Select 
                value={formData.subject} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
              >
                <SelectTrigger className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                  <SelectValue placeholder="Selecciona una materia" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 shadow-lg">
                  {subjects.map((subject) => (
                    <SelectItem 
                      key={subject.id} 
                      value={subject.name}
                      className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer"
                    >
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-700 font-medium text-sm">
                Fecha límite
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-white border-slate-200 hover:bg-slate-50 focus:border-blue-500 focus:ring-blue-500/20",
                      !formData.dueDate && "text-slate-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
                    {formData.dueDate ? format(formData.dueDate, "PPP") : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white border-slate-200 shadow-lg" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dueDate}
                    onSelect={(date) => date && setFormData(prev => ({ ...prev, dueDate: date }))}
                    initialFocus
                    className="p-3 bg-white"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="text-slate-700 font-medium text-sm">
                Tipo
              </Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: TaskType) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 shadow-lg">
                  <SelectItem value="homework" className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer">
                    Tarea
                  </SelectItem>
                  <SelectItem value="group-work" className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer">
                    Trabajo en Grupo
                  </SelectItem>
                  <SelectItem value="reading" className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer">
                    Lectura
                  </SelectItem>
                  <SelectItem value="exam" className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer">
                    Examen
                  </SelectItem>
                  <SelectItem value="project" className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer">
                    Proyecto
                  </SelectItem>
                  <SelectItem value="presentation" className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer">
                    Presentación
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-slate-700 font-medium text-sm">
                Prioridad
              </Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value: Priority) => setFormData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 shadow-lg">
                  <SelectItem value="low" className="hover:bg-emerald-50 focus:bg-emerald-50 cursor-pointer">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      Baja
                    </span>
                  </SelectItem>
                  <SelectItem value="medium" className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Media
                    </span>
                  </SelectItem>
                  <SelectItem value="high" className="hover:bg-red-50 focus:bg-red-50 cursor-pointer">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Alta
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-700 font-medium text-sm">
              Descripción (opcional)
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detalles adicionales sobre la tarea..."
              className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 resize-none"
              rows={3}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              type="submit" 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 border-0 shadow-sm transition-colors"
            >
              Agregar Tarea
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 bg-white border-slate-300 text-slate-700 hover:bg-slate-50 font-medium py-2.5 transition-colors"
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}