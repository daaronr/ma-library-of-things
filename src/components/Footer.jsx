import React from 'react';

export default function Footer({ lastUpdated }) {
  return (
    <footer className="mt-12 py-8 border-t-2 border-dashed border-[#D4C5A9]">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <p className="text-sm text-gray-600 mb-4 font-mono">
          Data compiled from public library websites.
          {lastUpdated && ` Last updated: ${lastUpdated}.`}
        </p>

        <div className="flex justify-center gap-6 text-sm mb-6 font-mono uppercase tracking-wider">
          <a
            href="https://github.com/daaronr/ma-library-of-things"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8B4513] hover:underline"
          >
            GitHub
          </a>
          <span className="text-[#D4C5A9]">•</span>
          <a
            href="https://github.com/daaronr/ma-library-of-things/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8B4513] hover:underline"
          >
            Report Issue
          </a>
        </div>

        <p className="text-xs text-gray-500 mb-4 max-w-lg mx-auto leading-relaxed">
          This site is an independent community project. It is not affiliated with,
          endorsed by, or officially connected to any library network or individual library.
          For official information, please contact your local library directly.
        </p>

        <details className="text-xs text-gray-500 mb-4">
          <summary className="cursor-pointer hover:text-[#8B4513] font-mono uppercase tracking-wider">
            Excluded Libraries
          </summary>
          <div className="mt-3 p-4 bg-[#FFFDF5] border border-[#D4C5A9] text-left max-w-md mx-auto">
            <p className="mb-2">Some libraries have Terms of Service that prohibit automated data collection:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Boston Public Library — BiblioCommons ToS</li>
              <li>Brooklyn Public Library — BiblioCommons ToS</li>
              <li>SAILS Network — robots.txt</li>
            </ul>
          </div>
        </details>

        <p className="text-xs text-gray-400">
          Created by{' '}
          <a
            href="https://davidreinstein.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8B4513] hover:underline"
          >
            David Reinstein
          </a>
          {' '}with assistance from Claude AI
        </p>
      </div>
    </footer>
  );
}
