
import { Subject } from '@/types';
import { useLocalStorage } from './useLocalStorage';

const defaultSubjects: Subject[] = [
  { id: '1', name: 'Matemáticas', color: '#3B82F6', code: 'MATH101' },
  { id: '2', name: 'Historia', color: '#EF4444', code: 'HIST201' },
  { id: '3', name: 'Ciencias', color: '#10B981', code: 'SCI301' },
  { id: '4', name: 'Literatura', color: '#8B5CF6', code: 'LIT101' },
];

export function useSubjects() {
  const [subjects, setSubjects] = useLocalStorage<Subject[]>('university-subjects', defaultSubjects);

  const addSubject = (subject: Omit<Subject, 'id'>) => {
    const newSubject: Subject = {
      ...subject,
      id: crypto.randomUUID(),
    };
    setSubjects(prev => [...prev, newSubject]);
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(prev => prev.map(subject => 
      subject.id === id ? { ...subject, ...updates } : subject
    ));
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(subject => subject.id !== id));
  };

  return {
    subjects,
    addSubject,
    updateSubject,
    deleteSubject,
  };
}
