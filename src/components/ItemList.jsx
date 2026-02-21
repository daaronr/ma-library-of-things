import React, { useState } from 'react';
import ItemCard from './ItemCard';
import { getCategoryIcon } from '../utils/categories';

// Minimum items for a category to have its own section
const MIN_CATEGORY_SIZE = 5;

export default function ItemList({ items, viewMode = 'category' }) {
  // Start with all categories collapsed
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  const toggleCategory = (category) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const expandAll = (categories) => {
    setExpandedCategories(new Set(categories));
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
  };

  // Group by category, combining small ones into "Other"
  const groupItems = (items) => {
    const initial = items.reduce((acc, item) => {
      const cat = item.category || 'Other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});

    // Find small categories and combine into "Other"
    const grouped = {};
    const otherItems = [];

    Object.entries(initial).forEach(([cat, catItems]) => {
      if (catItems.length < MIN_CATEGORY_SIZE) {
        otherItems.push(...catItems);
      } else {
        grouped[cat] = catItems;
      }
    });

    if (otherItems.length > 0) {
      grouped['Other'] = otherItems;
    }

    return grouped;
  };

  if (viewMode === 'list') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {items.map((item, idx) => (
          <ItemCard key={item.id || idx} item={item} compact />
        ))}
      </div>
    );
  }

  const grouped = groupItems(items);
  const sortedCategories = Object.keys(grouped).sort((a, b) => {
    // Put "Other" at the end
    if (a === 'Other') return 1;
    if (b === 'Other') return -1;
    return a.localeCompare(b);
  });

  return (
    <div>
      {/* Expand/Collapse controls */}
      <div className="flex justify-end gap-4 mb-4 text-sm font-mono">
        <button
          onClick={() => expandAll(sortedCategories)}
          className="text-[#8B4513] hover:underline uppercase tracking-wider"
        >
          Expand all
        </button>
        <span className="text-[#D4C5A9]">|</span>
        <button
          onClick={collapseAll}
          className="text-[#8B4513] hover:underline uppercase tracking-wider"
        >
          Collapse all
        </button>
      </div>

      <div className="space-y-3">
        {sortedCategories.map(category => (
          <div key={category} className="border border-[#D4C5A9] bg-[#FFFDF5]">
            {/* Category header */}
            <button
              onClick={() => toggleCategory(category)}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#F5F1E6] hover:bg-[#EDE9DE] transition-colors border-b border-[#D4C5A9]"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{getCategoryIcon(category)}</span>
                <span className="font-semibold">{category}</span>
                <span className="font-mono text-sm text-[#8B4513] border border-[#8B4513] px-2 py-0.5">
                  {grouped[category].length}
                </span>
              </div>
              <span className="text-[#8B4513] text-lg font-mono">
                {expandedCategories.has(category) ? '−' : '+'}
              </span>
            </button>

            {/* Category items - grid layout */}
            {expandedCategories.has(category) && (
              <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                {grouped[category].map((item, idx) => (
                  <ItemCard key={item.id || idx} item={item} compact />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
