import { useState } from 'react';
import { getUserLocation, getZipCoordinatesAsync, isValidZip } from '../utils/location';

export default function LocationInput({ userLocation, onLocationChange, onClear }) {
  const [zipInput, setZipInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationSource, setLocationSource] = useState(null);

  const handleUseMyLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const location = await getUserLocation();
      onLocationChange(location);
      setLocationSource('gps');
      setZipInput('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleZipSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const zip = zipInput.trim();
    if (!isValidZip(zip)) {
      setError('Please enter a valid 5-digit ZIP code');
      return;
    }

    setLoading(true);
    try {
      const coords = await getZipCoordinatesAsync(zip);
      if (coords) {
        onLocationChange(coords);
        setLocationSource(`ZIP ${zip}`);
      } else {
        setError('ZIP code not found. Try a nearby ZIP or use your location.');
      }
    } catch (err) {
      setError('Failed to look up ZIP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setZipInput('');
    setError(null);
    setLocationSource(null);
    onClear();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Your Location
      </label>

      {userLocation ? (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {locationSource || 'Location set'}
          </span>
          <button
            onClick={handleClear}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Clear
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <button
            onClick={handleUseMyLocation}
            disabled={loading}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-0.5 mr-1.5 h-3.5 w-3.5 text-gray-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Getting location...
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Use my location
              </>
            )}
          </button>

          <div className="text-xs text-gray-500">or</div>

          <form onSubmit={handleZipSubmit} className="flex gap-2">
            <input
              type="text"
              value={zipInput}
              onChange={(e) => setZipInput(e.target.value)}
              placeholder="Enter ZIP code"
              maxLength={10}
              disabled={loading}
              className="block w-28 px-2 py-1.5 text-xs border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!zipInput.trim() || loading}
              className="px-2 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '...' : 'Go'}
            </button>
          </form>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
