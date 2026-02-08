import React, { useState } from 'react';

export default function SubmitLibrary() {
  const [isOpen, setIsOpen] = useState(false);

  const googleFormUrl = "https://forms.gle/YOUR_FORM_ID"; // Replace with actual form URL
  const githubIssueUrl = "https://github.com/daaronr/ma-library-of-things/issues/new?template=add-library.md&title=Add+Library:+[Library+Name]";

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all hover:scale-105 z-40"
      >
        <span className="text-xl">➕</span>
        <span className="hidden sm:inline font-medium">Add Your Library</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>

            <div className="text-center mb-6">
              <span className="text-5xl mb-4 block">🏛️</span>
              <h2 className="text-2xl font-bold text-gray-900">Add Your Library</h2>
              <p className="text-gray-600 mt-2">
                Know a library with a "Library of Things" program? Help us grow the database!
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-indigo-50 rounded-lg p-4">
                <h3 className="font-semibold text-indigo-900 mb-2">What we need:</h3>
                <ul className="text-sm text-indigo-800 space-y-1">
                  <li>✓ Library name and location</li>
                  <li>✓ Link to their "Library of Things" page</li>
                  <li>✓ (Optional) List of items they offer</li>
                </ul>
              </div>

              <a
                href={githubIssueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gray-900 hover:bg-gray-800 text-white text-center py-3 rounded-lg font-medium transition-colors"
              >
                📝 Submit via GitHub
              </a>

              <a
                href="mailto:library-of-things@example.com?subject=Add Library: [Library Name]&body=Library Name:%0D%0ALocation (City, State):%0D%0ALibrary of Things URL:%0D%0A%0D%0AItems offered (optional):%0D%0A"
                className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center py-3 rounded-lg font-medium transition-colors"
              >
                ✉️ Submit via Email
              </a>

              <p className="text-xs text-gray-500 text-center">
                We verify that libraries allow automated access before adding them.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
