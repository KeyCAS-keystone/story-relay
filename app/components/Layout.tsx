import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';
import AdminAccess from './AdminAccess';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, loading, signOut, avatarUrl } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-xl font-bold text-gray-800">
                  Story Relay
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/submit"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Submit Story
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              {loading ? (
                // Show loading indicator instead of null
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
              ) : user ? (
                <div className="relative" ref={dropdownRef}>
                  <img
                    src={displayAvatarUrl}
                    alt="Profile"
                    className="w-10 h-10 rounded-full cursor-pointer border border-gray-300 object-cover"
                    onClick={() => setDropdownOpen((open) => !open)}
                  />
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                      <div className="px-4 py-2 text-sm text-gray-500 border-b">
                        {user.email?.split('@')[0] || user.email}
                      </div>
                      <button
                        onClick={async () => { await signOut(); setDropdownOpen(false); window.location.href = '/login'; }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="bg-white shadow-lg mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              © 2024 Story Relay. All rights reserved.
            </div>
            <AdminAccess />
          </div>
        </div>
      </footer>
    </div>
  );
} 