import { Droppable } from '@hello-pangea/dnd';
import { TaskCard } from './TaskCard';
import { theme } from '../theme';
import type { Task, Status } from '../types/tasks.ts';

interface ColumnProps {
  id: Status;
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const COLUMN_ICONS: Record<Status, string> = {
  todo: '○',
  in_progress: '◑',
  in_review: '◕',
  done: '●',
};

export function Column({ id, title, tasks, onTaskClick }: ColumnProps) {
  return (
    <div style={{
      minWidth: '280px',
      width: '280px',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: '0.75rem',
      border: `1px solid ${theme.colors.borderLight}`,
    }}>
      {/* Column header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.75rem',
        padding: '0.25rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.8rem', color: theme.colors.textSecondary }}>
            {COLUMN_ICONS[id]}
          </span>
          <h2 style={{
            fontSize: theme.font.size.sm,
            fontWeight: theme.font.weight.bold,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: theme.colors.textSecondary,
            fontFamily: theme.font.family,
          }}>
            {title}
          </h2>
        </div>
        <span style={{
          fontSize: theme.font.size.xs,
          fontWeight: theme.font.weight.semibold,
          color: theme.colors.textMuted,
          backgroundColor: theme.colors.border,
          borderRadius: '999px',
          padding: '0.1rem 0.5rem',
        }}>
          {tasks.length}
        </span>
      </div>

      {/* Droppable area */}
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              flex: 1,
              overflowY: 'auto',
              minHeight: '100px',
              borderRadius: theme.radius.md,
              padding: '4px',
              transition: 'background-color 0.2s ease',
              backgroundColor: snapshot.isDraggingOver
                ? theme.colors.dropHighlight
                : 'transparent',
            }}
          >
            {/* Empty state */}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: '2.5rem',
                paddingBottom: '2.5rem',
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: theme.colors.border,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.75rem',
                  fontSize: '1.2rem',
                  opacity: 0.5,
                }}>
                  {id === 'done' ? '✓' : '+'}
                </div>
                <p style={{
                  color: theme.colors.textMuted,
                  fontSize: theme.font.size.sm,
                  fontFamily: theme.font.family,
                  fontWeight: theme.font.weight.light,
                }}>
                  {id === 'done' ? 'Nothing completed yet' : 'Drop tasks here'}
                </p>
              </div>
            )}

            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onClick={() => onTaskClick(task)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}