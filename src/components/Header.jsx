import React from 'react';
import Disclaimer from './Disclaimer';

export default function Header({ stats }) {
  return (
    <header className="mb-6">
      <Disclaimer />

      <div className="bg-white rounded-xl shadow-sm p-6 mt-4">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-5xl">📚</span>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-900">
              Massachusetts Library of Things
            </h1>
            <p className="text-indigo-600">
              Search borrowable items across library networks
            </p>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            <StatCard
              value={stats.totalItems}
              label="Items"
              color="indigo"
            />
            <StatCard
              value={stats.totalLibraries}
              label="Libraries"
              color="green"
            />
            <StatCard
              value={stats.totalNetworks}
              label="Networks"
              color="purple"
            />
            <StatCard
              value={stats.toolItems}
              label="Tool Items"
              color="orange"
            />
          </div>
        )}
      </div>
    </header>
  );
}

function StatCard({ value, label, color }) {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-700',
    green: 'bg-green-50 text-green-700',
    purple: 'bg-purple-50 text-purple-700',
    orange: 'bg-orange-50 text-orange-700',
  };

  return (
    <div className={`rounded-lg p-3 text-center ${colors[color]}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs">{label}</div>
    </div>
  );
}
