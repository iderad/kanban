import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Task, Status } from '../types/tasks.ts';

export function useTasks(userId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all tasks on mount
  useEffect(() => {
    if (!userId) return;

    const fetchTasks = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        setError(error.message);
      } else {
        setTasks(data as Task[]);
      }
      setLoading(false);
    };

    fetchTasks();
  }, [userId]);

  // Helper: group tasks by status (used by the board)
  const tasksByStatus = useCallback(() => {
    const grouped: Record<Status, Task[]> = {
      todo: [],
      in_progress: [],
      in_review: [],
      done: [],
    };
    tasks.forEach((task) => {
      grouped[task.status].push(task);
    });
    return grouped;
  }, [tasks]);

  // Create a new task
  const createTask = async (
    taskData: Pick<Task, 'title' | 'description' | 'priority' | 'due_date'>
  ) => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        ...taskData,
        status: 'todo' as Status,
        user_id: userId,
      })
      .select()
      .single();

    if (error) {
      setError(error.message);
      return null;
    }

    // Add the new task to local state
    setTasks((prev) => [...prev, data as Task]);
    return data;
  };

  // Update a task's status (used by drag-and-drop)
  const updateTaskStatus = async (taskId: string, newStatus: Status) => {
    // Save old state for rollback
    const previousTasks = [...tasks];

    // Optimistic update — UI updates instantly
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    // Then sync to database
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskId);

    if (error) {
      // Rollback on failure
      setTasks(previousTasks);
      setError(`Failed to update task: ${error.message}`);
    }
  };

  // Delete a task
  const deleteTask = async (taskId: string) => {
    const previousTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      setTasks(previousTasks);
      setError(`Failed to delete task: ${error.message}`);
    }
  };

  return {
    tasks,
    tasksByStatus,
    loading,
    error,
    setError,
    createTask,
    updateTaskStatus,
    deleteTask,
  };
}