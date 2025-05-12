import React, { useState, useEffect } from 'react';
import '../styles/switch.css';

const Switch = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false; // Default for SSR or if window is not available
  });

  // 创建或更新 meta 标签
  const updateMetaTag = (dark: boolean) => {
    // 查找现有的 color-scheme meta 标签
    let metaTag = document.querySelector('meta[name="color-scheme"]');
    
    // 如果不存在，创建一个新的
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', 'color-scheme');
      document.head.appendChild(metaTag);
    }
    
    // 设置 meta 标签的 content 属性
    metaTag.setAttribute('content', dark ? 'dark' : 'light');
    
    // 添加一个额外的渲染提示meta标签
    let renderHintTag = document.querySelector('meta[name="theme-mode"]');
    if (!renderHintTag) {
      renderHintTag = document.createElement('meta');
      renderHintTag.setAttribute('name', 'theme-mode');
      document.head.appendChild(renderHintTag);
    }
    renderHintTag.setAttribute('content', dark ? 'dark' : 'light');
    
    // 添加一个强制主题meta标签，防止浏览器自动适应系统主题
    let forceThemeTag = document.querySelector('meta[name="theme-color-scheme"]');
    if (!forceThemeTag) {
      forceThemeTag = document.createElement('meta');
      forceThemeTag.setAttribute('name', 'theme-color-scheme');
      document.head.appendChild(forceThemeTag);
    }
    forceThemeTag.setAttribute('content', dark ? 'dark' : 'light');
  };

  // 应用主题的方法 - 使用直接样式设置和多种属性
  const applyTheme = (dark: boolean) => {
    const root = window.document.documentElement;
    
    if (dark) {
      // 使用多种方式标记深色模式
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.setAttribute('data-mode', 'dark');
      root.setAttribute('data-color-mode', 'dark');
      
      // 直接设置样式属性覆盖任何 CSS
      root.style.setProperty('color-scheme', 'dark', 'important');
      root.style.setProperty('background-color', 'rgb(3, 7, 17)', 'important'); // bg-gray-950
      document.body.style.setProperty('background-color', 'rgb(3, 7, 17)', 'important');
      
      // 添加 CSS 变量覆盖
      root.style.setProperty('--foreground-rgb', '255, 255, 255', 'important');
      root.style.setProperty('--background-start-rgb', '3, 7, 17', 'important');
      root.style.setProperty('--background-end-rgb', '3, 7, 17', 'important');
      
      // 添加更多Tailwind相关的CSS变量
      root.style.setProperty('--tw-text-opacity', '1', 'important');
      root.style.setProperty('--tw-bg-opacity', '1', 'important');
      
      // 组件颜色覆盖
      root.style.setProperty('--card-bg', 'rgb(59, 71, 92)', 'important'); // dark:bg-gray-800 (#3B475C)
      root.style.setProperty('--card-border', 'rgb(75, 85, 99)', 'important'); // dark:border-gray-700
      root.style.setProperty('--card-text', 'rgb(243, 244, 246)', 'important'); // dark:text-gray-100
      
      // 登录页面相关颜色
      root.style.setProperty('--login-bg', 'rgb(3, 7, 17)', 'important');
      root.style.setProperty('--login-text', 'rgb(243, 244, 246)', 'important');
      root.style.setProperty('--heading-text', 'rgb(243, 244, 246)', 'important');
      root.style.setProperty('--button-bg', 'rgb(229, 231, 235)', 'important'); // 浅灰色按钮
      root.style.setProperty('--button-text', 'rgb(31, 41, 55)', 'important'); // 深色文字
      
      // 更新 meta 标签
      updateMetaTag(true);
    } else {
      // 使用多种方式标记浅色模式
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.setAttribute('data-mode', 'light');
      root.setAttribute('data-color-mode', 'light');
      
      // 直接设置样式属性覆盖任何 CSS
      root.style.setProperty('color-scheme', 'light', 'important');
      root.style.setProperty('background-color', 'rgb(243, 244, 246)', 'important'); // bg-gray-100
      document.body.style.setProperty('background-color', 'rgb(243, 244, 246)', 'important');
      
      // 添加 CSS 变量覆盖
      root.style.setProperty('--foreground-rgb', '0, 0, 0', 'important');
      root.style.setProperty('--background-start-rgb', '243, 244, 246', 'important');
      root.style.setProperty('--background-end-rgb', '243, 244, 246', 'important');
      
      // 添加更多Tailwind相关的CSS变量
      root.style.setProperty('--tw-text-opacity', '1', 'important');
      root.style.setProperty('--tw-bg-opacity', '1', 'important');
      
      // 组件颜色覆盖
      root.style.setProperty('--card-bg', 'rgb(243, 244, 246)', 'important'); // bg-gray-100
      root.style.setProperty('--card-border', 'rgb(209, 213, 219)', 'important'); // border-gray-300
      root.style.setProperty('--card-text', 'rgb(31, 41, 55)', 'important'); // text-gray-800
      
      // 登录页面相关颜色
      root.style.setProperty('--login-bg', 'rgb(243, 244, 246)', 'important');
      root.style.setProperty('--login-text', 'rgb(31, 41, 55)', 'important');
      root.style.setProperty('--heading-text', 'rgb(31, 41, 55)', 'important');
      root.style.setProperty('--button-bg', 'rgb(31, 41, 55)', 'important'); // 黑色按钮
      root.style.setProperty('--button-text', 'rgb(255, 255, 255)', 'important'); // 白色文字
      
      // 更新 meta 标签
      updateMetaTag(false);
    }
    
    // 处理登录页面特定元素
    const loginHeadings = document.querySelectorAll('h1[class*="login"], h2[class*="login"], h3[class*="login"], .login-heading, .login-title, [class*="login-heading"], [class*="login-title"]');
    loginHeadings.forEach(el => {
      (el as HTMLElement).style.setProperty('color', dark ? 'rgb(243, 244, 246)' : 'rgb(31, 41, 55)', 'important');
    });
    
    // 强化按钮处理，确保文本颜色不被覆盖
    const themedButtons = document.querySelectorAll('.themed-button, button[class*="themed-button"], [class*="login"] button, [type="submit"]');
    themedButtons.forEach(el => {
      if (dark) {
        (el as HTMLElement).style.setProperty('background-color', 'rgb(229, 231, 235)', 'important');
        (el as HTMLElement).style.setProperty('color', 'rgb(31, 41, 55)', 'important');
        (el as HTMLElement).style.setProperty('border-color', 'rgb(229, 231, 235)', 'important');
      } else {
        (el as HTMLElement).style.setProperty('background-color', 'rgb(31, 41, 55)', 'important');
        (el as HTMLElement).style.setProperty('color', 'rgb(255, 255, 255)', 'important');
        (el as HTMLElement).style.setProperty('border-color', 'rgb(31, 41, 55)', 'important');
      }
      
      // 处理按钮内的所有文本元素
      const buttonTextElements = el.querySelectorAll('*');
      buttonTextElements.forEach(text => {
        if (dark) {
          (text as HTMLElement).style.setProperty('color', 'rgb(31, 41, 55)', 'important');
        } else {
          (text as HTMLElement).style.setProperty('color', 'rgb(255, 255, 255)', 'important');
        }
      });
    });
    
    const loginButtons = document.querySelectorAll('button[class*="login"], .login-button, [class*="login-button"]');
    loginButtons.forEach(el => {
      (el as HTMLElement).style.setProperty('background-color', dark ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)', 'important');
      (el as HTMLElement).style.setProperty('color', dark ? 'rgb(31, 41, 55)' : 'rgb(255, 255, 255)', 'important');
    });
    
    // 强制重绘所有元素
    void document.documentElement.offsetHeight;
    
    // 强制触发所有组件的重新计算样式
    const allElements = document.querySelectorAll('*');
    for (let i = 0; i < Math.min(allElements.length, 100); i++) {
      void (allElements[i] as HTMLElement).offsetHeight;
    }
    
    // 定时器确保样式完全应用
    setTimeout(() => {
      document.body.style.transition = "background-color 0.01s";
      document.body.style.backgroundColor = dark ? 'rgb(3, 7, 17)' : 'rgb(243, 244, 246)';
      setTimeout(() => {
        document.body.style.transition = "";
      }, 50);
    }, 0);
  };
  
  // Effect to apply the theme to the <html> element when isDark changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    applyTheme(isDark);
    
    // 设置一个监视器，每隔一段时间重新应用主题，确保系统主题变化不会影响
    const intervalId = setInterval(() => {
      if (localStorage.getItem('theme')) {
        applyTheme(localStorage.getItem('theme') === 'dark');
      }
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [isDark]);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    // Persist the user's manual choice in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    }
  };

  // Effect to listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return () => {};

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if the user hasn't made a manual choice (i.e., no 'theme' in localStorage)
      if (typeof window !== 'undefined' && !localStorage.getItem('theme')) {
        setIsDark(e.matches);
      } else {
        // 如果用户已经手动选择了主题，确保系统主题变化不会影响
        applyTheme(localStorage.getItem('theme') === 'dark');
      }
    };

    // Set initial theme based on system preference IF no manual choice is stored
    // This check is important if the component mounts after the initial page load logic
    // and ensures consistency if localStorage is cleared or on first visit.
    if (typeof window !== 'undefined' && !localStorage.getItem('theme')) {
      setIsDark(mediaQuery.matches);
    }

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount

  return (
    <div className="theme-switch-wrapper">
      <label className="theme-switch">
        <input 
          type="checkbox" 
          className="theme-switch__checkbox" 
          checked={isDark}
          onChange={toggleTheme}
        />
        <div className="theme-switch__container">
          <div className="theme-switch__clouds" />
          <div className="theme-switch__stars-container">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144 55" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M135.831 3.00688C135.055 3.85027 134.111 4.29946 133 4.35447C134.111 4.40947 135.055 4.85867 135.831 5.71123C136.607 6.55462 136.996 7.56303 136.996 8.72727C136.996 7.95722 137.172 7.25134 137.525 6.59129C137.886 5.93124 138.372 5.39954 138.98 5.00535C139.598 4.60199 140.268 4.39114 141 4.35447C139.88 4.2903 138.936 3.85027 138.16 3.00688C137.384 2.16348 136.996 1.16425 136.996 0C136.996 1.16425 136.607 2.16348 135.831 3.00688ZM31 23.3545C32.1114 23.2995 33.0551 22.8503 33.8313 22.0069C34.6075 21.1635 34.9956 20.1642 34.9956 19C34.9956 20.1642 35.3837 21.1635 36.1599 22.0069C36.9361 22.8503 37.8798 23.2903 39 23.3545C38.2679 23.3911 37.5976 23.602 36.9802 24.0053C36.3716 24.3995 35.8864 24.9312 35.5248 25.5913C35.172 26.2513 34.9956 26.9572 34.9956 27.7273C34.9956 26.563 34.6075 25.5546 33.8313 24.7112C33.0551 23.8587 32.1114 23.4095 31 23.3545ZM0 36.3545C1.11136 36.2995 2.05513 35.8503 2.83131 35.0069C3.6075 34.1635 3.99559 33.1642 3.99559 32C3.99559 33.1642 4.38368 34.1635 5.15987 35.0069C5.93605 35.8503 6.87982 36.2903 8 36.3545C7.26792 36.3911 6.59757 36.602 5.98015 37.0053C5.37155 37.3995 4.88644 37.9312 4.52481 38.5913C4.172 39.2513 3.99559 39.9572 3.99559 40.7273C3.99559 39.563 3.6075 38.5546 2.83131 37.7112C2.05513 36.8587 1.11136 36.4095 0 36.3545ZM56.8313 24.0069C56.0551 24.8503 55.1114 25.2995 54 25.3545C55.1114 25.4095 56.0551 25.8587 56.8313 26.7112C57.6075 27.5546 57.9956 28.563 57.9956 29.7273C57.9956 28.9572 58.172 28.2513 58.5248 27.5913C58.8864 26.9312 59.3716 26.3995 59.9802 26.0053C60.5976 25.602 61.2679 25.3911 62 25.3545C60.8798 25.2903 59.9361 24.8503 59.1599 24.0069C58.3837 23.1635 57.9956 22.1642 57.9956 21C57.9956 22.1642 57.6075 23.1635 56.8313 24.0069ZM81 25.3545C82.1114 25.2995 83.0551 24.8503 83.8313 24.0069C84.6075 23.1635 84.9956 22.1642 84.9956 21C84.9956 22.1642 85.3837 23.1635 86.1599 24.0069C86.9361 24.8503 87.8798 25.2903 89 25.3545C88.2679 25.3911 87.5976 25.602 86.9802 26.0053C86.3716 26.3995 85.8864 26.9312 85.5248 27.5913C85.172 28.2513 84.9956 28.9572 84.9956 29.7273C84.9956 28.563 84.6075 27.5546 83.8313 26.7112C83.0551 25.8587 82.1114 25.4095 81 25.3545ZM136 36.3545C137.111 36.2995 138.055 35.8503 138.831 35.0069C139.607 34.1635 139.996 33.1642 139.996 32C139.996 33.1642 140.384 34.1635 141.16 35.0069C141.936 35.8503 142.88 36.2903 144 36.3545C143.268 36.3911 142.598 36.602 141.98 37.0053C141.372 37.3995 140.886 37.9312 140.525 38.5913C140.172 39.2513 139.996 39.9572 139.996 40.7273C139.996 39.563 139.607 38.5546 138.831 37.7112C138.055 36.8587 137.111 36.4095 136 36.3545ZM101.831 49.0069C101.055 49.8503 100.111 50.2995 99 50.3545C100.111 50.4095 101.055 50.8587 101.831 51.7112C102.607 52.5546 102.996 53.563 102.996 54.7273C102.996 53.9572 103.172 53.2513 103.525 52.5913C103.886 51.9312 104.372 51.3995 104.98 51.0053C105.598 50.602 106.268 50.3911 107 50.3545C105.88 50.2903 104.936 49.8503 104.16 49.0069C103.384 48.1635 102.996 47.1642 102.996 46C102.996 47.1642 102.607 48.1635 101.831 49.0069Z" />
            </svg>
          </div>
          <div className="theme-switch__circle-container">
            <div className="theme-switch__sun-moon-container">
              <div className="theme-switch__moon">
                <div className="theme-switch__spot" />
                <div className="theme-switch__spot" />
                <div className="theme-switch__spot" />
              </div>
            </div>
          </div>
        </div>
      </label>
    </div>
  );
}

export default Switch;
