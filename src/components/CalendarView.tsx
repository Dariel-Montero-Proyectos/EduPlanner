import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAcademicEvents } from '@/hooks/useAcademicEvents';
import { useSubjects } from '@/hooks/useSubjects';
import { AcademicEvent } from '@/types';

export function CalendarView() {
  const { events, addEvent, updateEvent, deleteEvent } = useAcademicEvents();
  const { subjects } = useSubjects();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AcademicEvent | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    type: 'important' as AcademicEvent['type'],
    subject: '',
    description: '',
  });

  const eventTypeColors = {
    exam: 'bg-red-100 text-red-800 border-red-200',
    assignment: 'bg-blue-100 text-blue-800 border-blue-200',
    holiday: 'bg-green-100 text-green-800 border-green-200',
    important: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  };

  const eventTypeLabels = {
    exam: 'Examen',
    assignment: 'Tarea/Proyecto',
    holiday: 'Feriado',
    important: 'Importante',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date) return;

    const eventData = {
      ...formData,
      date: new Date(formData.date),
      subject: formData.subject || undefined,
      description: formData.description || undefined,
    };

    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
      setEditingEvent(null);
    } else {
      addEvent(eventData);
    }

    setFormData({
      title: '',
      date: '',
      type: 'important',
      subject: '',
      description: '',
    });
    setShowAddForm(false);
  };

  const handleEdit = (event: AcademicEvent) => {
    setFormData({
      title: event.title,
      date: event.date.toISOString().split('T')[0],
      type: event.type,
      subject: event.subject || '',
      description: event.description || '',
    });
    setEditingEvent(event);
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingEvent(null);
    setFormData({
      title: '',
      date: '',
      type: 'important',
      subject: '',
      description: '',
    });
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };

  const getEventsForMonth = () => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === currentMonth.getMonth() &&
             eventDate.getFullYear() === currentMonth.getFullYear();
    });
  };

  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-academic font-bold text-slate-800">
            Calendario Académico
          </h1>
          <p className="text-slate-600">
            Fechas importantes, exámenes y entregas ({events.length} eventos)
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Nuevo Evento
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Calendar className="w-5 h-5" />
              {editingEvent ? 'Editar Evento' : 'Nuevo Evento'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Título del evento"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as AcademicEvent['type'] })}
                  className="px-3 py-2 border rounded-md bg-white text-sm text-slate-700"
                >
                  <option value="important">Importante</option>
                  <option value="exam">Examen</option>
                  <option value="assignment">Tarea/Proyecto</option>
                  <option value="holiday">Feriado</option>
                </select>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="px-3 py-2 border rounded-md bg-white text-sm text-slate-700"
                >
                  <option value="">Sin materia específica</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.name}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              <Textarea
                placeholder="Descripción (opcional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="resize-none"
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
                  {editingEvent ? 'Actualizar Evento' : 'Guardar Evento'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Month Navigation */}
        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={goToPreviousMonth} size="sm">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <CardTitle className="text-lg text-slate-800">
                {currentMonth.toLocaleDateString('es-ES', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </CardTitle>
              <Button variant="outline" onClick={goToNextMonth} size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline" onClick={goToCurrentMonth} size="sm" className="self-center">
              Ir a hoy
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <h3 className="font-medium text-slate-800">
                Eventos este mes ({getEventsForMonth().length})
              </h3>
              {getEventsForMonth().length === 0 ? (
                <p className="text-slate-500 text-sm">No hay eventos este mes</p>
              ) : (
                <div className="space-y-2">
                  {getEventsForMonth()
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map(event => (
                      <div key={event.id} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={`text-xs ${eventTypeColors[event.type]}`}>
                              {eventTypeLabels[event.type]}
                            </Badge>
                            <span className="text-xs text-slate-500">
                              {new Date(event.date).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                          <p className="font-medium text-sm truncate">{event.title}</p>
                          {event.subject && (
                            <p className="text-xs text-slate-500">{event.subject}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(event)}
                            className="h-7 w-7 p-0"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteEvent(event.id)}
                            className="h-7 w-7 p-0 text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Calendar className="w-5 h-5" />
              Próximos Eventos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No hay eventos próximos</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="p-3 bg-slate-50 rounded border border-slate-200 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${eventTypeColors[event.type]}`}>
                          {eventTypeLabels[event.type]}
                        </Badge>
                        <span className="text-sm font-medium text-slate-800">
                          {Math.ceil((new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} días
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">
                        {new Date(event.date).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    <h4 className="font-medium text-sm mb-1">{event.title}</h4>
                    {event.subject && (
                      <p className="text-xs text-slate-600 mb-1">{event.subject}</p>
                    )}
                    {event.description && (
                      <p className="text-xs text-slate-500 line-clamp-2">{event.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* All Events List */}
      {events.length > 0 && (
        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-800">Todos los Eventos ({events.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {events
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map(event => (
                  <div key={event.id} className="p-3 bg-slate-50 rounded border border-slate-200 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={`text-xs ${eventTypeColors[event.type]}`}>
                        {eventTypeLabels[event.type]}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(event)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteEvent(event.id)}
                          className="h-6 w-6 p-0 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <h4 className="font-medium text-sm mb-1">{event.title}</h4>
                    <p className="text-xs text-slate-600 mb-1">
                      {new Date(event.date).toLocaleDateString('es-ES', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    {event.subject && (
                      <p className="text-xs text-slate-500 mb-1">{event.subject}</p>
                    )}
                    {event.description && (
                      <p className="text-xs text-slate-500 line-clamp-2">{event.description}</p>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}