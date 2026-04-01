import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there's already a session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setLoading(false);
      } else {
        // No session exists — create an anonymous one
        supabase.auth.signInAnonymously().then(({ data, error }) => {
          if (error) {
            console.error('Anonymous sign-in failed:', error);
          } else {
            setUser(data.user);
          }
          setLoading(false);
        });
      }
    });

    // Listen for auth state changes (handles token refresh, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}