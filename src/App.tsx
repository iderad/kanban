import { useState, useMemo } from 'react';
import { useAuth } from './hooks/useAuth';
import { useTasks } from './hooks/useTasks';
import { useLabels } from './hooks/useLabels';
import { useTeam } from './hooks/useTeam';
import { Board } from './components/Board';
import { CreateTaskModal } from './components/CreateTaskModel';
import { TaskDetailPanel } from './components/TaskDetailPanel';
import { BoardFilters } from './components/BoardFilters';
import { BoardStats } from './components/BoardStats';
import { BoardSkeleton } from './components/Skeleton';
import { ErrorToast } from './components/ErrorToast';
import { theme } from './theme';
import type { TaskWithLabels, Status, Priority } from './types/tasks';

function App() {
  const { user, loading: authLoading } = useAuth();
  const {
    tasks,
    tasksByStatus,
    loading: tasksLoading,
    error,
    setError,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    refreshTaskLabels,
  } = useTasks(user?.id);

  const { labels, createLabel, addLabelToTask, removeLabelFromTask } = useLabels(user?.id);
  const { members } = useTeam(user?.id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskWithLabels | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [labelFilter, setLabelFilter] = useState<string | 'all'>('all');

  // Apply filters
  const filteredTasksByStatus = useMemo(() => {
    const grouped = tasksByStatus();
    const result: Record<Status, TaskWithLabels[]> = {
      todo: [],
      in_progress: [],
      in_review: [],
      done: [],
    };

    for (const status of Object.keys(grouped) as Status[]) {
      result[status] = grouped[status].filter((task) => {
        const matchesSearch = !searchQuery ||
          task.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPriority = priorityFilter === 'all' ||
          task.priority === priorityFilter;
        const matchesLabel = labelFilter === 'all' ||
          task.labels.some((l) => l.id === labelFilter);
        return matchesSearch && matchesPriority && matchesLabel;
      });
    }
    return result;
  }, [tasksByStatus, searchQuery, priorityFilter, labelFilter]);

  // Keep selected task in sync with task updates
  const currentSelectedTask = selectedTask
    ? tasks.find((t) => t.id === selectedTask.id) || selectedTask
    : null;

  if (authLoading || tasksLoading) {
    return (
      <div style={{ height: '100vh', backgroundColor: theme.colors.bg, fontFamily: theme.font.family }}>
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
        </header>
        <BoardSkeleton />
      </div>
    );
  }

  return (
    <div style={{
      height: '100vh',
      backgroundColor: theme.colors.bg,
      fontFamily: theme.font.family,
      display: 'flex',
      flexDirection: 'column',
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
          }}
        >
          + New Task
        </button>
      </header>

      {/* Stats */}
      <BoardStats tasks={tasks} />

      {/* Filters */}
      <BoardFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        labelFilter={labelFilter}
        onLabelChange={setLabelFilter}
        labels={labels}
      />

      {/* Board */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Board
          tasksByStatus={filteredTasksByStatus}
          onDragEnd={(taskId, newStatus) => updateTaskStatus(taskId, newStatus)}
          onTaskClick={(task) => setSelectedTask(task)}
          teamMembers={members}

        />
      </div>

      {/* Detail panel */}
      {currentSelectedTask && (
        <TaskDetailPanel
          task={currentSelectedTask}
          labels={labels}
          onClose={() => setSelectedTask(null)}
          onUpdate={updateTask}
          onDelete={deleteTask}
          onAddLabel={addLabelToTask}
          onRemoveLabel={removeLabelFromTask}
          onCreateLabel={createLabel}
          onRefreshLabels={refreshTaskLabels}
        />
      )}

      {/* Error toast */}
      {error && (
        <ErrorToast
          message={error}
          onDismiss={() => setError(null)}
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