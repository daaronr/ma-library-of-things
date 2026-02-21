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
  sortBy,
  onSortChange,
  onClearAll,
}) {
  const hasFilters = selectedNetworks.length > 0 ||
                     selectedLibrary !== 'all' ||
                     selectedCategory !== 'all' ||
                     userLocation !== null ||
                     freeOnly ||
                     sortBy !== 'category';

  return (
    <div className="space-y-4 mb-6">
      {/* Search card with location */}
      <div className="catalog-card p-6 relative">
        <div className="section-label absolute -top-2.5 left-4 bg-[#F5F1E6] px-2">
          Search Filters
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-dashed border-[#D4C5A9]">
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

        {/* Drawer tabs for categories */}
        <div className="flex flex-wrap gap-0 mt-4 -mx-1">
          {['all', 'Home Improvement', 'Technology', 'Outdoor/Camping', 'Gardening', 'Kitchen'].map(cat => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`drawer-tab ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat === 'all' ? 'All Items' : getCategoryIcon(cat) + ' ' + cat.split('/')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Network and Library filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Network checkboxes */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(networks).map(([id, network]) => (
            <label
              key={id}
              className={`
                inline-flex items-center gap-2 px-3 py-1.5 cursor-pointer
                border transition-all text-sm font-mono uppercase tracking-wider
                ${selectedNetworks.includes(id)
                  ? 'border-[#8B4513] text-[#8B4513] bg-[#FFFDF5]'
                  : 'border-[#D4C5A9] text-gray-600 hover:border-gray-400'
                }
              `}
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
          className="flex-1 min-w-[200px] p-2 border border-[#D4C5A9] bg-[#FFFDF5] text-sm font-mono"
        >
          <option value="all">All Libraries ({libraryList.length})</option>
          {libraryList.map(lib => (
            <option key={lib} value={lib}>{lib}</option>
          ))}
        </select>

        {/* Sort dropdown */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="p-2 border border-[#D4C5A9] bg-[#FFFDF5] text-sm font-mono"
        >
          <option value="category">Sort: By Category</option>
          <option value="name">Sort: A-Z</option>
          <option value="library">Sort: By Library</option>
          {userLocation && <option value="distance">Sort: Nearest</option>}
        </select>

        {/* Free only toggle */}
        <label className="inline-flex items-center gap-2 cursor-pointer font-mono text-sm">
          <input
            type="checkbox"
            checked={freeOnly}
            onChange={(e) => onFreeOnlyChange(e.target.checked)}
            className="w-4 h-4 accent-[#8B4513]"
          />
          <span>Free only</span>
        </label>

        {/* Clear filters */}
        {hasFilters && (
          <button
            onClick={onClearAll}
            className="text-sm text-gray-500 hover:text-[#8B4513] underline font-mono"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
