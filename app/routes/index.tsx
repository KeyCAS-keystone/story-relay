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

  useEffect(() => {
    fetchNodes();
  }, []);

  const fetchNodes = async () => {
    const MAX_RETRIES = 3;
    const TIMEOUT_MS = 10000; // 10 seconds timeout
    let retryCount = 0;

    const fetchWithTimeout = async () => {
      try {
        const { data, error } = await supabase
          .from('nodes')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (error) throw error;
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
        
        // Calculate levels in memory
        const nodesWithLevel = (data || []).map(node => {
          let level = 1;
          let currentParentId = node.parent_id;
          const visited = new Set<string>(); // Prevent circular references
          
          while (currentParentId) {
            if (visited.has(currentParentId)) {
              console.warn('Circular reference detected for node:', node.id);
              break;
            }
            visited.add(currentParentId);
            
            const parentNode = nodeMap.get(currentParentId);
            if (parentNode) {
              level++;
              currentParentId = parentNode.parent_id;
            } else {
              break;
            }
          }

          return {
            ...node,
            level
          };
        });

        setNodes(nodesWithLevel);
        setLoading(false);
        return; // Success, exit the retry loop
      } catch (error) {
        retryCount++;
        console.error(`Error fetching nodes (attempt ${retryCount}/${MAX_RETRIES}):`, error);
        
        if (retryCount === MAX_RETRIES) {
          setError('Failed to load stories. Please try refreshing the page.');
          setLoading(false);
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
            <div className="flex justify-center items-center h-64">
              <Loader />
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