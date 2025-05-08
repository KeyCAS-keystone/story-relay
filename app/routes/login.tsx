import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabase';

const ALLOWED_EMAIL_DOMAINS = ['student.keystoneacademy.cn', 'keystoneacademy.cn'];

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check for OAuth callback
    const handleAuthCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        setError('Authentication failed');
        return;
      }

      if (session?.user) {
        const email = session.user.email;
        if (!email) {
          setError('No email found in your Microsoft account');
          await supabase.auth.signOut();
          return;
        }

        const domain = email.split('@')[1];
        if (!ALLOWED_EMAIL_DOMAINS.includes(domain)) {
          setError(`Only @student.keystoneacademy.cn and @keystoneacademy.cn email addresses are allowed`);
          await supabase.auth.signOut();
          return;
        }

        // Redirect to home page after successful login
        window.location.href = '/';
      }
    };

    handleAuthCallback();
  }, []);

  const handleMicrosoftLogin = async () => {
    try {
      setLoading(true);
      setError('');

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          scopes: 'openid email profile user.read',
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to login with Microsoft');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">Sign In</h1>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Please sign in with your Keystone Academy Microsoft account
            </p>
            <button
              onClick={handleMicrosoftLogin}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2F2F2F] hover:bg-[#1F1F1F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2F2F2F] disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.5 0H0V11.5H11.5V0Z" fill="#F25022"/>
                    <path d="M23 0H11.5V11.5H23V0Z" fill="#7FBA00"/>
                    <path d="M11.5 11.5H0V23H11.5V11.5Z" fill="#00A4EF"/>
                    <path d="M23 11.5H11.5V23H23V11.5Z" fill="#FFB900"/>
                  </svg>
                  Sign in with Microsoft
                </>
              )}
            </button>
          </div>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Only @student.keystoneacademy.cn and @keystoneacademy.cn email addresses are allowed</p>
          </div>
        </div>
      </div>
    </Layout>
  );
} 