const RADIUS_OPTIONS = [
  { value: 5, label: '5 miles' },
  { value: 10, label: '10 miles' },
  { value: 25, label: '25 miles' },
  { value: 50, label: '50 miles' },
  { value: null, label: 'Any distance' },
];

export default function RadiusFilter({ radius, onRadiusChange, disabled }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Search Radius
      </label>
      <div className="flex flex-wrap gap-1.5">
        {RADIUS_OPTIONS.map((option) => (
          <button
            key={option.value ?? 'any'}
            onClick={() => onRadiusChange(option.value)}
            disabled={disabled}
            className={`
              px-2.5 py-1 text-xs font-medium rounded-full transition-colors
              ${disabled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : radius === option.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
      {disabled && (
        <p className="text-xs text-gray-500 italic">
          Set your location to filter by distance
        </p>
      )}
    </div>
  );
}
