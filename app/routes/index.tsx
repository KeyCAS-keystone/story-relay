import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabase';

interface Node {
  id: string;
  content: string;
  summary: string;
  parent_id: string | null;
  position: number;
  children?: Node[];
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
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Convert flat array to tree structure
      const tree = buildTree(data);
      setNodes(tree);
    } catch (error) {
      console.error('Error fetching nodes:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildTree = (nodes: Node[]): Node[] => {
    const nodeMap = new Map<string, Node>();
    const tree: Node[] = [];

    // First pass: create a map of all nodes
    nodes.forEach(node => {
      nodeMap.set(node.id, { ...node, children: [] });
    });

    // Second pass: build the tree structure
    nodes.forEach(node => {
      const nodeWithChildren = nodeMap.get(node.id)!;
      if (node.parent_id === null) {
        tree.push(nodeWithChildren);
      } else {
        const parent = nodeMap.get(node.parent_id);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(nodeWithChildren);
        }
      }
    });

    return tree;
  };

  const renderNode = (node: Node, level: number = 0) => {
    return (
      <div key={node.id} className="ml-8">
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <p className="text-gray-800 mb-2">{node.content}</p>
          <p className="text-sm text-gray-500">{node.summary}</p>
        </div>
        {node.children && node.children.length > 0 && (
          <div className="border-l-2 border-gray-300 pl-4">
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
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
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Story Relay</h1>
        <div className="bg-gray-50 p-6 rounded-lg">
          {nodes.length === 0 ? (
            <p className="text-gray-500 text-center">No stories yet. Be the first to start!</p>
          ) : (
            nodes.map(node => renderNode(node))
          )}
        </div>
      </div>
    </Layout>
  );
} 