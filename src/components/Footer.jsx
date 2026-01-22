import React from 'react';

export default function Footer({ lastUpdated }) {
  return (
    <footer className="mt-12 py-8 bg-gray-100 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-sm text-gray-600 mb-2">
          Data compiled from public library websites.
          {lastUpdated && ` Last updated: ${lastUpdated}.`}
        </p>

        <div className="flex justify-center gap-4 text-sm mb-4">
          <a
            href="https://github.com/your-username/ma-library-of-things"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            Contribute on GitHub
          </a>
          <span className="text-gray-300">|</span>
          <a
            href="#about"
            className="text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            About this project
          </a>
          <span className="text-gray-300">|</span>
          <a
            href="mailto:feedback@example.com"
            className="text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            Report an issue
          </a>
        </div>

        <p className="text-xs text-gray-500 mb-2">
          This site is an independent community project. It is not affiliated with,
          endorsed by, or officially connected to any library network or individual library.
          For official information, please contact your local library directly.
        </p>

        <details className="text-xs text-gray-500 mb-2">
          <summary className="cursor-pointer hover:text-gray-700">
            Some libraries excluded due to Terms of Service restrictions
          </summary>
          <div className="mt-2 p-3 bg-gray-50 rounded text-left max-w-md mx-auto">
            <p className="mb-2">The following libraries have Terms of Service that prohibit automated data collection:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Boston Public Library</strong> - BiblioCommons ToS</li>
              <li><strong>Brooklyn Public Library</strong> - BiblioCommons ToS</li>
              <li><strong>SAILS Network</strong> (Bridgewater, W. Bridgewater) - robots.txt restrictions</li>
            </ul>
            <p className="mt-2">Please visit these libraries directly for their Library of Things offerings.</p>
          </div>
        </details>
        <p className="text-xs text-gray-400">
          Created by <a href="https://davidreinstein.org" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">David Reinstein</a> with assistance from Claude AI
        </p>
      </div>
    </footer>
  );
}
