import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabase';

interface Submission {
  id: string;
  node_id: string;
  content: string;
  summary: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  parent_content?: string;
}

export default function Admin() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          nodes:node_id (
            content
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const submissionsWithParent = data?.map(sub => ({
        ...sub,
        parent_content: sub.nodes?.content
      })) || [];

      setSubmissions(submissionsWithParent);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setError('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (submissionId: string, status: 'approved' | 'rejected') => {
    try {
      setLoading(true);

      if (status === 'approved') {
        // Get the submission details
        const submission = submissions.find(s => s.id === submissionId);
        if (!submission) throw new Error('Submission not found');

        // Count existing children of the parent node
        const { data: existingChildren, error: countError } = await supabase
          .from('nodes')
          .select('position')
          .eq('parent_id', submission.node_id)
          .eq('status', 'approved');

        if (countError) throw countError;

        const nextPosition = (existingChildren?.length || 0) + 1;
        if (nextPosition > 5) {
          throw new Error('This story branch has reached its maximum number of continuations (5)');
        }

        // Create a new node
        const { error: nodeError } = await supabase
          .from('nodes')
          .insert({
            parent_id: submission.node_id,
            content: submission.content,
            summary: submission.summary,
            position: nextPosition,
            status: 'approved'
          });

        if (nodeError) throw nodeError;
      }

      // Update submission status
      const { error: updateError } = await supabase
        .from('submissions')
        .update({ status })
        .eq('id', submissionId);

      if (updateError) throw updateError;

      // Refresh submissions list
      await fetchSubmissions();
    } catch (error) {
      console.error('Error reviewing submission:', error);
      setError(error instanceof Error ? error.message : 'Failed to review submission');
    } finally {
      setLoading(false);
    }
  };

  if (loading && submissions.length === 0) {
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {submissions.length === 0 ? (
            <p className="text-gray-500 text-center">No pending submissions</p>
          ) : (
            submissions.map((submission) => (
              <div key={submission.id} className="bg-white shadow rounded-lg p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Parent Story</h3>
                    <p className="mt-1 text-gray-600">{submission.parent_content}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Submission</h3>
                    <p className="mt-1 text-gray-600">{submission.content}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Summary</h3>
                    <p className="mt-1 text-gray-600">{submission.summary}</p>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => handleReview(submission.id, 'rejected')}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleReview(submission.id, 'approved')}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
} 