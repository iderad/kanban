import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface TeamMember {
  id: string;
  name: string;
  color: string;
  user_id: string;
}

export function useTeam(userId: string | undefined) {
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    if (!userId) return;

    supabase
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) setMembers(data as TeamMember[]);
      });
  }, [userId]);

  const addMember = async (name: string, color: string) => {
    if (!userId) return null;
    const { data, error } = await supabase
      .from('team_members')
      .insert({ name, color, user_id: userId })
      .select()
      .single();

    if (error) return null;
    setMembers((prev) => [...prev, data as TeamMember]);
    return data;
  };

  const removeMember = async (memberId: string) => {
    const prev = [...members];
    setMembers((m) => m.filter((mb) => mb.id !== memberId));

    const { error } = await supabase.from('team_members').delete().eq('id', memberId);
    if (error) setMembers(prev);
  };

  return { members, addMember, removeMember };
}