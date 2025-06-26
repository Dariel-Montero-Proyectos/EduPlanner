
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Trash2 } from 'lucide-react';
import { useSubjects } from '@/hooks/useSubjects';
import { useTasks } from '@/hooks/useTasks';
import { TaskCard } from './TaskCard';

export function SchoolSubjectsView() {
  const { subjects, addSubject, deleteSubject } = useSubjects();
  const { tasks, toggleComplete, deleteTask } = useTasks();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#3B82F6',
    teacher: '',
    classroom: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    addSubject({
      name: formData.name,
      code: '',
      color: formData.color,
      professor: formData.teacher || undefined,
      classroom: formData.classroom || undefined
    });
    
    setFormData({
      name: '',
      color: '#3B82F6',
      teacher: '',
      classroom: ''
    });
    setShowAddForm(false);
  };

  const getSubjectTasks = (subjectName: string) => {
    return tasks.filter(task => task.subject === subjectName);
  };

  const getSubjectStats = (subjectName: string) => {
    const subjectTasks = getSubjectTasks(subjectName);
    const completed = subjectTasks.filter(task => task.completed).length;
    const pending = subjectTasks.length - completed;
    const overdue = subjectTasks.filter(task => !task.completed && new Date(task.dueDate) < new Date()).length;
    
    return { total: subjectTasks.length, completed, pending, overdue };
  };

  const predefinedColors = [
    '#3B82F6', '#EF4444', '#10B981', '#8B5CF6', 
    '#1E40AF', '#EC4899', '#06B6D4', '#4F46E5'
  ];

  const commonSchoolSubjects = [
    'Matemáticas', 'Español', 'Ciencias Naturales', 'Estudios Sociales',
    'Inglés', 'Educación Física', 'Artes', 'Música', 'Tecnología'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Mis Asignaturas
          </h1>
          <p className="text-slate-600">
            Organiza tus materias y tareas escolares
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva Asignatura
        </Button>
      </div>

      {/* Add Subject Form */}
      {showAddForm && (
        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <CardTitle>Agregar Nueva Asignatura</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la asignatura</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Matemáticas"
                  required
                />
                
                {/* Sugerencias de materias comunes */}
                <div className="flex flex-wrap gap-2 mt-2">
                  <p className="text-sm text-slate-600 w-full">Sugerencias:</p>
                  {commonSchoolSubjects.map(subject => (
                    <button
                      key={subject}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, name: subject }))}
                      className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded transition-colors"
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teacher">Profesor/a (opcional)</Label>
                  <Input
                    id="teacher"
                    value={formData.teacher}
                    onChange={(e) => setFormData(prev => ({ ...prev, teacher: e.target.value }))}
                    placeholder="Ej: Prof. García"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="classroom">Aula (opcional)</Label>
                  <Input
                    id="classroom"
                    value={formData.classroom}
                    onChange={(e) => setFormData(prev => ({ ...prev, classroom: e.target.value }))}
                    placeholder="Ej: Aula 205"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2">
                  {predefinedColors.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${formData.color === color ? 'border-slate-400' : 'border-slate-200'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  Agregar Asignatura
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map(subject => {
          const stats = getSubjectStats(subject.name);
          const isSelected = selectedSubject === subject.name;
          
          return (
            <Card 
              key={subject.id} 
              className={`bg-white border border-slate-200 cursor-pointer transition-all duration-200 ${
                isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedSubject(isSelected ? null : subject.name)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: subject.color }}
                    />
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-800">
                        {subject.name}
                      </CardTitle>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSubject(subject.id);
                    }}
                    className="h-6 w-6 p-0 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                
                {subject.professor && (
                  <p className="text-sm text-slate-600">Prof: {subject.professor}</p>
                )}
                
                {subject.classroom && (
                  <Badge variant="outline" className="border-slate-300">
                    {subject.classroom}
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-slate-800">
                      {stats.total}
                    </div>
                    <p className="text-xs text-slate-500">Total</p>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-emerald-600">
                      {stats.completed}
                    </div>
                    <p className="text-xs text-slate-500">Completadas</p>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">
                      {stats.pending}
                    </div>
                    <p className="text-xs text-slate-500">Pendientes</p>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-red-600">
                      {stats.overdue}
                    </div>
                    <p className="text-xs text-slate-500">Vencidas</p>
                  </div>
                </div>

                {stats.total > 0 && (
                  <div className="mt-4">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(stats.completed / stats.total) * 100}%`,
                          backgroundColor: subject.color 
                        }}
                      />
                    </div>
                    <p className="text-xs text-center mt-1 text-slate-500">
                      {Math.round((stats.completed / stats.total) * 100)}% completado
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Subject Tasks Detail */}
      {selectedSubject && (
        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <BookOpen className="w-5 h-5" />
              Tareas de {selectedSubject}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getSubjectTasks(selectedSubject).length === 0 ? (
                <p className="text-center text-slate-500 py-8">
                  No hay tareas registradas para esta asignatura
                </p>
              ) : (
                getSubjectTasks(selectedSubject).map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={toggleComplete}
                    onDelete={deleteTask}
                  />
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}