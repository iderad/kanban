import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { COLUMNS, type Status } from '../types/tasks.ts';
import { Column } from './Column';
import type { Task } from '../types/tasks.ts';

interface BoardProps {
  tasksByStatus: Record<Status, Task[]>;
  onDragEnd: (taskId: string, newStatus: Status) => void;
  onTaskClick: (task: Task) => void;
}

export function Board({ tasksByStatus, onDragEnd, onTaskClick }: BoardProps) {

  const handleDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;

    // Dropped outside a column or in the same spot
    if (!destination) return;

    const newStatus = destination.droppableId as Status;
    onDragEnd(draggableId, newStatus);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div style={{
        display: 'flex',
        gap: '1rem',
        padding: '1.5rem',
        overflowX: 'auto',
        height: 'calc(100vh - 80px)', // leave room for header
      }}>
        {COLUMNS.map((column) => (
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={tasksByStatus[column.id]}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>
    </DragDropContext>
  );
}