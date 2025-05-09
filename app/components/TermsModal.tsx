import { useState, useEffect } from 'react';

const TERMS_STORAGE_KEY = 'storyRelayTermsAccepted';

export default function TermsModal() {
  const [showModal, setShowModal] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const hasAcceptedTerms = localStorage.getItem(TERMS_STORAGE_KEY);
    if (!hasAcceptedTerms) {
      setShowModal(true);
    }
  }, []);

  const handleAccept = () => {
    if (dontShowAgain) {
      localStorage.setItem(TERMS_STORAGE_KEY, 'true');
    }
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="bg-white/95 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto terms-modal-dark">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Round Square Day Story Relay</h2>
          
          <div className="space-y-4 text-gray-600">
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Terms of Use</h3>
              <p className="mb-2">By using this platform, you agree to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Write appropriate and respectful content</li>
                <li>Not share any personal or sensitive information</li>
                <li>Respect other users' contributions</li>
                <li>Follow the story continuation rules</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Browse existing stories on the homepage</li>
                <li>Click "Write from here" on any story you want to continue</li>
                <li>Write 1-5 sentences to continue the story</li>
                <li>Add a brief summary of your continuation</li>
                <li>Submit your story for review</li>
              </ol>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Story Rules</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Each story branch can have up to 5 continuations</li>
                <li>Your story will be reviewed before being published</li>
                <li>Keep your content school-appropriate</li>
                <li>Be creative and have fun!</li>
              </ul>
            </section>
          </div>

          <div className="mt-6 flex items-center space-x-2">
            <input
              type="checkbox"
              id="dontShowAgain"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="dontShowAgain" className="text-sm text-gray-600">
              Don't show this again
            </label>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleAccept}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 