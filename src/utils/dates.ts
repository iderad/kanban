export function getDueDateStatus(dueDate: string | null): 'overdue' | 'due-soon' | 'upcoming' | null {
  if (!dueDate) return null;

  const due = new Date(dueDate);
  const now = new Date();
  // Reset time to compare dates only
  now.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diffMs = due.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return 'overdue';
  if (diffDays <= 1) return 'due-soon';
  return 'upcoming';
}

export function formatDueDate(dueDate: string): string {
  return new Date(dueDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}