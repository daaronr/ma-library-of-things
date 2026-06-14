import React, { useState } from 'react';

const LINKBACK_SNIPPET = '<a href="https://masslibraryofthings.netlify.app">Find our Library of Things on Library of Things USA</a>';

export default function Footer({ lastUpdated }) {
  const [copied, setCopied] = useState(false);

  const copyLinkback = () => {
    navigator.clipboard?.writeText(LINKBACK_SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

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

        {/* For libraries: get listed, get in touch, and link back to us */}
        <div className="mb-4 p-4 bg-[#FFFDF5] border border-[#D4C5A9] max-w-lg mx-auto rounded text-xs text-gray-600 leading-relaxed text-left">
          <p className="font-mono uppercase tracking-wider text-[#8B4513] mb-2 text-center">For Libraries</p>
          <p className="mb-3">
            <strong className="text-[#2C2416]">Have a Library of Things?</strong>{' '}
            We'd love to list it so more patrons can discover what you lend — free of charge.
            To get listed, or to update, correct, or remove your data, email{' '}
            <a href="mailto:david@davidreinstein.org" className="text-[#8B4513] underline hover:text-[#6B3410]">
              david@davidreinstein.org
            </a>{' '}
            or{' '}
            <a
              href="https://github.com/daaronr/ma-library-of-things/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8B4513] underline hover:text-[#6B3410]"
            >
              open a GitHub issue
            </a>. We respond promptly.
          </p>
          <p className="mb-1">
            <strong className="text-[#2C2416]">Already listed?</strong>{' '}
            Help your patrons find this resource — add a link from your Library of Things page:
          </p>
          <div className="flex items-stretch gap-2 mt-1">
            <code className="flex-1 bg-[#F5F1E6] border border-[#D4C5A9] p-2 text-[11px] break-all select-all">
              {LINKBACK_SNIPPET}
            </code>
            <button
              onClick={copyLinkback}
              className="shrink-0 border border-[#2C2416] px-2 font-mono uppercase tracking-wider text-[10px] hover:bg-[#2C2416] hover:text-[#FFFDF5] transition-colors"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

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

        <p className="text-xs text-gray-400 mb-4">
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

        <div className="text-xs text-gray-500 border-t border-[#D4C5A9] pt-4 max-w-md mx-auto">
          <span className="font-mono uppercase tracking-wider text-gray-400 text-xs">See also: </span>
          <a
            href="https://impact-products-directory.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8B4513] hover:underline"
          >
            Impact Products &amp; Services Directory
          </a>
          {' '}&mdash; a directory of organizations and products that donate profits or commit to charitable giving, with verified impact claims.
        </div>
      </div>
    </footer>
  );
}
