import React from 'react';
import { getCategoryIcon } from '../utils/categories';
import { getCatalogUrl, getNetworkInfo } from '../utils/catalogUrls';

export default function ItemCard({ item }) {
  const networkInfo = getNetworkInfo(item.network);
  const catalogUrl = item.catalog_url ||
    getCatalogUrl(item.network, item.catalog_id, item.name);

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Item name and description */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{getCategoryIcon(item.category)}</span>
            <h3 className="font-semibold text-gray-900 truncate">
              {item.name}
            </h3>
          </div>

          {item.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {item.description}
            </p>
          )}

          {/* Library and network info */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-gray-500">{item.library}</span>
            {networkInfo && (
              <span
                className="network-badge"
                style={{ backgroundColor: networkInfo.color }}
              >
                {networkInfo.shortName}
              </span>
            )}
          </div>
        </div>

        {/* Catalog link */}
        {catalogUrl && (
          <a
            href={catalogUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
            title="View in library catalog"
          >
            <span className="hidden sm:inline">Catalog</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        )}
      </div>

      {/* Stale data warning */}
      {item.last_verified && isStale(item.last_verified) && (
        <div className="mt-2 text-xs text-amber-600 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Not recently verified
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
