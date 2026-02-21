import React, { useState } from 'react';
import ItemCard from './ItemCard';
import { getCategoryIcon } from '../utils/categories';

export default function ItemList({ items, viewMode = 'category' }) {
  const [expandedCategories, setExpandedCategories] = useState(
    new Set(['Home Improvement', 'Technology', 'Outdoor/Camping'])
  );

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

  const expandAll = () => {
    const allCategories = [...new Set(items.map(i => i.category))];
    setExpandedCategories(new Set(allCategories));
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
  };

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {items.map((item, idx) => (
          <ItemCard key={item.id || idx} item={item} />
        ))}
      </div>
    );
  }

  // Group by category
  const grouped = items.reduce((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const sortedCategories = Object.keys(grouped).sort();

  return (
    <div>
      {/* Expand/Collapse controls */}
      <div className="flex justify-end gap-4 mb-4 text-sm font-mono">
        <button
          onClick={expandAll}
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

      <div className="space-y-4">
        {sortedCategories.map(category => (
          <div key={category} className="catalog-card overflow-hidden">
            {/* Category header */}
            <button
              onClick={() => toggleCategory(category)}
              className="w-full flex items-center justify-between p-4 bg-[#F5F1E6] hover:bg-[#EDE9DE] transition-colors border-b border-[#D4C5A9]"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{getCategoryIcon(category)}</span>
                <span className="font-semibold text-lg">{category}</span>
                <span className="font-mono text-sm text-[#8B4513] border border-[#8B4513] px-2 py-0.5">
                  {grouped[category].length}
                </span>
              </div>
              <span className="text-[#8B4513] text-lg font-mono">
                {expandedCategories.has(category) ? '−' : '+'}
              </span>
            </button>

            {/* Category items */}
            {expandedCategories.has(category) && (
              <div className="p-4 space-y-3">
                {grouped[category].map((item, idx) => (
                  <ItemCard key={item.id || idx} item={item} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
