export type Status = 'todo' | 'in_progress' | 'in_review' | 'done';
export type Priority = '1' | '2' | '3' | '4' | '5';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: Status;
  priority: Priority;
  due_date: string | null;
  user_id: string;
  created_at: string;
}

export const COLUMNS: { id: Status; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'in_review', title: 'In Review' },
  { id: 'done', title: 'Done' },
];

// Priority 1 = highest (red), 5 = lowest (blue)
// Gradient: red → orange → yellow → teal → blue
export const PRIORITY_CONFIG: Record<Priority, { color: string; label: string }> = {
  '1': { color: '#dc2626', label: 'Critical' },
  '2': { color: '#ea580c', label: 'High' },
  '3': { color: '#eab308', label: 'Medium' },
  '4': { color: '#0d9488', label: 'Low' },
  '5': { color: '#3b82f6', label: 'Minimal' },
};