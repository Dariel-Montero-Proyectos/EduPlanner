
import { AcademicEvent } from '@/types';
import { useLocalStorage } from './useLocalStorage';

export function useAcademicEvents() {
  const [events, setEvents] = useLocalStorage<AcademicEvent[]>('university-events', []);

  const addEvent = (eventData: Omit<AcademicEvent, 'id'>) => {
    const newEvent: AcademicEvent = {
      ...eventData,
      id: crypto.randomUUID(),
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (id: string, updates: Partial<AcademicEvent>) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, ...updates } : event
    ));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
  };
}
