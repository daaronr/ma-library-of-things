import React from 'react';
import { getCategoryIcon } from '../utils/categories';
import LocationInput from './LocationInput';
import RadiusFilter from './RadiusFilter';

export default function FilterPanel({
  networks,
  selectedNetworks,
  onNetworkChange,
  libraryList,
  selectedLibrary,
  onLibraryChange,
  categories,
  selectedCategory,
  onCategoryChange,
  userLocation,
  onLocationChange,
  onClearLocation,
  radiusMiles,
  onRadiusChange,
  freeOnly,
  onFreeOnlyChange,
  onClearAll,
}) {
  const hasFilters = selectedNetworks.length > 0 ||
                     selectedLibrary !== 'all' ||
                     selectedCategory !== 'all' ||
                     userLocation !== null ||
                     freeOnly;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6 space-y-4">
      {/* Location and Radius filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-gray-100">
        <LocationInput
          userLocation={userLocation}
          onLocationChange={onLocationChange}
          onClear={onClearLocation}
        />
        <RadiusFilter
          radius={radiusMiles}
          onRadiusChange={onRadiusChange}
          disabled={!userLocation}
        />
      </div>

      {/* Network, Library, Category filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Network checkboxes */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(networks).map(([id, network]) => (
            <label
              key={id}
              className={`
                inline-flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer
                border-2 transition-all text-sm font-medium
                ${selectedNetworks.includes(id)
                  ? 'border-transparent text-white'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }
              `}
              style={selectedNetworks.includes(id) ? { backgroundColor: network.color } : {}}
            >
              <input
                type="checkbox"
                checked={selectedNetworks.includes(id)}
                onChange={() => onNetworkChange(id)}
                className="sr-only"
              />
              {network.shortName}
            </label>
          ))}
        </div>

        {/* Library dropdown */}
        <select
          value={selectedLibrary}
          onChange={(e) => onLibraryChange(e.target.value)}
          className="flex-1 min-w-[200px] p-2 border border-gray-200 rounded-lg text-sm"
        >
          <option value="all">All Libraries ({libraryList.length})</option>
          {libraryList.map(lib => (
            <option key={lib} value={lib}>{lib}</option>
          ))}
        </select>

        {/* Category dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="flex-1 min-w-[180px] p-2 border border-gray-200 rounded-lg text-sm"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {getCategoryIcon(cat)} {cat}
            </option>
          ))}
        </select>

        {/* Free only toggle */}
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={freeOnly}
            onChange={(e) => onFreeOnlyChange(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
          />
          <span className="text-sm text-gray-700">Free only</span>
        </label>

        {/* Clear filters */}
        {hasFilters && (
          <button
            onClick={onClearAll}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
