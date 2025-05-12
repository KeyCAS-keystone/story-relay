import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import AdminAccess from '../components/AdminAccess';

interface Node {
  id: string;
  content: string;
  summary: string;
  position: number;
}

const LOCAL_STORAGE_KEY = 'storyRelaySubmitFormData';

export default function Submit() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [parentNodes, setParentNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
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

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
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
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to submit story');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto pb-20">
        <h1 className="text-3xl font-bold themed-heading mb-8">Submit Your Story</h1>
        
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="parent" className="block text-sm font-medium themed-label">
              Continue from:
            </label>
            <select
              id="parent"
              value={selectedNodeId}
              onChange={(e) => setSelectedNodeId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 bg-white themed-input"
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
              Your Story (1-5 sentences)
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 bg-white themed-input"
              required
            />
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 bg-white themed-input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium themed-button disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Story'}
          </button>
        </form>
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