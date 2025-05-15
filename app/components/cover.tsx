import React, { useEffect, useState } from 'react';

interface CoverProps {
  onHide?: () => void;
}

const Cover: React.FC<CoverProps> = ({ onHide }) => {
  const [showHint, setShowHint] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // 提示动画的计时器
    const hintTimer = setTimeout(() => {
      setShowHint(false);
    }, 3000);

    // 自动消失的计时器
    const hideTimer = setTimeout(() => {
      setIsFading(true);
      // 等待动画完成后再移除组件
      setTimeout(() => {
        setIsVisible(false);
        onHide?.(); // 通知父组件 Cover 已隐藏
      }, 500); // 动画持续时间
    }, 1000); // 从 2000 改为 1000

    return () => {
      clearTimeout(hintTimer);
      clearTimeout(hideTimer);
    };
  }, [onHide]);

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-20px);
            }
            60% {
              transform: translateY(-10px);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}
      </style>
      <div 
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          background: '#CD1D43',
          position: 'relative',
          overflow: 'hidden',
          opacity: isFading ? 0 : 1,
          transition: 'opacity 0.5s ease-out',
        }}
      >
        {/* 左右金色边框（最外层） */}
        <div style={{ position: 'fixed', top: 0, left: 0, width: '8px', height: '100vh', backgroundColor: '#EFB32C', zIndex: 1000 }} />
        <div style={{ position: 'fixed', top: 0, right: 0, width: '8px', height: '100vh', backgroundColor: '#EFB32C', zIndex: 1000 }} />
        {/* 上面金色横线（最外层） */}
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '8px', backgroundColor: '#EFB32C', zIndex: 1000 }} />
        
        {/* 左右红色区域（夹在金色和内容之间） */}
        <div style={{ position: 'fixed', top: 0, left: '4px', width: '45px', height: '100vh', backgroundColor: '#CD1D43', zIndex: 999 }} />
        <div style={{ position: 'fixed', top: 0, right: '4px', width: '45px', height: '100vh', backgroundColor: '#CD1D43', zIndex: 999 }} />
        
        {/* 只保留一个大半圆（2.svg），放大并居中靠下 */}
        <div style={{ 
          position: 'relative', 
          width: '99.6vw', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'flex-end',
          padding: '0 45px',
          height: '100%'
        }}>
          <img 
            src="/assets/3.svg" 
            alt="Round Square" 
            style={{ 
              width: '100%', 
              position: 'relative', 
              bottom: 0,
              zIndex: 2 
            }} 
          />
        </div>
      </div>
    </>
  );
};

export default Cover;
