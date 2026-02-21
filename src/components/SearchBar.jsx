import React from 'react';

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="flex border-2 border-[#2C2416] bg-white">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search the catalog..."}
        className="flex-1 p-4 text-lg bg-transparent border-none outline-none"
        style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
      />
      {value ? (
        <button
          onClick={() => onChange('')}
          className="px-6 bg-transparent border-none text-gray-400 hover:text-[#2C2416] cursor-pointer text-xl"
        >
          ×
        </button>
      ) : (
        <button className="btn-primary">
          Find
        </button>
      )}
    </div>
  );
}
