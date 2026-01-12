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

        <p className="text-xs text-gray-500">
          This site is an independent community project. It is not affiliated with,
          endorsed by, or officially connected to any library network or individual library.
          For official information, please contact your local library directly.
        </p>
      </div>
    </footer>
  );
}
