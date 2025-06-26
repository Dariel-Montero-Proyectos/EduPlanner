
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

export function SubjectsView() {
  const { subjects, addSubject, deleteSubject } = useSubjects();
  const { tasks, toggleComplete, deleteTask } = useTasks();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    color: '#3B82F6',
    professor: '',
    credits: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) return;
    
    addSubject({
      name: formData.name,
      code: formData.code,
      color: formData.color,
      professor: formData.professor || undefined,
      credits: formData.credits ? parseInt(formData.credits) : undefined
    });
    
    setFormData({
      name: '',
      code: '',
      color: '#3B82F6',
      professor: '',
      credits: ''
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
    '#6366F1', '#EC4899', '#06B6D4', '#84CC16'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Mis Materias
          </h1>
          <p className="text-slate-600">
            Organiza tus cursos y tareas por materia
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva Materia
        </Button>
      </div>

      {/* Add Subject Form */}
      {showAddForm && (
        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <CardTitle>Agregar Nueva Materia</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre de la materia</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej: Cálculo Diferencial"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Código</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="Ej: MATH101"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="professor">Profesor (opcional)</Label>
                  <Input
                    id="professor"
                    value={formData.professor}
                    onChange={(e) => setFormData(prev => ({ ...prev, professor: e.target.value }))}
                    placeholder="Ej: Dr. García"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credits">Créditos (opcional)</Label>
                  <Input
                    id="credits"
                    type="number"
                    value={formData.credits}
                    onChange={(e) => setFormData(prev => ({ ...prev, credits: e.target.value }))}
                    placeholder="Ej: 3"
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
                  Agregar Materia
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
                      <p className="text-sm text-slate-600">{subject.code}</p>
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
                
                {subject.credits && (
                  <Badge variant="outline" className="border-slate-300">
                    {subject.credits} créditos
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
                    <div className="text-lg font-bold text-green-600">
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
                  No hay tareas registradas para esta materia
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
