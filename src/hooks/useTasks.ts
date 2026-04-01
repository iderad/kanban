import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Task, TaskWithLabels, Label, Status } from '../types/tasks';

export function useTasks(userId: string | undefined) {
  const [tasks, setTasks] = useState<TaskWithLabels[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    // Fetch tasks
    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: true });

    if (tasksError) {
      setError(tasksError.message);
      setLoading(false);
      return;
    }

    // Fetch all task_labels with label info
    const { data: taskLabelsData } = await supabase
      .from('task_labels')
      .select('task_id, label_id, labels:label_id(*)');

    // Build a map of task_id -> labels
    const labelMap: Record<string, Label[]> = {};
    if (taskLabelsData) {
      taskLabelsData.forEach((tl: any) => {
        if (!labelMap[tl.task_id]) labelMap[tl.task_id] = [];
        if (tl.labels) labelMap[tl.task_id].push(tl.labels as Label);
      });
    }

    // Merge labels into tasks
    const tasksWithLabels: TaskWithLabels[] = (tasksData as Task[]).map((task) => ({
      ...task,
      labels: labelMap[task.id] || [],
    }));

    setTasks(tasksWithLabels);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const tasksByStatus = useCallback(() => {
    const grouped: Record<Status, TaskWithLabels[]> = {
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

  const createTask = async (
    taskData: Pick<Task, 'title' | 'description' | 'priority' | 'due_date'>
  ) => {
    if (!userId) return null;

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

    const newTask: TaskWithLabels = { ...(data as Task), labels: [] };
    setTasks((prev) => [...prev, newTask]);
    return data;
  };

  const updateTaskStatus = async (taskId: string, newStatus: Status) => {
    const previousTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskId);

    if (error) {
      setTasks(previousTasks);
      setError(`Failed to update task: ${error.message}`);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    const previousTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
    );

    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId);

    if (error) {
      setTasks(previousTasks);
      setError(`Failed to update task: ${error.message}`);
    }
  };

  const deleteTask = async (taskId: string) => {
    const previousTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    const { error } = await supabase.from('tasks').delete().eq('id', taskId);

    if (error) {
      setTasks(previousTasks);
      setError(`Failed to delete task: ${error.message}`);
    }
  };

  // Call this after adding/removing a label to refresh label data
  const refreshTaskLabels = async (taskId: string) => {
    const { data } = await supabase
      .from('task_labels')
      .select('label_id, labels:label_id(*)')
      .eq('task_id', taskId);

    const labels: Label[] = data
      ? data.map((tl: any) => tl.labels as Label).filter(Boolean)
      : [];

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, labels } : t))
    );
  };

  return {
    tasks,
    tasksByStatus,
    loading,
    error,
    setError,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    refreshTaskLabels,
  };
}