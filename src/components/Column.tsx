import { Droppable } from '@hello-pangea/dnd';
import { TaskCard } from './TaskCard.tsx';
import type { Task, Status } from '../types/tasks.ts';

interface ColumnProps {
  id: Status;
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export function Column({ id, title, tasks, onTaskClick }: ColumnProps) {
  return (
    <div style={{
      minWidth: '280px',
      width: '280px',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f4f5f7',
      borderRadius: '12px',
      padding: '0.75rem',
    }}>
      {/* Column header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.75rem',
        padding: '0 0.25rem',
      }}>
        <h2 style={{
          fontSize: '0.875rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: '#6b7280',
        }}>
          {title}
        </h2>
        <span style={{
          fontSize: '0.75rem',
          color: '#9ca3af',
          backgroundColor: '#e5e7eb',
          borderRadius: '999px',
          padding: '0.125rem 0.5rem',
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
              borderRadius: '8px',
              padding: '4px',
              transition: 'background-color 0.2s ease',
              // Highlight column when dragging over it
              backgroundColor: snapshot.isDraggingOver
                ? '#e0e7ff'
                : 'transparent',
            }}
          >
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <p style={{
                textAlign: 'center',
                color: '#9ca3af',
                fontSize: '0.8rem',
                paddingTop: '2rem',
              }}>
                No tasks yet
              </p>
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