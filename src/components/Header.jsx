import React from 'react';
import Disclaimer from './Disclaimer';

export default function Header({ stats, onShowDashboard, showDashboardLink }) {
  return (
    <header className="mb-6">
      <Disclaimer />

      <div className="catalog-card p-8 md:p-10 mt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="section-label">Subject Card Catalog — Main Collection</div>
          {showDashboardLink && (
            <button
              onClick={onShowDashboard}
              className="text-sm font-mono text-[#8B4513] hover:text-[#6B3410] transition-colors flex items-center gap-1.5 border border-[#D4C5A9] px-3 py-1.5 rounded hover:bg-[#F5F1E6]"
            >
              <span>📊</span>
              <span>Statistics</span>
            </button>
          )}
        </div>

        <h1 className="text-3xl md:text-5xl font-semibold leading-tight mb-4">
          Library of <span className="text-[#8B4513] underline decoration-wavy underline-offset-4">Things</span>
        </h1>

        <p className="text-lg leading-relaxed max-w-2xl mb-6">
          A community catalog of tools, technology, and equipment available for borrowing
          from public libraries and tool lending libraries across the United States.
        </p>

        <div className="flex flex-wrap items-end justify-between gap-6">
          {stats && (
            <div className="flex flex-wrap gap-6 pt-4 border-t-2 border-dashed border-[#D4C5A9]">
              <StatItem value={stats.totalItems} label="items" />
              <StatItem value={stats.totalLibraries} label="locations" />
              <StatItem value={stats.totalNetworks} label="networks" />
              <StatItem value={stats.toolItems} label="tools" />
            </div>
          )}

          <div className="stamp">
            Free to Borrow
          </div>
        </div>
      </div>
    </header>
  );
}

function StatItem({ value, label }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-semibold text-[#8B4513]">{value}</span>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  );
}
