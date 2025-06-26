
import { Note } from '@/types';
import { useLocalStorage } from './useLocalStorage';

export function useNotes() {
  const [notes, setNotes] = useLocalStorage<Note[]>('university-notes', []);

  const addNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...noteData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, ...updates, updatedAt: new Date() }
        : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const togglePin = (id: string) => {
    setNotes(prev => prev.map(note =>
      note.id === id
        ? { ...note, pinned: !note.pinned, updatedAt: new Date() }
        : note
    ));
  };

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
  };
}
