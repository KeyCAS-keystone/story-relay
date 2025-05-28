import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabase';
import TermsModal from '../components/TermsModal';
import Loader from '../components/Loader';
import Cover from '../components/cover';
import StoryTree from '../components/StoryTree';

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

export default function Home() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCover, setShowCover] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState({ current: 0, total: 0, stage: '' });

  useEffect(() => {
    fetchNodes();
  }, []);

  const fetchNodes = async () => {
    const MAX_RETRIES = 3;
    const TIMEOUT_MS = 10000; // 10 seconds timeout
    let retryCount = 0;

    const fetchWithTimeout = async () => {
      try {
        setLoadingProgress({ current: 0, total: 1, stage: 'Fetching nodes from database...' });
        const { data, error } = await supabase
          .from('nodes')
          .select('id, content, summary, parent_id, position, author_id, created_at, status')
          .eq('status', 'approved')
          .order('created_at', { ascending: false }) as { data: Node[] | null, error: any };

        if (error) throw error;
        setLoadingProgress({ current: 1, total: 1, stage: 'Processing nodes...' });
        return data;
      } catch (error) {
        throw error;
      }
    };

    while (retryCount < MAX_RETRIES) {
      try {
        setLoading(true);
        setError('');

        const data = await fetchWithTimeout();

        // Create a map of all nodes for quick lookup
        const nodeMap = new Map((data || []).map(node => [node.id, node]));
        
        // Calculate levels in memory and use a Set to track processed nodes
        const processedNodes = new Set<string>();
        const levelCache = new Map<string, number>(); // Cache for level calculations
        
        const totalNodes = (data || []).length;
        let processedCount = 0;
        
        const nodesWithLevel = (data || []).map(node => {
          processedCount++;
          setLoadingProgress({
            current: processedCount,
            total: totalNodes,
            stage: 'Calculating node levels...'
          });

          // Skip if we've already processed this node
          if (processedNodes.has(node.id)) {
            return null;
          }
          processedNodes.add(node.id);

          // Check if level is already calculated
          if (levelCache.has(node.id)) {
            return {
              ...node,
              level: levelCache.get(node.id)!
            };
          }

          let level = 1;
          let currentParentId = node.parent_id;
          const visited = new Set<string>(); // Prevent circular references
          const path: string[] = [node.id]; // Track the path for caching
          
          while (currentParentId) {
            if (visited.has(currentParentId)) {
              console.warn('Circular reference detected for node:', node.id);
              break;
            }
            visited.add(currentParentId);
            path.push(currentParentId);
            
            const parentNode = nodeMap.get(currentParentId);
            if (parentNode) {
              level++;
              currentParentId = parentNode.parent_id;
            } else {
              break;
            }
          }

          // Cache levels for all nodes in the path
          path.forEach((nodeId, index) => {
            levelCache.set(nodeId, level - index);
          });

          return {
            ...node,
            level
          };
        }).filter((node): node is Node => node !== null); // Remove null entries

        setNodes(nodesWithLevel);
        setLoading(false);
        setLoadingProgress({ current: 0, total: 0, stage: '' });
        return; // Success, exit the retry loop
      } catch (error) {
        retryCount++;
        console.error(`Error fetching nodes (attempt ${retryCount}/${MAX_RETRIES}):`, error);
        
        if (retryCount === MAX_RETRIES) {
          setError('Failed to load stories. Please try refreshing the page.');
          setLoading(false);
          setLoadingProgress({ current: 0, total: 0, stage: '' });
        } else {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
          continue;
        }
      }
    }
  };

  const handleSwipe = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setShowCover(false);
      setIsAnimating(false);
    }, 500);
  };

  return (
    <>
      <TermsModal />
      <div style={{ position: 'relative', height: '100vh' }}>
        {/* Main Content - Always render but conditionally show content */}
        <Layout>
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 space-y-4">
              <Loader />
              {loadingProgress.total > 0 && (
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">{loadingProgress.stage}</div>
                  <div className="w-64 bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${(loadingProgress.current / loadingProgress.total) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {loadingProgress.current} / {loadingProgress.total} nodes
                  </div>
                </div>
              )}
            </div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <StoryTree nodes={nodes} />
          )}
        </Layout>

        {/* Cover Overlay - Always show initially */}
        {showCover && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 2000,
            }}
            onWheel={(e) => {
              if (Math.abs(e.deltaY) > 30) {
                handleSwipe();
              }
            }}
            onTouchStart={(e) => {
              const touch = e.touches[0];
              const startY = touch.clientY;
              
              const handleTouchMove = (e: TouchEvent) => {
                const touch = e.touches[0];
                const deltaY = touch.clientY - startY;
                if (Math.abs(deltaY) > 30) {
                  handleSwipe();
                  document.removeEventListener('touchmove', handleTouchMove);
                  document.removeEventListener('touchend', handleTouchEnd);
                }
              };
              
              const handleTouchEnd = () => {
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
              };
              
              document.addEventListener('touchmove', handleTouchMove);
              document.addEventListener('touchend', handleTouchEnd);
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                transform: isAnimating ? 'translateY(-100%)' : 'translateY(0)',
                opacity: isAnimating ? 0 : 1,
                transition: 'transform 0.5s ease-out, opacity 0.5s ease-out',
                touchAction: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <Cover onHide={() => setShowCover(false)} />
            </div>
          </div>
        )}
      </div>
    </>
  );
} 