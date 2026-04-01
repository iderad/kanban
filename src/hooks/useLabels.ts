import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Label } from '../types/tasks';

export function useLabels(userId: string | undefined) {
  const [labels, setLabels] = useState<Label[]>([]);

  useEffect(() => {
    if (!userId) return;

    const fetchLabels = async () => {
      const { data } = await supabase
        .from('labels')
        .select('*')
        .order('created_at', { ascending: true });

      if (data) setLabels(data as Label[]);
    };

    fetchLabels();
  }, [userId]);

  const createLabel = async (name: string, color: string) => {
    if (!userId) return null;

    const { data, error } = await supabase
      .from('labels')
      .insert({ name, color, user_id: userId })
      .select()
      .single();

    if (error) return null;
    setLabels((prev) => [...prev, data as Label]);
    return data;
  };

  const deleteLabel = async (labelId: string) => {
    const prev = [...labels];
    setLabels((l) => l.filter((lb) => lb.id !== labelId));

    const { error } = await supabase.from('labels').delete().eq('id', labelId);
    if (error) setLabels(prev);
  };

  const addLabelToTask = async (taskId: string, labelId: string) => {
    const { error } = await supabase
      .from('task_labels')
      .insert({ task_id: taskId, label_id: labelId });

    return !error;
  };

  const removeLabelFromTask = async (taskId: string, labelId: string) => {
    const { error } = await supabase
      .from('task_labels')
      .delete()
      .eq('task_id', taskId)
      .eq('label_id', labelId);

    return !error;
  };

  return { labels, createLabel, deleteLabel, addLabelToTask, removeLabelFromTask };
}