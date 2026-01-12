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
      <div className="space-y-3">
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
      <div className="flex justify-end gap-2 mb-3 text-sm">
        <button
          onClick={expandAll}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Expand all
        </button>
        <span className="text-gray-300">|</span>
        <button
          onClick={collapseAll}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Collapse all
        </button>
      </div>

      <div className="space-y-3">
        {sortedCategories.map(category => (
          <div key={category} className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Category header */}
            <button
              onClick={() => toggleCategory(category)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{getCategoryIcon(category)}</span>
                <span className="font-semibold text-gray-800">{category}</span>
                <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-sm">
                  {grouped[category].length}
                </span>
              </div>
              <span className="text-gray-400 text-lg">
                {expandedCategories.has(category) ? '−' : '+'}
              </span>
            </button>

            {/* Category items */}
            {expandedCategories.has(category) && (
              <div className="p-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
