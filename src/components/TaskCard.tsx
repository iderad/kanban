import { Draggable } from '@hello-pangea/dnd';
import type { Task } from '../types/tasks.ts';

interface TaskCardProps {
  task: Task;
  index: number;
  onClick: () => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  high: '#ef4444',
  normal: '#3b82f6',
  low: '#6b7280',
};

export function TaskCard({ task, index, onClick }: TaskCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          style={{
            padding: '0.75rem',
            marginBottom: '0.5rem',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: snapshot.isDragging
              ? '0 8px 24px rgba(0,0,0,0.15)'
              : '0 1px 3px rgba(0,0,0,0.08)',
            cursor: 'grab',
            transition: 'box-shadow 0.2s ease',
            // Merge with any styles from the library
            ...provided.draggableProps.style,
          }}
        >
          {/* Priority indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.375rem',
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: PRIORITY_COLORS[task.priority],
            }} />
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              color: PRIORITY_COLORS[task.priority],
            }}>
              {task.priority}
            </span>
          </div>

          {/* Title */}
          <p style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#1f2937',
            marginBottom: task.due_date ? '0.5rem' : 0,
          }}>
            {task.title}
          </p>

          {/* Due date */}
          {task.due_date && (
            <span style={{
              fontSize: '0.75rem',
              color: new Date(task.due_date) < new Date()
                ? '#ef4444'   // overdue = red
                : '#9ca3af',
            }}>
              Due {new Date(task.due_date).toLocaleDateString()}
            </span>
          )}
        </div>
      )}
    </Draggable>
  );
}