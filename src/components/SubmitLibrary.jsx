import React, { useState } from 'react';

export default function SubmitLibrary() {
  const [isOpen, setIsOpen] = useState(false);

  const githubIssueUrl = "https://github.com/daaronr/ma-library-of-things/issues/new?template=add-library.md&title=Add+Library:+[Library+Name]";

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-[#2C2416] hover:bg-[#8B4513] text-[#FFFDF5] px-4 py-3 flex items-center gap-2 transition-all z-40 font-mono uppercase tracking-wider text-sm border-2 border-[#2C2416] hover:border-[#8B4513]"
        style={{ boxShadow: '4px 4px 0 #D4C5A9' }}
      >
        <span className="text-lg">+</span>
        <span className="hidden sm:inline">Add Library</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="catalog-card max-w-md w-full p-8 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#2C2416] text-2xl"
            >
              ×
            </button>

            <div className="text-center mb-6">
              <span className="text-4xl mb-4 block">🏛️</span>
              <h2 className="text-2xl font-semibold">Add Your Library</h2>
              <p className="text-gray-600 mt-2">
                Know a library with a "Library of Things" program? Help us grow the catalog!
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-[#F5F1E6] border border-[#D4C5A9] p-4">
                <h3 className="font-mono uppercase tracking-wider text-xs mb-2 text-[#8B4513]">What we need:</h3>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>✓ Library name and location</li>
                  <li>✓ Link to their "Library of Things" page</li>
                  <li>✓ (Optional) List of items they offer</li>
                </ul>
              </div>

              <a
                href={githubIssueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-[#2C2416] hover:bg-[#8B4513] text-[#FFFDF5] text-center py-3 font-mono uppercase tracking-wider text-sm transition-colors"
              >
                Submit via GitHub →
              </a>

              <a
                href="https://github.com/daaronr/ma-library-of-things/discussions/new?category=library-suggestions"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full border-2 border-[#2C2416] hover:border-[#8B4513] text-[#2C2416] hover:text-[#8B4513] text-center py-3 font-mono uppercase tracking-wider text-sm transition-colors"
              >
                Start a Discussion
              </a>

              <p className="text-xs text-gray-500 text-center font-mono">
                We verify that libraries allow automated access before adding them.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
