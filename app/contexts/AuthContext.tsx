import { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { fetchUserAvatar } from '../lib/microsoftGraph';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  avatarUrl: string;
  refreshAvatar: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  avatarUrl: '',
  refreshAvatar: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [session, setSession] = useState<Session | null>(null);

  // 获取 Microsoft Graph 头像
  const getMicrosoftAvatar = async (currentSession: Session | null) => {
    if (!currentSession?.provider_token) {
      console.log('AuthProvider: No provider token available for avatar fetch');
      return;
    }

    try {
      console.log('AuthProvider: Fetching Microsoft avatar');
      const graphAvatarUrl = await fetchUserAvatar(currentSession.provider_token);
      
      if (graphAvatarUrl) {
        console.log('AuthProvider: Microsoft avatar fetched successfully');
        setAvatarUrl(graphAvatarUrl);
      } else {
        // 使用默认头像或用户已有的 avatar_url
        const fallbackAvatar = user?.user_metadata?.avatar_url || '';
        setAvatarUrl(fallbackAvatar);
      }
    } catch (error) {
      console.error('AuthProvider: Error fetching Microsoft avatar', error);
    }
  };

  // 刷新头像的公共方法
  const refreshAvatar = async () => {
    await getMicrosoftAvatar(session);
  };

  useEffect(() => {
    console.log('AuthProvider: Initializing auth state');
    
    // Check active sessions and sets the user
    const initializeAuth = async () => {
      try {
        console.log('AuthProvider: Getting session');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthProvider: Error getting session', error);
          setLoading(false);
          return;
        }
        
        const { session } = data;
        console.log('AuthProvider: Session retrieved', { 
          hasSession: !!session,
          userId: session?.user?.id,
          provider: session?.user?.app_metadata?.provider
        });
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // 如果有会话，获取用户头像
        if (session) {
          await getMicrosoftAvatar(session);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('AuthProvider: Unexpected error', err);
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('AuthProvider: Auth state changed', { 
        event: _event,
        hasSession: !!session,
        userId: session?.user?.id,
        provider: session?.user?.app_metadata?.provider
      });
      
      setSession(session);
      setUser(session?.user ?? null);
      
      // 当登录状态改变时，获取新的头像
      if (session && _event === 'SIGNED_IN') {
        await getMicrosoftAvatar(session);
      }
      
      setLoading(false);
    });

    return () => {
      console.log('AuthProvider: Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    console.log('AuthProvider: Signing out');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('AuthProvider: Error signing out', error);
      }
    } catch (err) {
      console.error('AuthProvider: Unexpected error during sign out', err);
    } finally {
      setUser(null);
      setSession(null);
      setAvatarUrl('');
      setLoading(false);
      console.log('AuthProvider: Sign out complete');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, avatarUrl, refreshAvatar }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 