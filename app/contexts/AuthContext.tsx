import { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { fetchUserAvatar } from '../lib/microsoftGraph';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  avatarUrl: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  avatarUrl: null
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    console.log('AuthProvider: Initializing auth state');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthProvider: Auth state changed', session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        // 同步用户到 users 表
        const { error: upsertError } = await supabase
          .from('users')
          .upsert({
            id: session.user.id,
            email: session.user.email,
            username: session.user.email?.split('@')[0] || 'user',
            is_admin: false
          }, {
            onConflict: 'id'
          });

        if (upsertError) {
          console.error('Error syncing user:', upsertError);
        }

        // 获取 Microsoft 头像
        try {
          console.log('AuthProvider: Fetching Microsoft avatar');
          const response = await fetch('https://graph.microsoft.com/v1.0/me/photo/$value', {
            headers: {
              'Authorization': `Bearer ${session.provider_token}`
            }
          });
          
          if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setAvatarUrl(url);
            console.log('AuthProvider: Microsoft avatar fetched successfully');
          }
        } catch (error) {
          console.error('Error fetching Microsoft avatar:', error);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAvatarUrl(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, avatarUrl }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 