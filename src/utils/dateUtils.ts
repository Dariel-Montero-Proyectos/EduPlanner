
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

export function getWeekEnd(date: Date): Date {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  return weekEnd;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function isOverdue(date: Date): boolean {
  return new Date(date) < new Date();
}

export function isToday(date: Date): boolean {
  const today = new Date();
  const checkDate = new Date(date);
  return today.toDateString() === checkDate.toDateString();
}

export function isTomorrow(date: Date): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const checkDate = new Date(date);
  return tomorrow.toDateString() === checkDate.toDateString();
}

export function daysUntil(date: Date): number {
  const today = new Date();
  const targetDate = new Date(date);
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
