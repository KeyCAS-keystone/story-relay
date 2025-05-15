import React, { useState, useRef, useEffect } from 'react';
import Cover from './cover';
import StoryTree from './StoryTree';

interface PageContainerProps {
  nodes: any[];
}

const PageContainer: React.FC<PageContainerProps> = ({ nodes }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showCover, setShowCover] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const newY = e.touches[0].clientY;
    setCurrentY(newY);
    
    const deltaY = newY - startY;
    if (deltaY < -100) { // 向上滑动超过100px时触发
      setShowCover(false);
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setCurrentY(0);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY < -50) { // 向上滚动超过50px时触发
      setShowCover(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      style={{
        height: '100vh',
        overflowY: 'auto',
        position: 'relative',
      }}
      onWheel={handleWheel}
    >
      {/* Main Content */}
      <div style={{
        height: '100vh',
        position: 'relative',
        zIndex: 1,
      }}>
        <StoryTree nodes={nodes} />
      </div>

      {/* Cover Overlay */}
      {showCover && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2000,
            transform: `translateY(${currentY - startY}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Cover onSwipeUp={() => setShowCover(false)} />
        </div>
      )}
    </div>
  );
};

export default PageContainer; 