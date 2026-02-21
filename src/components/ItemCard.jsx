import React from 'react';
import { getCatalogUrl, getNetworkInfo } from '../utils/catalogUrls';
import { formatDistance } from '../utils/location';

export default function ItemCard({ item, compact = false }) {
  const networkInfo = getNetworkInfo(item.network);
  const itemUrl = item.source_url || item.catalog_url ||
    getCatalogUrl(item.network, item.catalog_id, item.name);

  if (compact) {
    return (
      <a
        href={itemUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-[#FFFDF5] border border-[#D4C5A9] p-3 hover:border-[#8B4513] hover:shadow-sm transition-all group"
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold leading-tight group-hover:text-[#8B4513] transition-colors line-clamp-2">
            {item.name}
          </h3>
          <span className="text-[#8B4513] text-xs shrink-0">→</span>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2 text-xs text-gray-500">
          <span className="truncate">{item.library}</span>
          {item._distance !== undefined && item._distance !== Infinity && (
            <span className="font-mono text-[#8B4513] shrink-0">
              {formatDistance(item._distance)}
            </span>
          )}
          {networkInfo && (
            <span
              className="shrink-0 px-1.5 py-0.5 text-[10px] font-mono uppercase border"
              style={{ color: networkInfo.color, borderColor: networkInfo.color }}
            >
              {networkInfo.shortName}
            </span>
          )}
        </div>
      </a>
    );
  }

  // Full card for list view
  return (
    <div className="index-card cursor-pointer group">
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
        {itemUrl && (
          <a
            href={itemUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 text-[#8B4513] hover:underline text-sm font-mono uppercase tracking-wider"
            onClick={(e) => e.stopPropagation()}
          >
            View →
          </a>
        )}
      </div>
      <div className="mt-4 pt-3 border-t border-dashed border-[#D4C5A9] flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="text-gray-600">{item.library}</span>
        <div className="flex items-center gap-2">
          {item._distance !== undefined && item._distance !== Infinity && (
            <span className="font-mono text-xs text-[#8B4513]">
              {formatDistance(item._distance)}
            </span>
          )}
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
    </div>
  );
}
