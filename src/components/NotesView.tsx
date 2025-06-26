
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Pin, PinOff, Edit2, Trash2, StickyNote, Search } from 'lucide-react';
import { useNotes } from '@/hooks/useNotes';
import { useSubjects } from '@/hooks/useSubjects';
import { Note } from '@/types';

export function NotesView() {
  const { notes, addNote, updateNote, deleteNote, togglePin } = useNotes();
  const { subjects } = useSubjects();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    subject: '',
  });

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !selectedSubject || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const pinnedNotes = filteredNotes.filter(note => note.pinned);
  const unpinnedNotes = filteredNotes.filter(note => !note.pinned);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingNote) {
      updateNote(editingNote.id, formData);
      setEditingNote(null);
    } else {
      addNote({
        ...formData,
        pinned: false,
      });
    }

    setFormData({ title: '', content: '', subject: '' });
    setShowAddForm(false);
  };

  const handleEdit = (note: Note) => {
    setFormData({
      title: note.title,
      content: note.content,
      subject: note.subject || '',
    });
    setEditingNote(note);
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingNote(null);
    setFormData({ title: '', content: '', subject: '' });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-academic font-bold text-slate-800">
            Notas Rápidas
          </h1>
          <p className="text-slate-600">
            Espacio para ideas, recordatorios y bosquejos ({notes.length} notas)
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Nueva Nota
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Buscar notas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="px-3 py-2 border rounded-md bg-white text-sm text-slate-700 w-full sm:w-48"
        >
          <option value="">Todas las materias</option>
          {subjects.map(subject => (
            <option key={subject.id} value={subject.name}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <StickyNote className="w-5 h-5" />
              {editingNote ? 'Editar Nota' : 'Nueva Nota'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Título de la nota"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 border rounded-md bg-white text-sm text-slate-700"
              >
                <option value="">Sin materia específica</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </select>
              <Textarea
                placeholder="Escribe tu nota aquí..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={4}
                className="resize-none"
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
                  {editingNote ? 'Actualizar Nota' : 'Guardar Nota'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Notes Grid */}
      <div className="space-y-6">
        {/* Pinned Notes */}
        {pinnedNotes.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Pin className="w-4 h-4 text-blue-600" />
              Notas Fijadas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pinnedNotes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={handleEdit}
                  onDelete={deleteNote}
                  onTogglePin={togglePin}
                />
              ))}
            </div>
          </div>
        )}

        {/* Regular Notes */}
        {unpinnedNotes.length > 0 && (
          <div>
            {pinnedNotes.length > 0 && (
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                Otras Notas
              </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unpinnedNotes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={handleEdit}
                  onDelete={deleteNote}
                  onTogglePin={togglePin}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredNotes.length === 0 && (
          <Card className="bg-white border border-slate-200">
            <CardContent className="text-center py-12">
              <StickyNote className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-500 mb-2">
                {searchTerm || selectedSubject ? 'No se encontraron notas' : 'No hay notas aún'}
              </h3>
              <p className="text-slate-500 mb-4">
                {searchTerm || selectedSubject 
                  ? 'Intenta con otros términos de búsqueda'
                  : '¡Crea tu primera nota para comenzar!'
                }
              </p>
              {!searchTerm && !selectedSubject && (
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Nota
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}

function NoteCard({ note, onEdit, onDelete, onTogglePin }: NoteCardProps) {
  return (
    <Card className={`bg-white border border-slate-200 hover:shadow-md transition-all duration-200 ${note.pinned ? 'ring-2 ring-blue-500' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-medium text-slate-800 truncate pr-2">
            {note.title}
          </CardTitle>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTogglePin(note.id)}
              className="h-8 w-8 p-0 hover:bg-blue-50"
            >
              {note.pinned ? (
                <Pin className="w-3 h-3 text-blue-600" />
              ) : (
                <PinOff className="w-3 h-3 text-slate-500" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(note)}
              className="h-8 w-8 p-0 hover:bg-blue-50"
            >
              <Edit2 className="w-3 h-3 text-slate-500" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(note.id)}
              className="h-8 w-8 p-0 hover:bg-red-50 text-red-500"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
        {note.subject && (
          <Badge variant="outline" className="text-xs w-fit border-slate-300">
            {note.subject}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-slate-600 line-clamp-4 mb-3">
          {note.content || 'Sin contenido'}
        </p>
        <p className="text-xs text-slate-500">
          {new Date(note.updatedAt).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </CardContent>
    </Card>
  );
}