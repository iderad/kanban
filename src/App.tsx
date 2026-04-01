import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useTasks } from './hooks/useTasks';
import { Board } from './components/Board';
import { CreateTaskModal } from './components/CreateTaskModel';
import { BoardSkeleton } from './components/Skeleton';
import { ErrorToast } from './components/ErrorToast';
import { theme } from './theme';
import type { Task, Status } from './types/tasks';

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
  const [lastAction, setLastAction] = useState<{ taskId: string; status: Status } | null>(null);

  const handleDragEnd = (taskId: string, newStatus: Status) => {
    setLastAction({ taskId, status: newStatus });
    updateTaskStatus(taskId, newStatus);
  };

  const handleTaskClick = (task: Task) => {
    console.log('Clicked task:', task);
  };

  const handleRetry = () => {
    if (lastAction) {
      updateTaskStatus(lastAction.taskId, lastAction.status);
    }
    setError(null);
  };

  return (
    <div style={{
      height: '100vh',
      backgroundColor: theme.colors.bg,
      fontFamily: theme.font.family,
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 1.5rem',
        borderBottom: `1px solid ${theme.colors.border}`,
        backgroundColor: theme.colors.card,
      }}>
        <h1 style={{
          fontSize: theme.font.size.xl,
          fontWeight: theme.font.weight.bold,
          color: theme.colors.textPrimary,
        }}>
          Task Board
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: theme.colors.accent,
            color: '#fff',
            border: 'none',
            borderRadius: theme.radius.md,
            cursor: 'pointer',
            fontFamily: theme.font.family,
            fontWeight: theme.font.weight.semibold,
            fontSize: theme.font.size.base,
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = theme.colors.accentHover)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = theme.colors.accent)
          }
        >
          + New Task
        </button>
      </header>

      {/* Loading skeleton or board */}
      {authLoading || tasksLoading ? (
        <BoardSkeleton />
      ) : (
        <Board
          tasksByStatus={tasksByStatus()}
          onDragEnd={handleDragEnd}
          onTaskClick={handleTaskClick}
        />
      )}

      {/* Error toast with retry */}
      {error && (
        <ErrorToast
          message={error}
          onDismiss={() => setError(null)}
          onRetry={handleRetry}
        />
      )}

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