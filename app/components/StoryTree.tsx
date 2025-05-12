import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import AdminAccess from './AdminAccess';

interface Node {
  id: string;
  content: string;
  summary: string;
  parent_id: string | null;
  position: number;
  author_id: string;
  author_email?: string;
  author_username?: string;
  created_at: string;
  level: number;
}

interface StoryTreeProps {
  nodes: Node[];
}

interface ConnectionLine {
  parentId: string;
  childId: string;
  path: string;
}

export default function StoryTree({ nodes }: StoryTreeProps) {
  const [navbarHeight, setNavbarHeight] = useState<number>(0);
  const [footerHeight, setFooterHeight] = useState<number>(0);
  const [viewportCenter, setViewportCenter] = useState<number>(0);
  const [cardPositions, setCardPositions] = useState<Map<string, number>>(new Map());
  const [connectionLines, setConnectionLines] = useState<ConnectionLine[]>([]);
  const [showFooter, setShowFooter] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const scrollStopTimeoutId = useRef<NodeJS.Timeout | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateLayoutMetrics = () => {
      const navbar = document.querySelector('nav');
      const footer = document.querySelector('footer');
      const navH = navbar?.getBoundingClientRect().height || 0;
      const footH = footer?.getBoundingClientRect().height || 0;
      setNavbarHeight(navH);
      setFooterHeight(footH);
      const availableHeight = window.innerHeight - navH - footH;
      setViewportCenter(navH + availableHeight / 2);
    };
    updateLayoutMetrics();
    window.addEventListener('resize', updateLayoutMetrics);
    return () => window.removeEventListener('resize', updateLayoutMetrics);
  }, []);

  const calculateConnectionLines = useCallback(() => {
    if (!svgRef.current || !contentWrapperRef.current || cardRefs.current.size === 0) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const lines: ConnectionLine[] = [];
    nodes.forEach(node => {
      if (!node.parent_id) return;
      const childElement = cardRefs.current.get(node.id);
      const parentElement = cardRefs.current.get(node.parent_id);
      if (!childElement || !parentElement) return;
      const childRect = childElement.getBoundingClientRect();
      const parentRect = parentElement.getBoundingClientRect();
      const parentX = parentRect.left + parentRect.width / 2 - svgRect.left;
      const parentY = parentRect.bottom - svgRect.top;
      const childX = childRect.left + childRect.width / 2 - svgRect.left;
      const childY = childRect.top - svgRect.top;
      const midY = (parentY + childY) / 2;
      const curveRadius = 20; // 圆角半径
      
      const isChildOnLeft = childX < parentX;
      
      // 使用二次贝塞尔曲线 (Q command) 创建更平滑且方向正确的圆角路径
      const path = `M${parentX},${parentY} 
                   L${parentX},${midY - curveRadius} 
                   Q${parentX},${midY} ${isChildOnLeft ? parentX - curveRadius : parentX + curveRadius},${midY} 
                   L${isChildOnLeft ? childX + curveRadius : childX - curveRadius},${midY} 
                   Q${childX},${midY} ${childX},${midY + curveRadius} 
                   L${childX},${childY}`;
      
      lines.push({ parentId: node.parent_id, childId: node.id, path });
    });
    setConnectionLines(lines);
  }, [nodes]);

  useEffect(() => {
    if (cardPositions.size > 0 && cardRefs.current.size > 0) {
      calculateConnectionLines();
    }
  }, [cardPositions, calculateConnectionLines]);

  useEffect(() => {
    const performCardPositionUpdate = () => {
      const newPositions = new Map<string, number>();
      cardRefs.current.forEach((card, id) => {
        if (card) {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.top + rect.height / 2;
          newPositions.set(id, cardCenter);
        }
      });
      
      // Removed the redundant direct calculation and setting of connectionLines here.
      // The useEffect hook that depends on cardPositions will handle this.
      
      // 最后更新位置状态
      setCardPositions(newPositions);
    };

    const requestPositionUpdate = () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      animationFrameId.current = requestAnimationFrame(performCardPositionUpdate);
    };

    (window as any).__requestPositionUpdate = requestPositionUpdate;

    // 初始化时立即请求更新
    requestPositionUpdate();

    const scroller = containerRef.current;
    if (scroller) {
      scroller.addEventListener('scroll', requestPositionUpdate, { passive: true });
    }
    window.addEventListener('resize', requestPositionUpdate);
    return () => {
      if (scroller) {
        scroller.removeEventListener('scroll', requestPositionUpdate);
      }
      window.removeEventListener('resize', requestPositionUpdate);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      delete (window as any).__requestPositionUpdate;
    };
  }, [nodes]);

  const nodesByLevel = nodes.reduce((acc, node) => {
    const level = node.level || 1;
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(node);
    return acc;
  }, {} as Record<number, Node[]>);

  const starterNodes = nodesByLevel[1] || [];
  const allLevels = Object.keys(nodesByLevel).map(Number).sort((a, b) => a - b);
  const starterLevel = 1;

  const calculateScale = (nodeId: string): number => {
    const cardCenter = cardPositions.get(nodeId);
    if (cardCenter === undefined || viewportCenter === 0) return 1;
    const distance = Math.abs(cardCenter - viewportCenter);
    const containerEffectiveHeight = window.innerHeight - navbarHeight - footerHeight;
    const maxDistance = containerEffectiveHeight / 2;
    const distanceRatio = Math.min(distance / maxDistance, 1);
    
    const MAX_VIEWPORT_SCALE = 1.1;
    const MIN_VIEWPORT_SCALE = 0.7;

    return MIN_VIEWPORT_SCALE + (MAX_VIEWPORT_SCALE - MIN_VIEWPORT_SCALE) * (1 - distanceRatio);
  };

  const getBaseCardStyle = (nodeId: string): React.CSSProperties => {
    const isCurrentlyHovered = hoveredCardId === nodeId;
    let isRelatedToHovered = false;

    if (hoveredCardId && !isCurrentlyHovered) {
      const hoveredNode = nodes.find(n => n.id === hoveredCardId);
      if (hoveredNode) {
        // Is the current card (nodeId) the parent of the hovered card?
        if (hoveredNode.parent_id === nodeId) {
          isRelatedToHovered = true;
        }
        // Is the current card (nodeId) a child of the hovered card?
        const currentNodeDetails = nodes.find(n => n.id === nodeId);
        if (currentNodeDetails && currentNodeDetails.parent_id === hoveredCardId) {
          isRelatedToHovered = true;
        }
      }
    }

    const shouldBeBlurred = hoveredCardId !== null && !isCurrentlyHovered && !isRelatedToHovered;
    
    return {
      borderRadius: '1rem',
      display: 'flex',
      flexDirection: 'column', 
      overflow: 'hidden',
      transition: 'all 0.2s ease-out', 
      minHeight: '80px', 
      zIndex: (isCurrentlyHovered || isRelatedToHovered) ? 3 : 2, // Elevate zIndex for hovered and related cards
      filter: shouldBeBlurred ? 'blur(2.5px)' : 'none',
      opacity: shouldBeBlurred ? 0.55 : 1,
      transformOrigin: 'center center',
      position: 'relative',
      border: '2px solid #CD1D43', // Keeping 2px border as per last confirmed state
    };
  };

  // 动态计算每层卡片宽度
  const getDynamicCardWidth = (cardCount: number) => {
    const maxCardWidth = 700;
    const minCardWidth = 220;
    const containerPadding = 64; // px, 两边留白
    const cardGap = 40; // px, 卡片间距
    const availableWidth = typeof window !== 'undefined' ? window.innerWidth - containerPadding * 2 : maxCardWidth * cardCount;
    if (cardCount <= 1) return maxCardWidth;
    return Math.max(
      minCardWidth,
      Math.min(
        maxCardWidth,
        (availableWidth - (cardCount - 1) * cardGap) / cardCount
      )
    );
  };

  // 修改 getCardStyle，支持传入 baseWidth
  const getCardStyle = (nodeId: string, level: number, baseWidth: number): React.CSSProperties => {
    const levelScale = Math.max(0.8, 1 - Math.abs(level - starterLevel) * 0.05);
    const viewportScale = calculateScale(nodeId);
    const baseScale = levelScale * viewportScale;
    let finalWidthScale = baseScale;
    let finalHeightScale = baseScale;
    const baseHeight = 230;

    const isHovered = hoveredCardId === nodeId;
    if (isHovered) {
      finalWidthScale *= 1.25;
      finalHeightScale *= 2.1;
    }

    return {
      ...getBaseCardStyle(nodeId),
      width: `${baseWidth * finalWidthScale}px`,
      height: `${baseHeight * finalHeightScale}px`,
      fontSize: `${1.2 * baseScale}rem`,
      fontWeight: level === starterLevel ? 600 : 500,
    };
  };

  const getContentStyle = (scale: number): React.CSSProperties => ({
    overflowY: 'auto', 
    height: '100%',
    width: '100%',
    padding: '1rem 1.5rem',
    textAlign: 'left',
  });

  const [svgHeight, setSvgHeight] = useState('100%');
  useEffect(() => {
    if (contentWrapperRef.current) {
      setSvgHeight(`${contentWrapperRef.current.scrollHeight}px`);
    }
  }, [nodes, cardPositions]);

  const handleMouseEnter = (nodeId: string) => {
    setHoveredCardId(nodeId);
    setTimeout(() => {
      if ((window as any).__requestPositionUpdate) {
        (window as any).__requestPositionUpdate();
      }
    }, 220);
  };

  const handleMouseLeave = () => {
    setHoveredCardId(null);
    setTimeout(() => {
      if ((window as any).__requestPositionUpdate) {
         (window as any).__requestPositionUpdate();
      }
    }, 220);
  };

  const handleWriteFromHere = (nodeId: string) => {
    navigate('/submit', { state: { parentNodeId: nodeId } });
  };

  const buttonClasses = "px-3 py-1 bg-[#CD1D43] text-white text-xs font-medium rounded-md hover:bg-[#DC1D43] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#CD1D43] transition-colors flex-shrink-0";

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const distanceToBottom = scrollHeight - scrollTop - clientHeight;
      setShowFooter(distanceToBottom < 50);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // Initial check
      handleScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <>
      {/* Left gold border (outermost) */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '8px',
          height: '100vh',
          backgroundColor: '#EFB32C',
          zIndex: 100
        }}
      />
      {/* Right gold border (outermost) */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '8px',
          height: '100vh',
          backgroundColor: '#EFB32C',
          zIndex: 100
        }}
      />
      {/* Left red area (between gold and content) */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: '4px',
          width: '45px',
          height: '100vh',
          backgroundColor: '#CD1D43',
          zIndex: 99
        }}
      />
      {/* Right red area (between gold and content) */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: '4px',
          width: '45px',
          height: '100vh',
          backgroundColor: '#CD1D43',
          zIndex: 99
        }}
      />
      {/* Left red border */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: '44px',
          width: '2px',
          height: '100vh',
          backgroundColor: '#CD1D43',
          zIndex: 100
        }}
      />
      {/* Right red border */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: '44px',
          width: '2px',
          height: '100vh',
          backgroundColor: '#CD1D43',
          zIndex: 100
        }}
      />
      {/* Main content container */}
      <div
        ref={containerRef}
        className="fixed overflow-y-auto"
        style={{
          top: `calc(${navbarHeight}px + 8px)`,
          left: '46px',
          right: '46px',
          width: 'calc(100vw - 92px)',
          height: `calc(100vh - ${navbarHeight}px - 8px - 8px - 45px)`,
          zIndex: 12
        }}
      >
        {/* Up/Down scroll buttons */}
        <div
          style={{
            position: 'fixed',
            right: '32px',
            top: `calc(50vh - 60px)`,
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <button
            aria-label="Scroll to top"
            onClick={() => {
              if (containerRef.current) containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-12 h-12 rounded-full bg-[#CD1D43] shadow-lg border border-gray-100 flex items-center justify-center text-2xl text-gray-100 hover:bg-[#DC1D43] hover:text-white transition"
          >
            ↑
          </button>
          <button
            aria-label="Scroll to bottom"
            onClick={() => {
              if (containerRef.current) containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
            }}
            className="w-12 h-12 rounded-full bg-[#CD1D43] shadow-lg border border-gray-100 flex items-center justify-center text-2xl text-gray-100 hover:bg-[#DC1D43] hover:text-white transition"
          >
            ↓
          </button>
        </div>
        <svg
          ref={svgRef}
          className="absolute left-0 top-0 pointer-events-none"
          style={{ width: '100%', height: svgHeight, zIndex: 1 }}
        >
          {connectionLines.map((line) => {
            let lineShouldBeStyled = false; // True if the line should be dimmed/blurred
            if (hoveredCardId !== null) {
              // If the line is NOT directly connected to the hovered card, it should be styled
              if (line.parentId !== hoveredCardId && line.childId !== hoveredCardId) {
                lineShouldBeStyled = true;
              }
            }
            
            return (
              <g 
                key={`${line.parentId}-${line.childId}`}
                style={{
                  opacity: lineShouldBeStyled ? 0.3 : 1,
                  filter: lineShouldBeStyled ? 'blur(1px)' : 'none',
                  transition: 'opacity 0.2s ease-out, filter 0.2s ease-out',
                }}
              >
                <path d={line.path} fill="none" stroke="#CD1D43" strokeWidth="2" />
                <path d={`${line.path}`} fill="none" stroke="none" strokeWidth="0" markerEnd="url(#arrowhead)" />
              </g>
            );//lines
          })}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#CD1D43" />
            </marker>
          </defs>
        </svg>
        <div ref={contentWrapperRef} className="relative flex flex-col items-center w-full py-12" style={{ zIndex: 2 }}>
          {starterNodes.length > 0 && (
            <div className="flex justify-center mb-16">
              {starterNodes.map((node) => {
                const scale = calculateScale(node.id);
                const baseWidth = getDynamicCardWidth(starterNodes.length);
                return (
                  <div 
                    key={node.id} 
                    ref={(el) => { if (el) cardRefs.current.set(node.id, el); }}
                    style={getCardStyle(node.id, 1, baseWidth)}
                    className="mx-4 shadow-lg card-component"
                    onMouseEnter={() => handleMouseEnter(node.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div style={getContentStyle(scale)} className="pt-8">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-bold text-lg">{node.summary}</div>
                        <button 
                          onClick={() => handleWriteFromHere(node.id)}
                          className={buttonClasses}
                          title="Write from here"
                          style={{ marginLeft: '1rem', flexShrink: 0 }}
                        >
                          Write from here
                        </button>
                      </div>
                      <div className="mb-4 text-base leading-relaxed">{node.content}</div>
                      <button 
                        onClick={() => handleWriteFromHere(node.id)}
                        className={`${buttonClasses} mt-4 self-center`}
                      >
                        Write from here
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {allLevels.filter(l => l !== 1).map((level) => (
            <div key={level} className="flex flex-row justify-center items-start space-x-10 mb-20">
              {nodesByLevel[level].map((node) => {
                const scale = calculateScale(node.id);
                const baseWidth = getDynamicCardWidth(nodesByLevel[level].length);
                return (
                  <div 
                    key={node.id} 
                    ref={(el) => { if (el) cardRefs.current.set(node.id, el); }}
                    style={getCardStyle(node.id, level, baseWidth)}
                    className="mx-3 my-3 shadow-lg card-component"
                    onMouseEnter={() => handleMouseEnter(node.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div style={getContentStyle(scale)} className="pt-8">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-bold text-lg">{node.summary}</div>
                        <button 
                          onClick={() => handleWriteFromHere(node.id)}
                          className={buttonClasses}
                          title="Write from here"
                          style={{ marginLeft: '1rem', flexShrink: 0 }}
                        >
                          Write from here
                        </button>
                      </div>
                      <div className="mb-4 text-base leading-relaxed">{node.content}</div>
                      <button 
                        onClick={() => handleWriteFromHere(node.id)}
                        className={`${buttonClasses} mt-4 self-center`}
                      >
                        Write from here
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          {/* Footer as part of the scrollable content */}
          <div 
            className="w-full shadow-lg themed-footer" 
            style={{ 
              position: 'fixed', 
              bottom: '8px', 
              left: 0, 
              right: 0, 
              zIndex: 20,
              height: '45px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <div className="w-full px-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4 pl-12">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-white">Hosted by Round Square Executive Team</p>
                    <img src="/assets/RS.png" alt="Round Square Logo" className="h-4 w-auto brightness-100"/>
                  </div>
                  <a href="https://keycas.cn" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                    <p className="text-sm text-white">Powered by KeyCAS</p>
                    <img src="/assets/KeyCAS.svg" alt="KeyCAS Logo" className="h-4 w-auto brightness-100"/>
                  </a>
                </div>
                <div className="pr-12 text-white">
                  <AdminAccess />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}