import React from 'react';
import { getCategoryIcon } from '../utils/categories';
import { getCatalogUrl, getNetworkInfo } from '../utils/catalogUrls';
import { formatDistance } from '../utils/location';

export default function ItemCard({ item }) {
  const networkInfo = getNetworkInfo(item.network);
  const itemUrl = item.source_url || item.catalog_url ||
    getCatalogUrl(item.network, item.catalog_id, item.name);
  const isSourceUrl = !!item.source_url;

  return (
    <div className="index-card cursor-pointer group">
      {/* Category and name */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold mb-1 group-hover:text-[#8B4513] transition-colors">
            {item.name}
          </h3>

          {item.description && (
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        {/* Link */}
        {itemUrl && (
          <a
            href={itemUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 text-[#8B4513] hover:underline text-sm font-mono uppercase tracking-wider"
            title={isSourceUrl ? "View Library of Things page" : "Search in library catalog"}
            onClick={(e) => e.stopPropagation()}
          >
            View →
          </a>
        )}
      </div>

      {/* Meta info */}
      <div className="mt-4 pt-3 border-t border-dashed border-[#D4C5A9] flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="text-gray-500 font-mono text-xs uppercase tracking-wider">
          {getCategoryIcon(item.category)} {item.category}
        </span>

        <div className="flex items-center gap-2">
          {/* Distance badge */}
          {item._distance !== undefined && item._distance !== Infinity && (
            <span className="font-mono text-xs text-[#8B4513]">
              {formatDistance(item._distance)}
            </span>
          )}

          <span className="text-gray-400">•</span>
          <span className="text-gray-600">{item.library}</span>

          {networkInfo && (
            <span
              className="network-badge text-xs"
              style={{ color: networkInfo.color, borderColor: networkInfo.color }}
            >
              {networkInfo.shortName}
            </span>
          )}
        </div>
      </div>

      {/* Stale data warning */}
      {item.last_verified && isStale(item.last_verified) && (
        <div className="mt-2 text-xs text-amber-700 font-mono flex items-center gap-1">
          ⚠ Not recently verified
        </div>
      )}
    </div>
  );
}

function isStale(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const daysDiff = (now - date) / (1000 * 60 * 60 * 24);
  return daysDiff > 90;
}
