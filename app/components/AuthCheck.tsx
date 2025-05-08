import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  console.log('AuthCheck: Current state:', { user, loading });

  if (loading) {
    console.log('AuthCheck: Still loading, showing spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    console.log('AuthCheck: No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('AuthCheck: User authenticated, rendering children');
  return <>{children}</>;
} 