import { useState, useEffect } from 'react';

const TERMS_STORAGE_KEY = 'storyRelayTermsAccepted';

export default function TermsModal({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const [showModal, setShowModal] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    if (typeof open === 'boolean') {
      setShowModal(open);
    } else {
      const hasAcceptedTerms = localStorage.getItem(TERMS_STORAGE_KEY);
      if (!hasAcceptedTerms) {
        setShowModal(true);
      }
    }
  }, [open]);

  const handleAccept = () => {
    if (dontShowAgain) {
      localStorage.setItem(TERMS_STORAGE_KEY, 'true');
    }
    if (onClose) {
      onClose();
    } else {
      setShowModal(false);
    }
  };

  if (!showModal) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      if (onClose) {
        onClose();
      } else {
        setShowModal(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center" onClick={handleOverlayClick}>
      <div className="bg-white/95 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto bg-[#CD1D43]" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <h2 className="text-2xl font-bold themed-text-primary mb-4">Rules & Guidelines for Round Square Storytelling Relay</h2>
          <div className="space-y-4 themed-text-primary text-sm">
            <p className="font-semibold">The bold parts are the rules. The rest are clarifications, so please read them if you don't know what they mean.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-bold">Your response will be limited to 500 words</span>
                <ul className="pl-2 mt-1">
                  <li>As this is a group storytelling activity, please try not to write too much content at once. You may have some great ideas on how the story can develop, but instead of closing the story for everyone (and thus killing all the dramatic suspense and the collaborative fun), instead try to indicate these ideas in a more discreet way - consider <a href="https://www.masterclass.com/articles/how-to-use-foreshadowing-in-your-writing" className="italic underline text-blue-800" target="_blank" rel="noopener noreferrer">foreshadowing</a> (<a href="https://self-publishingschool.com/foreshadowing-examples/" className="underline text-blue-800" target="_blank" rel="noopener noreferrer">here are some examples</a>) or other methods to hint at how the story will progress.</li>
                </ul>
              </li>
              <li>
                <span className="font-bold">Be careful if you're writing the introduction</span>
                <ul className="pl-2 mt-1">
                  <li>Thank you for your courage as you set off to create a whole new world! Your entry will be the first entry after the prompt, and it is important for you to signal how the story will go, and set the underlying tone for the narrative. Thus, you will have more artistic freedom, but the responsibilities are heavy. Typically, here are the things covered in this exposition.</li>
                  <li>
                    <span className="font-bold">The setting, most of the people involved, etc. are all important</span>
                    <ul className="mt-1">
                      <li>We're not just looking for "the defense attorney" here, we're looking for some description about him. What is his demeanor like? Is he aggressive? Satirical? Charming? Does he speak in an eloquent fashion? Similarly, we don't want a "new, high-tech classroom." Try to show, not tell.</li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>
                <span className="font-bold">You may only respond once per day</span>
                <ul className="pl-2 mt-1">
                  <li>Yes, this is all very annoying, but this is also to make the story move on over time and create a bit of a continual flow. As we have said, please use foreshadowing to indicate the plot, and if there's something you really want to respond to that's earlier in the storyline, feel free to use the branching!</li>
                </ul>
              </li>
              <li>
                <span className="font-bold">Use branches if you'd like</span>
                <ul className="pl-2 mt-1">
                  <li>Do you know that you can respond to every prompt, not just the latest ones? Well, that's true now! Feel free to respond to passages that are higher up in the order if you'd like to explore an interesting possibility. This will be like an alternate universe of events, which can easily have an entirely different ending!</li>
                </ul>
              </li>
              <li>
                <span className="font-bold">Do not "kill off" the story</span>
                <ul className="pl-2 mt-1">
                  <li>Time keeps on moving, and so should the story. It's fine if characters stay stuck in one place, or if a lead gets broken, but please don't kill off everyone in the first 50 words! Writing "suddenly, a jet crashed into the building, killing Mateo and the rest of the court" is not going to help if there's nothing that happens later on. You can have all the bad endings in the world if you wish, however, if it's the logical (at least let's say understandable/ comprehensible) conclusion to a climax or if there's still a narrative line carrying on coherently despite bad things happening.</li>
                </ul>
              </li>
              <li>
                <span className="font-bold">Try to leave clear indications</span>
                <ul className="pl-2 mt-1">
                  <li>Since the other people have to deduce the plot AND possible follow-up content, please try to leave clear indications of how the plot is going. This can be done however you want, including the usage of foreshadowing and other devices, just make sure that everything's not too confusing (Faulkner would serve as a prime example of "too confusing").</li>
                </ul>
              </li>
              <li>
                <span className="font-bold">The plot is continuous</span>
                <ul className="pl-2 mt-1">
                  <li>The plot should carry on, so the focus should be the same. If the characters suddenly change behavior in the middle of the story, please try your best to explain why that is the case. For example, a governmental employee who has just witnessed the government pollute the environment will naturally trade their support for disgust, but the audience won't know that without it being a decently explicit section of the story. It's fine to leave things out, as long as an appropriate amount of figurative "blank space" is included (for example: a character changing their attitude after going on a lengthy stroll).</li>
                </ul>
              </li>
              <li>
                <span className="font-bold">Our five beautiful shared values</span>
                <ul className="pl-2 mt-1">
                  <li>Keystone Academy follows the Five Shared Values, and we really hope that you can do the same! Please know that name-calling, insults, inappropriate content, swearing, and other content that do not follow the Five Shared Values will not be accepted. You're always logged in when you post, so we will find you if you break this rule. However, we really hope that it won't happen.</li>
                </ul>
              </li>
              <li>
                <span className="font-bold">Enjoy the story relay!</span>
              </li>
            </ul>
          </div>
          <div className="mt-6 flex items-center space-x-2">
            <input
              type="checkbox"
              id="dontShowAgain"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="dontShowAgain" className="text-sm themed-text-primary">
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