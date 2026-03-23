import React, { useMemo } from 'react';

const ALL_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DC','DE','FL',
  'GA','HI','ID','IL','IN','IA','KS','KY','LA','ME',
  'MD','MA','MI','MN','MS','MO','MT','NE','NV','NH',
  'NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI',
  'SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
];

const STATE_NAMES = {
  AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',
  CO:'Colorado',CT:'Connecticut',DC:'Washington DC',DE:'Delaware',FL:'Florida',
  GA:'Georgia',HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',
  IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',
  MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',
  MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',
  NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',
  OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',
  SC:'South Carolina',SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',
  VT:'Vermont',VA:'Virginia',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming'
};

export default function Dashboard({ data, networks, onBack }) {
  const stats = useMemo(() => {
    if (!data?.items) return null;

    const items = data.items;

    // Items by category
    const byCategory = {};
    items.forEach(item => {
      const cat = item.category || 'Uncategorized';
      byCategory[cat] = (byCategory[cat] || 0) + 1;
    });

    // Items by state
    const byState = {};
    Object.entries(networks).forEach(([id, network]) => {
      const state = network.state || 'Unknown';
      const stateItems = items.filter(i => i.network === id).length;
      if (stateItems > 0) {
        byState[state] = (byState[state] || 0) + stateItems;
      }
    });

    // Items by organization type
    const byOrgType = { 'Public Library': 0, 'Tool Library': 0, 'Other': 0 };
    items.forEach(item => {
      const network = networks[item.network];
      const orgType = network?.org_type || network?.orgType;
      if (orgType === 'tool_library') {
        byOrgType['Tool Library']++;
      } else if (orgType === 'public_library' || !orgType) {
        byOrgType['Public Library']++;
      } else {
        byOrgType['Other']++;
      }
    });

    // Top libraries
    const byLibrary = {};
    items.forEach(item => {
      const lib = item.library || 'Unknown';
      byLibrary[lib] = (byLibrary[lib] || 0) + 1;
    });
    const topLibraries = Object.entries(byLibrary)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // Fee structure
    const byFee = { 'Free': 0, 'Membership': 0, 'Sliding Scale': 0 };
    items.forEach(item => {
      const network = networks[item.network];
      const fee = network?.fee_structure || network?.feeStructure || 'free';
      if (fee === 'free') {
        byFee['Free']++;
      } else if (fee === 'membership') {
        byFee['Membership']++;
      } else if (fee === 'sliding_scale') {
        byFee['Sliding Scale']++;
      } else {
        byFee['Free']++;
      }
    });

    // Unique states covered
    const statesCovered = new Set();
    Object.values(networks).forEach(network => {
      if (network.state) statesCovered.add(network.state);
    });

    // Missing states
    const missingStates = ALL_STATES.filter(s => !statesCovered.has(s));

    // Most common items (normalized names)
    const normalizeName = (name) => {
      let n = name.toLowerCase().trim();
      ['portable ', 'digital ', 'cordless ', 'electric '].forEach(p => { n = n.replace(p, ''); });
      return n;
    };
    const nameCounts = {};
    items.forEach(item => {
      const n = normalizeName(item.name);
      if (!nameCounts[n]) nameCounts[n] = { count: 0, states: new Set(), originalName: item.name };
      nameCounts[n].count++;
      const st = networks[item.network]?.state;
      if (st) nameCounts[n].states.add(st);
    });
    const mostCommon = Object.entries(nameCounts)
      .map(([key, val]) => ({ name: val.originalName, count: val.count, states: val.states.size }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    // Unique item count
    const uniqueCount = Object.values(nameCounts).filter(v => v.count === 1).length;

    // Estimated value of collection (rough retail estimates)
    const VALUE_ESTIMATES = {
      'pressure washer': 300, 'miter saw': 250, 'telescope': 200, 'sewing machine': 180,
      'kayak': 500, 'paddleboard': 400, 'e-bike': 1200, 'projector': 250,
      'gopro': 350, 'laptop': 500, 'chromebook': 250, 'ipad': 400,
      'metal detector': 200, 'thermal': 300, 'drill': 100, 'circular saw': 120,
      'impact wrench': 150, 'rotary hammer': 200, 'air compressor': 180,
      'record player': 100, 'turntable': 100, 'ukulele': 50, 'guitar': 150,
      'karaoke': 80, 'binocular': 120, 'microscope': 150, 'cricut': 300,
      'wifi hotspot': 60, 'mobile hotspot': 60, 'hotspot': 60,
      'snowshoe': 120, 'fishing': 80, 'pickleball': 40, 'bocce': 35,
      'blood pressure': 40, 'light therapy': 50, 'radon detector': 150,
      'kill-a-watt': 25, 'stud finder': 25, 'laser level': 60,
      'board game': 30, 'cake pan': 15, 'cookie cutter': 10,
      'food dehydrator': 60, 'ice cream maker': 40, 'canning': 30,
      'tent': 150, 'sleeping bag': 60, 'camping': 100,
      'table saw': 400, 'band saw': 350, 'jointer': 500, 'planer': 350,
      'tractor': 25000, 'wood splitter': 800,
    };

    const valuedItems = items.map(item => {
      const t = `${item.name} ${item.description || ''}`.toLowerCase();
      let value = 50; // default
      let matchedKey = null;
      Object.entries(VALUE_ESTIMATES).forEach(([key, val]) => {
        if (t.includes(key) && val > value) {
          value = val;
          matchedKey = key;
        }
      });
      return { ...item, estimatedValue: value, state: networks[item.network]?.state || '?' };
    });

    const totalEstimatedValue = valuedItems.reduce((sum, i) => sum + i.estimatedValue, 0);

    const mostExpensive = [...valuedItems]
      .sort((a, b) => b.estimatedValue - a.estimatedValue)
      .slice(0, 12);

    const leastExpensive = [...valuedItems]
      .filter(i => i.estimatedValue <= 30)
      .sort((a, b) => a.estimatedValue - b.estimatedValue);
    const cheapSample = leastExpensive.slice(0, 8);

    // Average value per state
    const stateValues = {};
    const stateCounts = {};
    valuedItems.forEach(item => {
      const st = item.state;
      stateValues[st] = (stateValues[st] || 0) + item.estimatedValue;
      stateCounts[st] = (stateCounts[st] || 0) + 1;
    });
    const stateAvgValue = Object.entries(stateValues)
      .map(([st, total]) => ({ state: st, total, avg: Math.round(total / stateCounts[st]), count: stateCounts[st] }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    return {
      totalItems: items.length,
      totalLibraries: Object.keys(byLibrary).length,
      totalNetworks: Object.keys(networks).length,
      statesCovered: statesCovered.size,
      missingStates,
      byCategory: Object.entries(byCategory).sort((a, b) => b[1] - a[1]),
      byState: Object.entries(byState).sort((a, b) => b[1] - a[1]),
      byOrgType,
      topLibraries,
      byFee,
      lastUpdated: data.metadata?.last_updated,
      mostCommon,
      uniqueCount,
      totalEstimatedValue,
      mostExpensive,
      cheapSample,
      stateAvgValue,
    };
  }, [data, networks]);

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading statistics...</p>
      </div>
    );
  }

  const maxCategoryCount = Math.max(...stats.byCategory.map(([, count]) => count));
  const maxStateCount = Math.max(...stats.byState.map(([, count]) => count));
  const maxLibraryCount = stats.topLibraries[0]?.[1] || 1;
  const totalFeeItems = Object.values(stats.byFee).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#8B4513] hover:text-[#6B3410] transition-colors font-mono text-sm"
      >
        <span>&larr;</span>
        <span>Back to Catalog</span>
      </button>

      {/* Header */}
      <div className="catalog-card p-8">
        <div className="section-label mb-4">Statistical Analysis</div>
        <h1 className="text-3xl md:text-4xl font-semibold mb-4">
          Collection <span className="text-[#8B4513]">Dashboard</span>
        </h1>
        <p className="text-gray-600 max-w-2xl">
          An overview of all borrowable items in our nationwide catalog, organized by category, location, and access type.
        </p>
        {stats.lastUpdated && (
          <p className="text-xs text-gray-400 mt-2 font-mono">
            Data last updated: {stats.lastUpdated}
          </p>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard value={stats.totalItems.toLocaleString()} label="Total Items" icon="📦" />
        <StatCard value={stats.totalLibraries} label="Libraries" icon="🏛️" />
        <StatCard value={stats.totalNetworks} label="Networks" icon="🔗" />
        <StatCard value={`${stats.statesCovered}/51`} label="States + DC" icon="🗺️" />
        <StatCard value={`$${Math.round(stats.totalEstimatedValue / 1000)}k`} label="Est. Retail Value" icon="💰" />
      </div>

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Items by Category */}
        <div className="catalog-card p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <span>📊</span> Items by Category
          </h3>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
            {stats.byCategory.map(([category, count]) => (
              <BarItem
                key={category}
                label={category}
                value={count}
                max={maxCategoryCount}
                color="#8B4513"
              />
            ))}
          </div>
        </div>

        {/* Items by State */}
        <div className="catalog-card p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <span>🗺️</span> Items by State
          </h3>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
            {stats.byState.map(([state, count]) => (
              <BarItem
                key={state}
                label={state}
                value={count}
                max={maxStateCount}
                color="#2E7D32"
              />
            ))}
          </div>
        </div>

        {/* Organization Type */}
        <div className="catalog-card p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <span>🏢</span> By Organization Type
          </h3>
          <div className="flex flex-col gap-4">
            {Object.entries(stats.byOrgType)
              .filter(([, count]) => count > 0)
              .map(([type, count]) => {
                const percent = ((count / stats.totalItems) * 100).toFixed(1);
                const colors = {
                  'Public Library': '#1565C0',
                  'Tool Library': '#2E7D32',
                  'Other': '#6A1B9A',
                };
                return (
                  <div key={type} className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: colors[type] }}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between text-sm">
                        <span>{type}</span>
                        <span className="font-mono text-gray-600">{count.toLocaleString()} ({percent}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${percent}%`, backgroundColor: colors[type] }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Fee Structure */}
        <div className="catalog-card p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <span>💰</span> Access Type
          </h3>
          <div className="flex flex-col gap-4">
            {Object.entries(stats.byFee)
              .filter(([, count]) => count > 0)
              .map(([type, count]) => {
                const percent = ((count / totalFeeItems) * 100).toFixed(1);
                const colors = {
                  'Free': '#2E7D32',
                  'Membership': '#FF6F00',
                  'Sliding Scale': '#1565C0',
                };
                return (
                  <div key={type} className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: colors[type] }}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between text-sm">
                        <span>{type}</span>
                        <span className="font-mono text-gray-600">{count.toLocaleString()} ({percent}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${percent}%`, backgroundColor: colors[type] }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Top Libraries */}
      <div className="catalog-card p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <span>🏆</span> Top 10 Libraries by Collection Size
        </h3>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
          {stats.topLibraries.map(([library, count], index) => (
            <div key={library} className="flex items-center gap-3">
              <span className="text-sm font-mono text-gray-400 w-5">{index + 1}.</span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-sm truncate">{library}</span>
                  <span className="font-mono text-sm text-[#8B4513] flex-shrink-0">{count}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#8B4513] transition-all"
                    style={{ width: `${(count / maxLibraryCount) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Geographic Coverage */}
      <div className="catalog-card p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <span>📍</span> Geographic Coverage
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {ALL_STATES.map(state => {
            const count = stats.byState.find(([s]) => s === state)?.[1];
            const covered = !!count;
            return (
              <div
                key={state}
                className={`rounded px-2 py-1.5 text-center transition-colors ${
                  covered
                    ? 'bg-[#F5F1E6] border border-[#D4C5A9] hover:bg-[#EDE3CC]'
                    : 'bg-gray-50 border border-gray-200 opacity-50'
                }`}
                title={`${STATE_NAMES[state]}${count ? `: ${count} items` : ': No programs found'}`}
              >
                <div className={`font-semibold text-sm ${covered ? 'text-[#8B4513]' : 'text-gray-400'}`}>
                  {state}
                </div>
                {covered && (
                  <div className="text-[10px] text-gray-500 font-mono">{count}</div>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-sm text-gray-500">
          Coverage: {stats.statesCovered} of 51 (50 states + DC) &mdash; {((stats.statesCovered / 51) * 100).toFixed(0)}%
          {stats.missingStates.length > 0 && (
            <span className="ml-2 text-gray-400">
              Missing: {stats.missingStates.map(s => STATE_NAMES[s] || s).join(', ')}
            </span>
          )}
        </p>
      </div>

      {/* Most Common Items */}
      <div className="catalog-card p-6">
        <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
          <span>🔁</span> Most Common Items Across Libraries
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          {stats.uniqueCount.toLocaleString()} of {stats.totalItems.toLocaleString()} items appear at only one library
        </p>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-1.5">
          {stats.mostCommon.map((item, i) => (
            <div key={item.name} className="flex items-center gap-3 py-1">
              <span className="text-sm font-mono text-gray-400 w-5">{i + 1}.</span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-sm truncate">{item.name}</span>
                  <span className="font-mono text-xs text-gray-500 flex-shrink-0">
                    {item.count}x in {item.states} states
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#8B4513] transition-all"
                    style={{ width: `${(item.count / stats.mostCommon[0].count) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estimated Value */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="catalog-card p-6">
          <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
            <span>💎</span> Highest-Value Items
          </h3>
          <p className="text-xs text-gray-400 mb-4">Estimated retail replacement cost</p>
          <div className="space-y-2">
            {stats.mostExpensive.map((item, i) => (
              <div key={`${item.id || i}`} className="flex items-center gap-2 text-sm">
                <span className="font-mono text-gray-400 w-4 text-xs">{i + 1}.</span>
                <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                  <div className="truncate">
                    <span className="text-gray-700">{item.name}</span>
                    <span className="text-[10px] text-gray-400 ml-1.5">{item.state}</span>
                  </div>
                  <span className="font-mono text-sm text-[#2E7D32] flex-shrink-0 font-semibold">
                    ~${item.estimatedValue.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="catalog-card p-6">
          <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
            <span>🏦</span> Collection Value by State
          </h3>
          <p className="text-xs text-gray-400 mb-4">Total estimated retail value of listed items</p>
          <div className="space-y-2">
            {stats.stateAvgValue.map((sv) => (
              <div key={sv.state} className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-[#8B4513] w-6">{sv.state}</span>
                <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden">
                  <div
                    className="h-full rounded bg-[#2E7D32] transition-all flex items-center justify-end pr-2"
                    style={{ width: `${Math.max((sv.total / stats.stateAvgValue[0].total) * 100, 12)}%` }}
                  >
                    <span className="text-xs text-white font-mono">${(sv.total / 1000).toFixed(1)}k</span>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 w-20 text-right font-mono">
                  avg ${sv.avg}/item
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3 italic">
            Estimates based on typical retail prices. Actual library inventory value is much higher —
            many collections have thousands of items we show only a sample of.
          </p>
        </div>
      </div>

      {/* Fun Facts */}
      <div className="catalog-card p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <span>🎯</span> Quick Facts
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FactCard
            label="Most ubiquitous item"
            value={stats.mostCommon[0]?.name}
            detail={`Found in ${stats.mostCommon[0]?.states} states`}
          />
          <FactCard
            label="Most unique collection"
            value={`${stats.uniqueCount} one-of-a-kind items`}
            detail={`${Math.round((stats.uniqueCount / stats.totalItems) * 100)}% of all items`}
          />
          <FactCard
            label="If you bought it all"
            value={`~$${Math.round(stats.totalEstimatedValue / 1000).toLocaleString()}k`}
            detail="Estimated retail replacement cost"
          />
        </div>
      </div>

      {/* Data Export */}
      <div className="catalog-card p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <span>📥</span> Data Export
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Download the complete dataset for research or analysis purposes.
          All data is sourced from publicly accessible library websites.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="/data/all_networks.json"
            download="library-of-things-data.json"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <span>Download JSON</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label, icon }) {
  return (
    <div className="catalog-card p-4 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-semibold text-[#8B4513]">{value}</div>
      <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
    </div>
  );
}

function FactCard({ label, value, detail }) {
  return (
    <div className="bg-[#FFFDF5] border border-[#E8DCC8] rounded p-4">
      <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-lg font-semibold text-[#8B4513]">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{detail}</div>
    </div>
  );
}

function BarItem({ label, value, max, color }) {
  const percent = (value / max) * 100;
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="w-32 truncate text-gray-700" title={label}>{label}</div>
      <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden">
        <div
          className="h-full rounded transition-all flex items-center justify-end pr-2"
          style={{ width: `${Math.max(percent, 8)}%`, backgroundColor: color }}
        >
          <span className="text-xs text-white font-mono">{value}</span>
        </div>
      </div>
    </div>
  );
}
