import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';
import AdminAccess from './AdminAccess';
import Switch from './switch';
import Loader from './Loader';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, loading, signOut, avatarUrl } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // 添加主题状态监听
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  // 监听html.dark类的变化
  useEffect(() => {
    if (typeof MutationObserver === 'undefined') return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const htmlElement = mutation.target as HTMLElement;
          setIsDarkMode(htmlElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

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
    <>
      {/* 全屏背景覆盖层 - 最高优先级 */}
      <div 
        className="fixed inset-0 w-full h-full" 
        style={{ 
          zIndex: -100, 
          backgroundColor: isDarkMode ? 'rgb(3, 7, 18)' : 'rgb(243, 244, 246)',
          transition: 'background-color 0.3s ease'
        }}
      />

      <div className="min-h-screen bg-transparent flex flex-col">
        {/* Top gold border */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            backgroundColor: '#EFB32C',
            zIndex: 1000
          }}
        />
        <nav className="relative" style={{ 
          backgroundColor: 'var(--nav-bg)', 
          color: 'var(--nav-text)', 
          height: '45px', 
          display: 'flex', 
          alignItems: 'center',
          marginTop: '8px',
          zIndex: 100
        }}>
          {/* Left gold border for navbar */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '8px',
              height: '45px',
              backgroundColor: '#EFB32C',
              zIndex: 1010
            }}
          />
          {/* Right gold border for navbar */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '8px',
              height: '45px',
              backgroundColor: '#EFB32C',
              zIndex: 1010
            }}
          />
          {/* Middle shadow for navbar, not covering gold borders */}
          <div
          />
          <div className="w-full px-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center pl-8">
                  <Link to="/" className="flex items-center space-x-2">
                    <img src="/assets/RS.png" alt="Round Square Logo" className="h-7 w-auto"/>
                    <span className="text-lg font-bold" style={{ color: 'var(--nav-text)' }}>
                      Round Square Day Story Relay
                    </span>
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-6">
                  <Link
                    to="/"
                    className="border-transparent hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 border-b-2 text-sm font-medium"
                    style={{ color: 'var(--nav-text)' }}
                  >
                    Home
                  </Link>
                  {user && (
                    <Link
                      to="/submit"
                      className="border-transparent hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 border-b-2 text-sm font-medium"
                      style={{ color: 'var(--nav-text)' }}
                    >
                      Submit Story
                    </Link>
                  )}
                </div>
              </div>
              <div className="flex items-center pr-8">
                <div className="flex items-center space-x-3">
                  <Switch />
                  {loading ? (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center">
                      <Loader />
                    </div>
                  ) : user ? (
                    <div className="flex items-center pl-3 space-x-2">
                      <img
                        src={displayAvatarUrl}
                        alt="User avatar"
                        className="h-8 w-8 rounded-full"
                      />
                      <button
                        onClick={() => signOut()}
                        className="hover:text-gray-700 cursor-pointer text-sm font-medium"
                        style={{ color: 'var(--nav-text)' }}
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      className="hover:text-gray-700 text-sm font-medium"
                      style={{ color: 'var(--nav-text)' }}
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-grow max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 relative z-10">
          {children}
        </main>

        {/* Bottom gold border */}
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '8px',
            backgroundColor: '#EFB32C',
            zIndex: 1000
          }}
        />
      </div>
    </>
  );
} 