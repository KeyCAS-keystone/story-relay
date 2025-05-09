import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';
import AdminAccess from './AdminAccess';
import Switch from './switch';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, loading, signOut, avatarUrl } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Debug logging
  useEffect(() => {
    console.log('Layout: Auth state:', { user, loading, isLoggedIn: !!user, hasAvatar: !!avatarUrl });
  }, [user, loading, avatarUrl]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // 获取最终显示的头像 URL，优先使用 Microsoft Graph 获取的，其次是元数据中的，最后是占位符
  const displayAvatarUrl = avatarUrl || user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email?.split('@')[0] || 'User'}&background=random`;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <nav className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="w-full px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center pl-10">
                <Link to="/" className="flex items-center space-x-3">
                  <img src="/assets/RS.png" alt="Round Square Logo" className="h-8 w-auto"/>
                  <span className="text-xl font-bold text-gray-800 dark:text-white">
                    Round Square Day Story Relay
                  </span>
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Home
                </Link>
                {user && (
                  <Link
                    to="/submit"
                    className="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Submit Story
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center pr-10">
              <div className="flex items-center space-x-4">
                {loading ? (
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                ) : user ? (
                  <div className="flex items-center pl-6 space-x-3">
                    <img
                      src={displayAvatarUrl}
                      alt="User avatar"
                      className="h-10 w-10 rounded-full"
                    />
                    <button
                      onClick={() => signOut()}
                      className="text-gray-500 dark:text-gray-300 hover:text-gray-700 cursor-pointer dark:hover:text-white text-sm font-medium"
                    >
                      Sign Out
                    </button>
                    
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white text-sm font-medium"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
} 