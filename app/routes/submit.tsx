import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabase';

interface Node {
  id: string;
  content: string;
  summary: string;
  position: number;
}

export default function Submit() {
  const [parentNodes, setParentNodes] = useState<Node[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validate content length (1-5 sentences)
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
      if (sentences.length < 1 || sentences.length > 5) {
        throw new Error('Please write 1-5 sentences');
      }

      // Get the selected parent node
      const parentNode = parentNodes.find(n => n.id === selectedNodeId);
      if (!parentNode) {
        throw new Error('Please select a parent story');
      }

      // Count existing children of the selected parent
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

      // Create the submission
      const { error: submitError } = await supabase
        .from('submissions')
        .insert({
          node_id: selectedNodeId,
          content,
          summary,
          status: 'pending'
        });

      if (submitError) throw submitError;

      setSuccess(true);
      setContent('');
      setSummary('');
      setSelectedNodeId('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to submit story');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Submit Your Story</h1>
        
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
            <label htmlFor="parent" className="block text-sm font-medium text-gray-700">
              Continue from:
            </label>
            <select
              id="parent"
              value={selectedNodeId}
              onChange={(e) => setSelectedNodeId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select a story to continue from</option>
              {parentNodes.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.summary}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Your Story (1-5 sentences)
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
              Summary
            </label>
            <input
              type="text"
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Story'}
          </button>
        </form>
      </div>
    </Layout>
  );
} 