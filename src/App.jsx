import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import ItemList from './components/ItemList';
import Footer from './components/Footer';
import { networkCatalogs } from './utils/catalogUrls';

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNetworks, setSelectedNetworks] = useState([]);
  const [selectedLibrary, setSelectedLibrary] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Load data
  useEffect(() => {
    fetch('/data/all_networks.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load data');
        return res.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Derive available networks from data
  const availableNetworks = useMemo(() => {
    if (!data?.networks) return networkCatalogs;
    // Merge loaded network info with catalog info
    const merged = { ...networkCatalogs };
    Object.entries(data.networks).forEach(([id, network]) => {
      if (merged[id]) {
        merged[id] = { ...merged[id], ...network };
      } else {
        merged[id] = network;
      }
    });
    return merged;
  }, [data]);

  // Filter items
  const filteredItems = useMemo(() => {
    if (!data?.items) return [];

    return data.items.filter(item => {
      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
          item.name?.toLowerCase().includes(term) ||
          item.description?.toLowerCase().includes(term) ||
          item.category?.toLowerCase().includes(term) ||
          item.library?.toLowerCase().includes(term);
        if (!matchesSearch) return false;
      }

      // Network filter
      if (selectedNetworks.length > 0) {
        if (!selectedNetworks.includes(item.network)) return false;
      }

      // Library filter
      if (selectedLibrary !== 'all') {
        if (item.library !== selectedLibrary) return false;
      }

      // Category filter
      if (selectedCategory !== 'all') {
        if (item.category !== selectedCategory) return false;
      }

      return true;
    });
  }, [data, searchTerm, selectedNetworks, selectedLibrary, selectedCategory]);

  // Derive libraries and categories from filtered data (respecting network filter)
  const { libraries, categories } = useMemo(() => {
    if (!data?.items) return { libraries: [], categories: [] };

    // Filter items by network first for library list
    const networkFilteredItems = selectedNetworks.length > 0
      ? data.items.filter(i => selectedNetworks.includes(i.network))
      : data.items;

    const libs = [...new Set(networkFilteredItems.map(i => i.library))].sort();
    const cats = [...new Set(data.items.map(i => i.category))].filter(Boolean).sort();

    return { libraries: libs, categories: cats };
  }, [data, selectedNetworks]);

  // Stats
  const stats = useMemo(() => {
    if (!data?.items) return null;

    const toolCategories = [
      'Home Improvement',
      'Measurement & Detection',
      'Home Inspection',
      'Auto/Vehicle',
      'Bicycle',
      'Gardening',
    ];

    return {
      totalItems: data.items.length,
      totalLibraries: [...new Set(data.items.map(i => i.library))].length,
      totalNetworks: Object.keys(data.networks || {}).length || Object.keys(availableNetworks).length,
      toolItems: data.items.filter(i => toolCategories.includes(i.category)).length,
    };
  }, [data, availableNetworks]);

  // Handlers
  const handleNetworkChange = (networkId) => {
    setSelectedNetworks(prev =>
      prev.includes(networkId)
        ? prev.filter(n => n !== networkId)
        : [...prev, networkId]
    );
    // Reset library filter when network changes
    setSelectedLibrary('all');
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedNetworks([]);
    setSelectedLibrary('all');
    setSelectedCategory('all');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading library data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Unable to Load Data</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Header stats={stats} />

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search items, categories, or libraries..."
          />
        </div>

        {/* Filters */}
        <FilterPanel
          networks={availableNetworks}
          selectedNetworks={selectedNetworks}
          onNetworkChange={handleNetworkChange}
          libraries={libraries}
          selectedLibrary={selectedLibrary}
          onLibraryChange={setSelectedLibrary}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onClearAll={clearAllFilters}
        />

        {/* Results count */}
        <div className="text-sm text-gray-600 mb-4">
          Showing {filteredItems.length} of {data?.items?.length || 0} items
          {searchTerm && ` matching "${searchTerm}"`}
        </div>

        {/* Items */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No items found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <button onClick={clearAllFilters} className="btn-secondary">
              Clear all filters
            </button>
          </div>
        ) : (
          <ItemList items={filteredItems} viewMode="category" />
        )}

        <Footer lastUpdated={data?.metadata?.last_updated} />
      </div>
    </div>
  );
}
