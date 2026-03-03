import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import ItemList from './components/ItemList';
import Footer from './components/Footer';
import SubmitLibrary from './components/SubmitLibrary';
import Dashboard from './components/Dashboard';
import { networkCatalogs } from './utils/catalogUrls';
import { calculateDistance } from './utils/location';

export default function App() {
  const [data, setData] = useState(null);
  const [librariesData, setLibrariesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('catalog'); // 'catalog' or 'dashboard'

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNetworks, setSelectedNetworks] = useState([]);
  const [selectedLibrary, setSelectedLibrary] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Location state
  const [userLocation, setUserLocation] = useState(null);
  const [radiusMiles, setRadiusMiles] = useState(null);

  // Access filter
  const [freeOnly, setFreeOnly] = useState(false);

  // Sorting
  const [sortBy, setSortBy] = useState('category');

  // Load data
  useEffect(() => {
    Promise.all([
      fetch('/data/all_networks.json').then(res => {
        if (!res.ok) throw new Error('Failed to load data');
        return res.json();
      }),
      fetch('/data/libraries.json').then(res => {
        if (!res.ok) return {}; // Libraries file is optional
        return res.json();
      }).catch(() => ({}))
    ])
      .then(([itemsData, libData]) => {
        setData(itemsData);
        setLibrariesData(libData);
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
    // Convert snake_case keys from JSON to camelCase for JS
    const merged = { ...networkCatalogs };
    Object.entries(data.networks).forEach(([id, network]) => {
      const normalized = {
        ...network,
        shortName: network.shortName || network.short_name,
        catalogSystem: network.catalogSystem || network.catalog_system,
        catalogBaseUrl: network.catalogBaseUrl || network.catalog_base_url,
      };
      if (merged[id]) {
        merged[id] = { ...merged[id], ...normalized };
      } else {
        merged[id] = normalized;
      }
    });
    return merged;
  }, [data]);

  // Get coordinates for an item (from item or from libraries lookup)
  const getItemCoordinates = (item) => {
    if (item.coordinates) return item.coordinates;
    // Look up from libraries data
    if (librariesData) {
      const libEntry = Object.values(librariesData).find(
        lib => lib.name === item.library && lib.network === item.network
      );
      if (libEntry?.coordinates) return libEntry.coordinates;
    }
    return null;
  };

  // Filter items
  const filteredItems = useMemo(() => {
    if (!data?.items) return [];

    let items = data.items.map(item => {
      // Attach coordinates and calculate distance if user location is set
      const coords = getItemCoordinates(item);
      const enrichedItem = { ...item, coordinates: coords };

      if (userLocation && coords) {
        enrichedItem._distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          coords.lat,
          coords.lng
        );
      }
      return enrichedItem;
    });

    // Apply filters
    items = items.filter(item => {
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

      // Radius filter (only if user location and radius are set)
      if (userLocation && radiusMiles !== null) {
        if (!item._distance || item._distance > radiusMiles) return false;
      }

      // Free only filter
      if (freeOnly) {
        const network = availableNetworks[item.network];
        if (network?.fee_structure && network.fee_structure !== 'free') return false;
      }

      return true;
    });

    // Sort items based on selected sort option
    if (sortBy === 'distance' && userLocation) {
      items.sort((a, b) => (a._distance || Infinity) - (b._distance || Infinity));
    } else if (sortBy === 'name') {
      items.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortBy === 'library') {
      items.sort((a, b) => (a.library || '').localeCompare(b.library || ''));
    } else if (sortBy === 'category') {
      items.sort((a, b) => {
        const catCompare = (a.category || '').localeCompare(b.category || '');
        if (catCompare !== 0) return catCompare;
        return (a.name || '').localeCompare(b.name || '');
      });
    }

    return items;
  }, [data, librariesData, searchTerm, selectedNetworks, selectedLibrary, selectedCategory, userLocation, radiusMiles, freeOnly, availableNetworks, sortBy]);

  // Derive library list and categories from filtered data (respecting network filter)
  const { libraryList, categories } = useMemo(() => {
    if (!data?.items) return { libraryList: [], categories: [] };

    // Filter items by network first for library list
    const networkFilteredItems = selectedNetworks.length > 0
      ? data.items.filter(i => selectedNetworks.includes(i.network))
      : data.items;

    const libs = [...new Set(networkFilteredItems.map(i => i.library))].sort();
    const cats = [...new Set(data.items.map(i => i.category))].filter(Boolean).sort();

    return { libraryList: libs, categories: cats };
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
    setUserLocation(null);
    setRadiusMiles(null);
    setFreeOnly(false);
    setSortBy('category');
  };

  const clearLocation = () => {
    setUserLocation(null);
    setRadiusMiles(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B4513] mx-auto mb-4"></div>
          <p className="text-gray-600 font-mono uppercase tracking-wider text-sm">Loading catalog...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="catalog-card p-8 max-w-md text-center">
          <div className="text-5xl mb-4">📋</div>
          <h1 className="text-xl font-semibold mb-2">Unable to Load Catalog</h1>
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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Header stats={stats} onShowDashboard={() => setView('dashboard')} showDashboardLink={view === 'catalog'} />

        {view === 'dashboard' ? (
          <Dashboard data={data} networks={availableNetworks} onBack={() => setView('catalog')} />
        ) : (
          <>

        {/* Search */}
        <div className="catalog-card p-6 mb-4 relative">
          <div className="section-label absolute -top-2.5 left-4 bg-[#F5F1E6] px-2">
            Search
          </div>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search the catalog..."
          />
        </div>

        {/* Filters */}
        <FilterPanel
          networks={availableNetworks}
          selectedNetworks={selectedNetworks}
          onNetworkChange={handleNetworkChange}
          libraryList={libraryList}
          selectedLibrary={selectedLibrary}
          onLibraryChange={setSelectedLibrary}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          userLocation={userLocation}
          onLocationChange={setUserLocation}
          onClearLocation={clearLocation}
          radiusMiles={radiusMiles}
          onRadiusChange={setRadiusMiles}
          freeOnly={freeOnly}
          onFreeOnlyChange={setFreeOnly}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onClearAll={clearAllFilters}
        />

        {/* Results count */}
        <div className="text-sm text-gray-600 mb-4 font-mono">
          Showing <span className="text-[#8B4513] font-semibold">{filteredItems.length}</span> of {data?.items?.length || 0} items
          {searchTerm && ` matching "${searchTerm}"`}
        </div>

        {/* Items */}
        {filteredItems.length === 0 ? (
          <div className="catalog-card p-8 text-center">
            <div className="text-4xl mb-4">📭</div>
            <h3 className="text-lg font-semibold mb-2">No items found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <button onClick={clearAllFilters} className="btn-secondary">
              Clear all filters
            </button>
          </div>
        ) : (
          <ItemList items={filteredItems} viewMode={sortBy === 'category' ? 'category' : 'list'} />
        )}

        <Footer lastUpdated={data?.metadata?.last_updated} />
        <SubmitLibrary />
        </>
        )}
      </div>
    </div>
  );
}
