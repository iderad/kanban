import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useTasks } from './hooks/useTasks';
import { Board } from './components/Board';
import { CreateTaskModal } from './components/CreateTaskModel.tsx';
import type { Task, Status } from './types/tasks.ts';

function App() {
  const { user, loading: authLoading } = useAuth();
  const {
    tasksByStatus,
    loading: tasksLoading,
    error,
    setError,
    createTask,
    updateTaskStatus,
  } = useTasks(user?.id);

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (authLoading || tasksLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        color: '#6b7280',
      }}>
        Loading your board...
      </div>
    );
  }

  const handleDragEnd = (taskId: string, newStatus: Status) => {
    updateTaskStatus(taskId, newStatus);
  };

  const handleTaskClick = (task: Task) => {
    // You'll expand this later into a detail panel
    console.log('Clicked task:', task);
  };

  return (
    <div style={{ height: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 1.5rem',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#fff',
      }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Task Board</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: '0.875rem',
          }}
        >
          + New Task
        </button>
      </header>

      {/* Error toast */}
      {error && (
        <div
          onClick={() => setError(null)}
          style={{
            position: 'fixed',
            bottom: '1rem',
            right: '1rem',
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid #fecaca',
            cursor: 'pointer',
            zIndex: 100,
            fontSize: '0.875rem',
          }}
        >
          {error} (click to dismiss)
        </div>
      )}

      {/* Board */}
      <Board
        tasksByStatus={tasksByStatus()}
        onDragEnd={handleDragEnd}
        onTaskClick={handleTaskClick}
      />

      {/* Create modal */}
      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={createTask}
      />
    </div>
  );
}

export default App;