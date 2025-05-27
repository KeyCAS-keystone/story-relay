import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import AdminAccess from '../components/AdminAccess';
import TermsModal from '../components/TermsModal';

interface Node {
  id: string;
  content: string;
  summary: string;
  position: number;
  parent_id: string | null;
}

const LOCAL_STORAGE_KEY = 'storyRelaySubmitFormData';

export default function Submit() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [showGuide, setShowGuide] = useState(false);
  
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const [parentNodes, setParentNodes] = useState<Node[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [currentStarterNode, setCurrentStarterNode] = useState<Node | null>(null);
  
  const [selectedNodeId, setSelectedNodeId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedData ? JSON.parse(savedData).selectedNodeId || '' : '';
    }
    return '';
  });
  const [content, setContent] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedData ? JSON.parse(savedData).content || '' : '';
    }
    return '';
  });
  const [summary, setSummary] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedData ? JSON.parse(savedData).summary || '' : '';
    }
    return '';
  });
  const [wordCount, setWordCount] = useState(0);
  const [dailyWordCount, setDailyWordCount] = useState(0);

  useEffect(() => {
    if (location.state?.parentNodeId) {
      setSelectedNodeId(location.state.parentNodeId);
      window.history.replaceState({}, document.title)
    }
  }, [location.state]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const formData = JSON.stringify({ selectedNodeId, content, summary });
      localStorage.setItem(LOCAL_STORAGE_KEY, formData);
    }
  }, [selectedNodeId, content, summary]);

  useEffect(() => {
    fetchParentNodes();
  }, []);

  useEffect(() => {
    // 计算当前输入的字数
    const count = content.trim().split(/\s+/).length;
    setWordCount(count);
  }, [content]);

  useEffect(() => {
    // 获取用户今日已使用的字数
    const fetchDailyWordCount = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('daily_word_count, last_submission_date')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        const today = new Date().toISOString().split('T')[0];
        if (data.last_submission_date === today) {
          setDailyWordCount(data.daily_word_count);
        } else {
          setDailyWordCount(0);
        }
      } catch (error) {
        console.error('Error fetching daily word count:', error);
      }
    };

    fetchDailyWordCount();
  }, [user]);

  useEffect(() => {
    if (selectedNodeId && parentNodes.length > 0) {
      let currentNode = parentNodes.find(n => n.id === selectedNodeId);
      if (!currentNode) {
        setCurrentStarterNode(null);
        return;
      }

      let rootNodeCandidate = currentNode;
      const visited = new Set<string>();
      visited.add(rootNodeCandidate.id);

      while (rootNodeCandidate.parent_id !== null) {
        const parent = parentNodes.find(n => n.id === rootNodeCandidate.parent_id);
        if (parent) {
          if (visited.has(parent.id)) { // Cycle detected
            console.error("Cycle detected in parent chain for node:", selectedNodeId);
            setCurrentStarterNode(null); // Or handle error appropriately
            return;
          }
          rootNodeCandidate = parent;
          visited.add(parent.id);
        } else {
          // Parent not found in the loaded parentNodes, but parent_id exists.
          // This could mean parentNodes is incomplete or the data is inconsistent.
          // We'll consider the current rootNodeCandidate as the furthest we can go.
          console.warn(`Parent node with ID ${rootNodeCandidate.parent_id} not found for node ${rootNodeCandidate.id}. Displaying current node as starter if it has no parent_id.`);
          // If this "orphan" still has a parent_id, it's an issue.
          // If its parent_id is null, then it's a root.
          break; 
        }
      }
      setCurrentStarterNode(rootNodeCandidate);
    } else {
      setCurrentStarterNode(null); // No selected node or no parent nodes loaded
    }
  }, [selectedNodeId, parentNodes]);

  const fetchParentNodes = async () => {
    try {
      const { data, error } = await supabase
        .from('nodes')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setParentNodes(data || []);
    } catch (error) {
      console.error('Error fetching parent nodes:', error);
      setError('Failed to load available story branches');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    setError('');
    setSuccess(false);

    try {
      // 检查用户今日提交字数
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('daily_word_count, last_submission_date')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      const today = new Date().toISOString().split('T')[0];
      const lastSubmissionDate = userData.last_submission_date;
      
      // 如果是新的一天，重置字数计数
      if (lastSubmissionDate !== today) {
        const { error: resetError } = await supabase
          .from('users')
          .update({
            daily_word_count: 0,
            last_submission_date: today
          })
          .eq('id', user.id);
        
        if (resetError) throw resetError;
        userData.daily_word_count = 0;
      }

      // 计算当前提交的字数
      const wordCount = content.trim().split(/\s+/).length;
      const newTotalCount = userData.daily_word_count + wordCount;

      if (newTotalCount > 500) {
        throw new Error(`You have exceeded the daily limit of 500 words. You have used ${userData.daily_word_count} words today, and this submission would add ${wordCount} more words.`);
      }

      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
      if (sentences.length < 1 || sentences.length > 5) {
        throw new Error('Please write 1-5 sentences');
      }

      const parentNode = parentNodes.find(n => n.id === selectedNodeId);
      if (!parentNode) {
        throw new Error('Please select a parent story');
      }

      const { data: existingChildren, error: countError } = await supabase
        .from('nodes')
        .select('position')
        .eq('parent_id', selectedNodeId)
        .eq('status', 'approved');

      if (countError) throw countError;

      const nextPosition = (existingChildren?.length || 0) + 1;
      if (nextPosition > 5) {
        throw new Error('This story branch has reached its maximum number of continuations (5)');
      }

      // 更新用户字数计数
      const { error: updateError } = await supabase
        .from('users')
        .update({
          daily_word_count: newTotalCount,
          last_submission_date: today
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      const { error: submitError } = await supabase
        .from('submissions')
        .insert({
          node_id: selectedNodeId,
          author_id: user.id,
          content,
          summary,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (submitError) {
        console.error('Submission error:', submitError);
        throw submitError;
      }

      setSuccess(true);
      setContent('');
      setSummary('');
      setSelectedNodeId('');
    } catch (error) {
      console.error('Error submitting story:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit story');
    }
  };

  console.log('parentNodes', parentNodes);
  console.log('selectedNode', parentNodes.find(n => n.id === selectedNodeId));
  console.log('currentStarterNode', currentStarterNode);

  return (
    <Layout>
      {/* Guide Modal */}
      <TermsModal open={showGuide} onClose={() => setShowGuide(false)} />
      <div className="max-w-4xl mx-auto pb-20">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold themed-heading">Submit Your Story</h1>
          <button
            className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm themed-button focus:outline-none focus:ring-2"
            onClick={() => setShowGuide(true)}
          >
            Show Guide
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
            <p className="text-green-700">Your story has been submitted for review!</p>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:space-x-6">
          {/* Reference nodes on the left, now split vertically */}
          <div className="md:max-w-2/4 mb-6 md:mb-0 flex flex-col space-y-6">
            {/* Starter selector */}
            {currentStarterNode && (
              <>
                <div className="text-s font-semibold text-gray-500 mb-1 themed-label">Story Prompt</div>
                <div className="h-60 overflow-y-auto bg-gray-50 border rounded-md p-3 themed-input">
                  <div className="font-bold text-sm mb-1 themed-input">{currentStarterNode.summary}</div>
                  <div className="text-xs text-gray-700 themed-input">
                    {currentStarterNode.content.split('\n').map((line, idx) => (
                      <div key={idx} className="mb-2 last:mb-0">{line}</div>
                    ))}
                  </div>
                </div>
              </>
            )}
            {parentNodes.find(n => n.id === selectedNodeId) && (
              <>
                <div className="text-s font-semibold text-gray-500 mb-1 themed-label">Continue From</div>
                <div className="h-58 overflow-y-auto bg-gray-50 border rounded-md p-3 themed-input">
                  <div className="font-bold text-sm mb-1 themed-input">{parentNodes.find(n => n.id === selectedNodeId)?.summary}</div>
                  <div className="text-xs text-gray-700 themed-input">
                    {parentNodes.find(n => n.id === selectedNodeId)?.content.split('\n').map((line, idx) => (
                      <div key={idx} className="mb-2 last:mb-0">{line}</div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          {/* Submission form on the right */}
          <form onSubmit={handleSubmit} className={`space-y-6 ${!selectedNodeId ? 'w-full' : 'md:w-3/5'}`}>
            <div>
              <label htmlFor="parent" className="block text-sm font-medium themed-label">
                Continue from:
              </label>
              <select
                id="parent"
                value={selectedNodeId}
                onChange={(e) => setSelectedNodeId(e.target.value)}
                className="mt-1 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 bg-white themed-input"
                required
              >
                <option value="">Select a story to continue from</option>
                {parentNodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.summary} ({node.content.substring(0, 30)}...)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium themed-label">
                Your Story
              </label>
              <div className="relative">
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full h-60 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 bg-white themed-input"
                  required
                />
                <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                  <span className={wordCount + dailyWordCount > 500 ? 'text-red-500' : ''}>
                    {wordCount} words
                  </span>
                  {dailyWordCount > 0 && (
                    <span className="ml-2">
                      (Today: {dailyWordCount + wordCount}/500)
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="summary" className="block text-sm font-medium themed-label">
                Summary
              </label>
              <input
                type="text"
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="mt-1 block w-full h-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 bg-white themed-input"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium themed-button disabled:opacity-50"
            >
              Submit Story
            </button>
          </form>
        </div>
      </div>

      {/* Fixed Footer */}
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
        {/* Left gold border */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '8px',
            height: '45px',
            backgroundColor: '#EFB32C',
            zIndex: 1010
          }}
        />
        {/* Right gold border */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '8px',
            height: '45px',
            backgroundColor: '#EFB32C',
            zIndex: 1010
          }}
        />
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
    </Layout>
  );
} 