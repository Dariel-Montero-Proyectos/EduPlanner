
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Target, Edit2, Trash2, Check, Clock, Dumbbell, Moon, Apple, Book } from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';
import { Habit } from '@/types';
import { cn } from '@/lib/utils';

export function HabitsView() {
  const { habits, addHabit, updateHabit, deleteHabit, toggleComplete } = useHabits();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const [formData, setFormData] = useState({
    name: '',
    type: 'study' as Habit['type'],
    target: 1,
    unit: '',
  });

  const habitTypeIcons = {
    study: Book,
    sleep: Moon,
    exercise: Dumbbell,
    nutrition: Apple,
    other: Target,
  };

  const habitTypeLabels = {
    study: 'Estudio',
    sleep: 'Sueño',
    exercise: 'Ejercicio',
    nutrition: 'Nutrición',
    other: 'Otro',
  };

  const habitTypeColors = {
    study: 'bg-blue-100 text-blue-800',
    sleep: 'bg-purple-100 text-purple-800',
    exercise: 'bg-emerald-100 text-emerald-800',
    nutrition: 'bg-indigo-100 text-indigo-800',
    other: 'bg-slate-100 text-slate-800',
  };

  const today = new Date().toISOString().split('T')[0];
  const selectedDateObj = new Date(selectedDate);
  
  const habitsForDate = habits.filter(habit => {
    const habitDate = new Date(habit.date).toISOString().split('T')[0];
    return habitDate === selectedDate;
  });

  const completedHabitsForDate = habitsForDate.filter(habit => habit.completed);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.unit.trim()) return;

    const habitData = {
      ...formData,
      date: new Date(selectedDate),
      completed: false,
    };

    if (editingHabit) {
      updateHabit(editingHabit.id, habitData);
      setEditingHabit(null);
    } else {
      addHabit(habitData);
    }

    setFormData({
      name: '',
      type: 'study',
      target: 1,
      unit: '',
    });
    setShowAddForm(false);
  };

  const handleEdit = (habit: Habit) => {
    setFormData({
      name: habit.name,
      type: habit.type,
      target: habit.target,
      unit: habit.unit,
    });
    setEditingHabit(habit);
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingHabit(null);
    setFormData({
      name: '',
      type: 'study',
      target: 1,
      unit: '',
    });
  };

  const getDayLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Fecha inválida";
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dateIso = date.toISOString().split('T')[0];
    const todayIso = today.toISOString().split('T')[0];
    const yesterdayIso = yesterday.toISOString().split('T')[0];
    const tomorrowIso = tomorrow.toISOString().split('T')[0];
    
    if (dateIso === todayIso) return 'Hoy';
    if (dateIso === yesterdayIso) return 'Ayer';
    if (dateIso === tomorrowIso) return 'Mañana';
    
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const getWeeklyStats = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayHabits = habits.filter(habit => {
        const habitDate = new Date(habit.date).toISOString().split('T')[0];
        return habitDate === date;
      });
      
      const completedCount = dayHabits.filter(habit => habit.completed).length;
      const totalCount = dayHabits.length;
      
      return {
        date,
        completed: completedCount,
        total: totalCount,
        rate: totalCount > 0 ? (completedCount / totalCount) * 100 : 0,
      };
    }).reverse();
  };

  const weeklyStats = getWeeklyStats();

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Hábitos Personales
          </h1>
          <p className="text-slate-600">
            Registro de hábitos de estudio, sueño, ejercicio y alimentación
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Nuevo Hábito
        </Button>
      </div>

      {/* Date Selector */}
      <Card className="bg-white border border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-slate-700">Fecha:</span>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full sm:w-48 px-3 py-2 border rounded-md text-sm"
            />
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>{getDayLabel(selectedDate)}</span>
              <Badge variant="outline" className="border-slate-300">
                {completedHabitsForDate.length}/{habitsForDate.length} completados
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Target className="w-5 h-5" />
              {editingHabit ? 'Editar Hábito' : 'Nuevo Hábito'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  placeholder="Nombre del hábito"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="px-3 py-2 border rounded-md w-full"
                />
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Habit['type'] })}
                  className="px-3 py-2 border rounded-md bg-white text-sm text-slate-700 w-full"
                >
                  <option value="study">Estudio</option>
                  <option value="sleep">Sueño</option>
                  <option value="exercise">Ejercicio</option>
                  <option value="nutrition">Nutrición</option>
                  <option value="other">Otro</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Meta"
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: Number(e.target.value) })}
                    min="1"
                    required
                    className="px-3 py-2 border rounded-md flex-1"
                  />
                  <input
                    placeholder="Unidad"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    required
                    className="px-3 py-2 border rounded-md flex-1"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
                  {editingHabit ? 'Actualizar Hábito' : 'Guardar Hábito'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Habits for Selected Date */}
        <div className="lg:col-span-2">
          <Card className="bg-white border border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Target className="w-5 h-5" />
                Hábitos del {getDayLabel(selectedDate)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {habitsForDate.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-500 mb-2">
                    No hay hábitos para este día
                  </h3>
                  <p className="text-slate-500 mb-4">
                    ¡Agrega algunos hábitos para comenzar!
                  </p>
                  <Button
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Hábito
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {habitsForDate.map(habit => {
                    const IconComponent = habitTypeIcons[habit.type];
                    return (
                      <div
                        key={habit.id}
                        className={`p-4 border rounded-lg transition-all duration-200 ${
                          habit.completed 
                            ? 'bg-emerald-50 border-emerald-200' 
                            : 'bg-white hover:shadow-sm border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <Button
                              variant={habit.completed ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleComplete(habit.id)}
                              className={`w-8 h-8 p-0 ${
                                habit.completed 
                                  ? 'bg-emerald-600 hover:bg-emerald-700' 
                                  : 'hover:bg-emerald-50'
                              }`}
                            >
                              {habit.completed && <Check className="w-4 h-4" />}
                            </Button>
                            <IconComponent className="w-5 h-5 text-slate-600" />
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-medium ${habit.completed ? 'line-through text-slate-600' : 'text-slate-900'}`}>
                                {habit.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={`text-xs ${habitTypeColors[habit.type]}`}>
                                  {habitTypeLabels[habit.type]}
                                </Badge>
                                <span className="text-xs text-slate-500">
                                  Meta: {habit.target} {habit.unit}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(habit)}
                              className="h-8 w-8 p-0 hover:bg-blue-50"
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteHabit(habit.id)}
                              className="h-8 w-8 p-0 hover:bg-red-50 text-red-500"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Weekly Progress */}
        <div>
          <Card className="bg-white border border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Target className="w-5 h-5" />
                Progreso Semanal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weeklyStats.map(stat => (
                  <div key={stat.date} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200">
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {stat.date === today ? 'Hoy' : 
                         getDayLabel(stat.date).split(' ')[0]}
                      </p>
                      <p className="text-xs text-slate-500">
                        {stat.completed}/{stat.total} hábitos
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${stat.rate}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-600 w-8">
                        {Math.round(stat.rate)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-white border border-slate-200 mt-4">
            <CardHeader>
              <CardTitle className="text-sm text-slate-800">Estadísticas Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {weeklyStats.reduce((acc, stat) => acc + stat.completed, 0)}
                </div>
                <p className="text-xs text-slate-500">Hábitos completados esta semana</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">
                  {Math.round(weeklyStats.reduce((acc, stat) => acc + stat.rate, 0) / weeklyStats.length) || 0}%
                </div>
                <p className="text-xs text-slate-500">Promedio semanal</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
