import { useState, useEffect, Fragment, useRef } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabase';
import { Dialog, Transition } from '@headlessui/react';

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
  status: 'pending' | 'approved' | 'rejected';
}

export default function Admin() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const rowRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [scrollToggles, setScrollToggles] = useState(0); // 用于强制刷新连线

  useEffect(() => {
    fetchNodes();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollToggles(t => t + 1);
    Object.values(rowRefs.current).forEach(row => {
      if (row) row.addEventListener('scroll', handleScroll);
    });
    return () => {
      Object.values(rowRefs.current).forEach(row => {
        if (row) row.removeEventListener('scroll', handleScroll);
      });
    };
  }, [nodes]);

  const fetchNodes = async () => {
    try {
      setLoading(true);
      setError('');

      // 1. Fetch submissions (these are 'pending')
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('submissions')
        .select('id, content, summary, node_id, author_id, created_at, author:author_id(email, username)')
        .order('created_at', { ascending: false });

      if (submissionsError) throw submissionsError;

      const pendingNodes: Node[] = (submissionsData || []).map(sub => {
        const authorData = Array.isArray(sub.author) ? sub.author[0] : sub.author;
        return {
          id: sub.id,
          content: sub.content,
          summary: sub.summary,
          parent_id: sub.node_id,
          author_id: sub.author_id,
          created_at: sub.created_at,
          status: 'pending' as 'pending',
          author_email: authorData?.email,
          author_username: authorData?.username,
          position: 0,
          level: 0,
        };
      });

      // 2. Fetch existing nodes (approved/rejected)
      const { data: existingNodesData, error: existingNodesError } = await supabase
        .from('nodes')
        .select('*, author:author_id(email, username)')
        .order('created_at', { ascending: false });

      if (existingNodesError) throw existingNodesError;

      const approvedRejectedNodes: Node[] = (existingNodesData || []).map(node => {
          const authorData = Array.isArray(node.author) ? node.author[0] : node.author;
          return {
            ...node,
            author_email: authorData?.email,
            author_username: authorData?.username,
          };
      });

      // 3. Combine them
      const allEntries = [...pendingNodes, ...approvedRejectedNodes];
      
      const allPossibleNodesMap = new Map<string, { parent_id: string | null; id: string }>();
      allEntries.forEach(entry => allPossibleNodesMap.set(entry.id, { parent_id: entry.parent_id, id: entry.id }));

      const nodesWithDetails = allEntries.map(node => {
        let level = 1;
        let currentParentId = node.parent_id;
        const visited = new Set<string>(); 
        while (currentParentId) {
          if (visited.has(currentParentId)) { 
            console.warn('Circular dependency detected for node:', node.id, 'at parent:', currentParentId);
            level = Infinity; 
            break;
          }
          visited.add(currentParentId);
          const parentNodeDetails = allPossibleNodesMap.get(currentParentId);
          if (parentNodeDetails) {
            level++;
            currentParentId = parentNodeDetails.parent_id;
          } else {
            break;
          }
        }
        return { ...node, level: level === Infinity ? -1 : level }; 
      });
      
      setNodes(
        nodesWithDetails.sort((a, b) => {
          if (a.level === -1 && b.level !== -1) return 1;
          if (b.level === -1 && a.level !== -1) return -1;
          if (a.level === b.level) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
          return a.level - b.level; 
        })
      );

    } catch (error) {
      console.error('Error fetching admin data:', error);
      setError('Failed to load admin data. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (nodeId: string, newStatus: 'approved' | 'rejected') => {
    console.log(`[Admin] handleReview called for nodeId: ${nodeId}, newStatus: ${newStatus}`);
    try {
      setLoading(true);
      setError('');

      const nodeToReview = nodes.find(n => n.id === nodeId);
      console.log('[Admin] nodeToReview:', nodeToReview);

      if (!nodeToReview) {
        console.error('[Admin] Node not found for review with ID:', nodeId);
        setError('Node not found. It might have been removed or changed.');
        setLoading(false);
        return;
      }

      if (newStatus === 'approved') {
        console.log('[Admin] Approving node:', nodeId, 'Current status:', nodeToReview.status);
        if (nodeToReview.status !== 'pending') {
            console.warn('[Admin] Attempting to approve a node not in pending state:', nodeToReview);
            // Potentially allow re-approving or handle as an edge case if needed
        }

        const nodeDataForInsert = {
          id: nodeToReview.id,
          content: nodeToReview.content,
          summary: nodeToReview.summary,
          parent_id: nodeToReview.parent_id, // This was mapped from submission.node_id
          author_id: nodeToReview.author_id,
          created_at: nodeToReview.created_at,
          status: 'approved' as 'approved',
          position: nodeToReview.level === -1 ? 1 : nodeToReview.level, // STORE calculated level in 'position' column
        };
        console.log('[Admin] Data for insert into nodes:', nodeDataForInsert);

        const { error: insertError } = await supabase
          .from('nodes')
          .insert(nodeDataForInsert);

        if (insertError) {
            console.error('[Admin] Error inserting node into nodes table:', insertError);
            if (insertError.code === '23505') { // Unique violation
                 console.warn('[Admin] Node with this ID already exists in nodes table. Attempting update instead.', insertError);
                 const { error: updateError } = await supabase
                    .from('nodes')
                    .update({
                        content: nodeToReview.content,
                        summary: nodeToReview.summary,
                        parent_id: nodeToReview.parent_id,
                        status: 'approved',
                        position: nodeToReview.level === -1 ? 1 : nodeToReview.level, // STORE calculated level in 'position' column
                    })
                    .eq('id', nodeToReview.id);
                if (updateError) {
                    console.error('[Admin] Error updating existing node to approved:', updateError);
                    throw updateError; 
                }
                 console.log('[Admin] Successfully updated existing node to approved:', nodeId);
            } else {
                throw insertError; 
            }
        } else {
          console.log('[Admin] Successfully inserted node into nodes table:', nodeId);
        }

        // Regardless of insert or update, if original was from submissions, delete it
        if (nodeToReview.status === 'pending') {
            console.log('[Admin] Deleting from submissions, nodeId:', nodeId);
            const { error: deleteError } = await supabase
              .from('submissions')
              .delete()
              .eq('id', nodeId);
            
            if (deleteError) {
              console.error('[Admin] CRITICAL: Failed to delete submission after approval:', deleteError, 'NodeId:', nodeId);
              setError('Node approved but failed to remove from submissions. Please check manually.');
              // Do not rethrow if approval itself was successful, but log critically
            } else {
              console.log('[Admin] Successfully deleted node from submissions:', nodeId);
            }
        }

      } else if (newStatus === 'rejected') {
        console.log('[Admin] Rejecting node:', nodeId, 'Current status:', nodeToReview.status);
        if (nodeToReview.status === 'pending') {
          console.log('[Admin] Deleting pending submission from submissions table:', nodeId);
          const { error: deleteError } = await supabase
            .from('submissions')
            .delete()
            .eq('id', nodeId);
          if (deleteError) {
            console.error('[Admin] Error deleting pending submission:', deleteError);
            throw deleteError;
          }
          console.log('[Admin] Successfully deleted pending submission:', nodeId);
        } else {
          // Item was already in 'nodes' (e.g. an approved node being re-rejected)
          console.log('[Admin] Updating node status to rejected in nodes table:', nodeId);
          const { error: updateError } = await supabase
          .from('nodes')
            .update({ status: 'rejected' })
            .eq('id', nodeId);
          if (updateError) {
            console.error('[Admin] Error updating node to rejected:', updateError);
            throw updateError;
          }
          console.log('[Admin] Successfully updated node to rejected:', nodeId);
        }
      }

      console.log('[Admin] Review process completed for nodeId:', nodeId, '. Fetching updated nodes.');
      await fetchNodes();

    } catch (error) {
      console.error('[Admin] Error in handleReview function:', error);
      setError(error instanceof Error ? error.message : 'Failed to process review. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && nodes.length === 0) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  const nodesByLevel = nodes.reduce((acc, node) => {
    const level = node.level;
    acc[level] = acc[level] || [];
    acc[level].push(node);
    return acc;
  }, {} as Record<number, Node[]>);

  const allLevels = Object.keys(nodesByLevel).map(Number).sort((a, b) => a - b);

  return (
    <Layout>
      <div className="admin-page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">Admin Panel</h1>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-24">
            {allLevels.map((level, idx) => (
              <div key={level} className="relative">
                <div
                  className="flex flex-row items-stretch space-x-8 overflow-x-auto pb-4 px-4"
                  id={`level-row-${level}`}
                  ref={el => { rowRefs.current[level] = el; }}
                >
                  {nodesByLevel[level].map((node) => (
                    <div 
                      key={node.id} 
                      className={`bg-white shadow rounded-lg p-4 w-[400px] h-full flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-indigo-400 transition ${
                        node.status === 'pending' ? 'border-2 border-yellow-400' :
                        node.status === 'rejected' ? 'border-2 border-red-400' :
                        'border border-gray-200'
                      }`}
                      onClick={() => setSelectedNode(node)}
                      data-node-id={node.id}
                      data-parent-id={node.parent_id || ''}
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{node.summary}</h3>
                            <p className="text-sm text-gray-500">
                              By {node.author_username || node.author_email}
                            </p>
                          </div>
                          <div className="text-sm">
                            <span className={`px-2 py-1 rounded-full ${
                              node.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              node.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {node.status.charAt(0).toUpperCase() + node.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="max-h-[100px] overflow-y-auto">
                          <p className="text-gray-600 text-sm">{node.content}</p>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(node.created_at).toLocaleString()}
                        </div>
                        {node.status === 'pending' && (
                          <div className="flex justify-end space-x-4 pt-3 border-t">
                            <button
                              onClick={e => { e.stopPropagation(); handleReview(node.id, 'rejected'); }}
                              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Reject
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); handleReview(node.id, 'approved'); }}
                              className="px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Approve
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {/* 画线：只在不是最后一层时绘制 */}
                {idx < allLevels.length - 1 && (
                  <svg className="absolute left-0 right-0" style={{top: '100%', height: 96, width: '100%', pointerEvents: 'none'}}>
                    {nodesByLevel[level + 1].map((childNode) => {
                      const parentIdx = nodesByLevel[level].findIndex(n => n.id === childNode.parent_id);
                      const childIdx = nodesByLevel[level + 1].findIndex(n => n.id === childNode.id);
                      if (parentIdx === -1) return null;
                      // 获取当前层和下一层的 scrollLeft
                      const parentScroll = rowRefs.current[level]?.scrollLeft || 0;
                      const childScroll = rowRefs.current[level + 1]?.scrollLeft || 0;
                      // 卡片宽和间距（与渲染一致）
                      const cardWidth = 400;
                      const gap = 32;
                      const padding = 16;
                      // 计算父子卡片中心的 x 坐标，减去 scrollLeft
                      const parentX = cardWidth / 2 + parentIdx * (cardWidth + gap) + padding - parentScroll;
                      const childX = cardWidth / 2 + childIdx * (cardWidth + gap) + padding - childScroll;
                      return (
                        <line
                          key={childNode.id}
                          x1={parentX}
                          y1={8}
                          x2={childX}
                          y2={96}
                          stroke="#a3a3a3"
                          strokeWidth={2}
                          markerEnd="url(#arrowhead)"
                        />
                      );
                    })}
                    <defs>
                      <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto" markerUnits="strokeWidth">
                        <path d="M0,0 L6,3 L0,6" fill="#a3a3a3" />
                      </marker>
                    </defs>
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modal for node details */}
        <Transition.Root show={!!selectedNode} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => setSelectedNode(null)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
              leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-60 transition-opacity" />
            </Transition.Child>
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel 
                    className="relative w-full max-w-lg transform overflow-hidden rounded-2xl themed-text-primary bg-white p-8 text-left shadow-xl transition-all"
                  >
                    <Dialog.Title as="h3" className="text-2xl font-bold themed-text-primary text-gray-900 mb-2">
                      {selectedNode?.summary}
                    </Dialog.Title>
                    <div className="mb-4 text-gray-700 themed-text-primary">
                      <span className="font-semibold">Content: </span>
                      <div className="whitespace-pre-line mt-1 mb-2 p-2 bg-gray-50 rounded text-gray-800 max-h-60 overflow-y-auto">
                        {selectedNode?.content}
                      </div>
                    </div>
                    <div className="mb-2 text-sm themed-text-primary">
                      <span className="font-semibold">Author: </span> {selectedNode?.author_username || selectedNode?.author_email}
                    </div>
                    <div className="mb-2 text-sm themed-text-primary">
                      <span className="font-semibold">Created At: </span> {selectedNode && new Date(selectedNode.created_at).toLocaleString()}
                    </div>
                    <div className="mb-2 text-sm themed-text-primary">
                      <span className="font-semibold">Status: </span> {selectedNode && selectedNode.status.charAt(0).toUpperCase() + selectedNode.status.slice(1)}
                    </div>
                    <div className="mb-2 text-sm themed-text-primary">
                      <span className="font-semibold">Node ID: </span> {selectedNode?.id}
                    </div>
                    <div className="mb-2 text-sm themed-text-primary">
                      <span className="font-semibold">Parent ID: </span> {selectedNode?.parent_id || 'None'}
                    </div>
                    <div className="mb-2 text-sm themed-text-primary">
                      <span className="font-semibold">Level: </span> {selectedNode?.level}
                    </div>
                    <div className="flex justify-end mt-6">
                      <button
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none"
                        onClick={() => setSelectedNode(null)}
                      >
                        Close
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    </Layout>
  );
} 