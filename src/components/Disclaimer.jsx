import React from 'react';

export default function Disclaimer() {
  return (
    <div className="bg-[#FFFDF5] border border-[#D4C5A9] p-4">
      <div className="flex gap-3">
        <span className="text-xl">📋</span>
        <p className="text-sm text-[#2C2416]">
          <strong className="font-mono uppercase tracking-wider text-xs">Independent Resource:</strong>{' '}
          This is a community-maintained catalog, not affiliated with or endorsed by any library.
          Data may be incomplete or outdated. Always verify availability directly.
        </p>
      </div>
    </div>
  );
}
