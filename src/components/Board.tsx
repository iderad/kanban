import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { COLUMNS, type Status } from '../types/tasks';
import { Column } from './Column';
import type { TaskWithLabels } from '../types/tasks';
import type { TeamMember } from '../hooks/useTeam';

interface BoardProps {
  tasksByStatus: Record<Status, TaskWithLabels[]>;
  onDragEnd: (taskId: string, newStatus: Status) => void;
  onTaskClick: (task: TaskWithLabels) => void;
  teamMembers: TeamMember[];
}

export function Board({ tasksByStatus, onDragEnd, onTaskClick, teamMembers }: BoardProps) {
  const handleDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
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
        height: 'calc(100vh - 72px)',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'thin',
      }}>
        {COLUMNS.map((column) => (
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={tasksByStatus[column.id]}
            onTaskClick={onTaskClick}
            teamMembers={teamMembers}
          />
        ))}
      </div>
    </DragDropContext>
  );
}