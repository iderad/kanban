import { theme } from '../theme';
import { getDueDateStatus } from '../utils/dates';
import type { TaskWithLabels } from '../types/tasks';

interface BoardStatsProps {
  tasks: TaskWithLabels[];
}

export function BoardStats({ tasks }: BoardStatsProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'done').length;
  const overdue = tasks.filter(
    (t) => t.status !== 'done' && getDueDateStatus(t.due_date) === 'overdue'
  ).length;
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length;

  const stats = [
    { label: 'Total', value: total, color: theme.colors.textPrimary },
    { label: 'In Progress', value: inProgress, color: '#eab308' },
    { label: 'Completed', value: completed, color: '#22c55e' },
    { label: 'Overdue', value: overdue, color: overdue > 0 ? theme.colors.error : theme.colors.textMuted },
  ];

  return (
    <div style={{
      display: 'flex',
      gap: '1.5rem',
      padding: '0.6rem 1.5rem',
      borderBottom: `1px solid ${theme.colors.borderLight}`,
      backgroundColor: theme.colors.surface,
      flexWrap: 'wrap',
    }}>
      {stats.map((stat) => (
        <div key={stat.label} style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
          <span style={{
            fontSize: theme.font.size.lg,
            fontWeight: theme.font.weight.bold,
            color: stat.color,
            fontFamily: theme.font.family,
          }}>
            {stat.value}
          </span>
          <span style={{
            fontSize: theme.font.size.xs,
            color: theme.colors.textMuted,
            fontFamily: theme.font.family,
            fontWeight: theme.font.weight.medium,
          }}>
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}