'use client';

import React from 'react';
import type { User } from '@supabase/supabase-js';
import { getSupabase } from '@/src/lib/supabase/client';
import { isSupabaseConfigured } from '@/src/lib/supabase/config';

type AuthContextValue = {
  authEnabled: boolean;
  isAuthReady: boolean;
  user: User | null;
  signOut: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authEnabled = isSupabaseConfigured();
  const [user, setUser] = React.useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = React.useState(!authEnabled);

  React.useEffect(() => {
    const supabase = getSupabase();

    if (!supabase) {
      setUser(null);
      setIsAuthReady(true);
      return;
    }

    let isActive = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!isActive) {
        return;
      }

      setUser(data.user ?? null);
      setIsAuthReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isActive) {
        return;
      }

      setUser(session?.user ?? null);
      setIsAuthReady(true);
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, [authEnabled]);

  const signOut = React.useCallback(async () => {
    const supabase = getSupabase();

    if (!supabase) {
      return;
    }

    await supabase.auth.signOut({ scope: 'global' });
  }, []);

  const value = React.useMemo(
    () => ({
      authEnabled,
      isAuthReady,
      user,
      signOut,
    }),
    [authEnabled, isAuthReady, signOut, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
