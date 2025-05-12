import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabase';
import StoryTree from '../components/StoryTree';
import TermsModal from '../components/TermsModal';
import Loader from '../components/Loader';

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

  useEffect(() => {
    fetchNodes();
  }, []);

  const fetchNodes = async () => {
    try {
      setLoading(true);
      setError('');

      const { data, error } = await supabase
        .from('nodes')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;

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
    } catch (error) {
      console.error('Error fetching nodes:', error);
      setError('Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-red-600">{error}</div>
      </Layout>
    );
  }

  return (
    <>
      <TermsModal />
      <Layout>
        <div className="w-full">
          {nodes.length === 0 ? (
            <p className="text-gray-500 text-center">No stories yet. Be the first to start!</p>
          ) : (
            <StoryTree nodes={nodes} />
          )}
        </div>
      </Layout>
    </>
  );
} 