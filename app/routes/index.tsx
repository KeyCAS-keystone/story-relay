import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabase';
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

  useEffect(() => {
    fetchNodes();
  }, []);

  const fetchNodes = async () => {
    try {
      const { data, error } = await supabase
        .from('nodes')
        .select(`
          *,
          author:author_id (
            email,
            username
          )
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: true });

      if (error) throw error;

      // 计算每个节点的层级
      const nodesWithLevel = await Promise.all(
        (data || []).map(async (node) => {
          let level = 1;
          let currentParentId = node.parent_id;
          
          // 递归获取父节点，计算层级
          while (currentParentId) {
            const { data: parentNode } = await supabase
              .from('nodes')
              .select('parent_id')
              .eq('id', currentParentId)
              .single();
            
            if (parentNode) {
              level++;
              currentParentId = parentNode.parent_id;
            } else {
              break;
            }
          }

          return {
            ...node,
            level,
            author_email: node.author?.email,
            author_username: node.author?.username
          };
        })
      );

      setNodes(nodesWithLevel);
    } catch (error) {
      console.error('Error fetching nodes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full">
        {nodes.length === 0 ? (
          <p className="text-gray-500 text-center">No stories yet. Be the first to start!</p>
        ) : (
          <StoryTree nodes={nodes} />
        )}
      </div>
    </Layout>
  );
} 