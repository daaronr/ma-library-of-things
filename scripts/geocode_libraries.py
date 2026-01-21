#!/usr/bin/env python3
"""
Geocode library addresses to get coordinates.

Uses OpenStreetMap Nominatim API (free, 1 req/sec limit).
Falls back to address-based lookup if exact address fails.

Usage:
    python scripts/geocode_libraries.py
    python scripts/geocode_libraries.py --dry-run
    python scripts/geocode_libraries.py --library "Morse Institute Library"
"""

import json
import time
import argparse
import re
from pathlib import Path
from typing import Optional

try:
    import requests
except ImportError:
    print("Please install requests: pip install requests")
    exit(1)


SCRIPT_DIR = Path(__file__).parent
DATA_DIR = SCRIPT_DIR.parent / "data"
LIBRARIES_FILE = DATA_DIR / "libraries.json"
CACHE_FILE = DATA_DIR / "geocode_cache.json"

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
USER_AGENT = "LibraryOfThings-Geocoder/1.0 (https://github.com/daaronr/ma-library-of-things)"

# Rate limiting
REQUESTS_PER_SECOND = 1
last_request_time = 0


def load_cache() -> dict:
    """Load geocoding cache from file."""
    if CACHE_FILE.exists():
        try:
            with open(CACHE_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except json.JSONDecodeError:
            return {}
    return {}


def save_cache(cache: dict):
    """Save geocoding cache to file."""
    with open(CACHE_FILE, 'w', encoding='utf-8') as f:
        json.dump(cache, f, indent=2, ensure_ascii=False)


def rate_limit():
    """Ensure we don't exceed rate limits."""
    global last_request_time
    elapsed = time.time() - last_request_time
    if elapsed < (1 / REQUESTS_PER_SECOND):
        time.sleep((1 / REQUESTS_PER_SECOND) - elapsed)
    last_request_time = time.time()


def geocode_address(address: str, cache: dict) -> Optional[dict]:
    """
    Geocode an address using Nominatim.

    Args:
        address: Full address string
        cache: Cache dictionary for storing results

    Returns:
        Dict with 'lat' and 'lng' keys, or None if not found
    """
    # Check cache first
    cache_key = address.lower().strip()
    if cache_key in cache:
        cached = cache[cache_key]
        if cached:
            return {"lat": cached["lat"], "lng": cached["lng"]}
        return None

    rate_limit()

    params = {
        'q': address,
        'format': 'json',
        'limit': 1,
        'countrycodes': 'us',
        'addressdetails': 1,
    }
    headers = {'User-Agent': USER_AGENT}

    try:
        response = requests.get(NOMINATIM_URL, params=params, headers=headers, timeout=10)
        response.raise_for_status()

        results = response.json()
        if results:
            result = results[0]
            coords = {
                'lat': float(result['lat']),
                'lng': float(result['lon']),
                'display_name': result.get('display_name', ''),
            }
            cache[cache_key] = coords
            return {"lat": coords['lat'], "lng": coords['lng']}

        # Cache the miss too
        cache[cache_key] = None
        return None

    except requests.RequestException as e:
        print(f"  Error geocoding '{address}': {e}")
        return None


def geocode_location(location: str, cache: dict) -> Optional[dict]:
    """
    Geocode a location string (city, state format).

    Args:
        location: Location like "Natick, MA"
        cache: Cache dictionary

    Returns:
        Dict with 'lat' and 'lng' keys, or None if not found
    """
    # Expand state abbreviations
    state_map = {
        'MA': 'Massachusetts',
        'CT': 'Connecticut',
        'RI': 'Rhode Island',
        'NY': 'New York',
        'NJ': 'New Jersey',
        'PA': 'Pennsylvania',
        'VT': 'Vermont',
        'NH': 'New Hampshire',
        'ME': 'Maine',
    }

    # Try to expand state abbreviation
    expanded = location
    for abbr, full in state_map.items():
        if f", {abbr}" in location:
            expanded = location.replace(f", {abbr}", f", {full}")
            break

    return geocode_address(expanded, cache)


def process_libraries(dry_run: bool = False, library_filter: str = None) -> dict:
    """
    Process all libraries and geocode missing coordinates.

    Args:
        dry_run: If True, don't modify files
        library_filter: Only process library with this name

    Returns:
        Statistics dictionary
    """
    # Load existing data
    if not LIBRARIES_FILE.exists():
        print(f"Libraries file not found: {LIBRARIES_FILE}")
        return {"error": "File not found"}

    with open(LIBRARIES_FILE, 'r', encoding='utf-8') as f:
        libraries = json.load(f)

    cache = load_cache()

    stats = {
        "total": 0,
        "already_geocoded": 0,
        "newly_geocoded": 0,
        "failed": 0,
        "skipped": 0,
    }

    print(f"Processing {len(libraries)} libraries...")
    print()

    modified = False

    for lib_id, lib_data in libraries.items():
        stats["total"] += 1
        name = lib_data.get("name", lib_id)

        # Filter if specified
        if library_filter and library_filter.lower() not in name.lower():
            stats["skipped"] += 1
            continue

        # Skip if already has coordinates
        if lib_data.get("coordinates") and lib_data["coordinates"].get("lat"):
            stats["already_geocoded"] += 1
            print(f"✓ {name}: Already geocoded")
            continue

        # Try to geocode
        address = lib_data.get("address")
        location = lib_data.get("location")

        coords = None
        source = None

        if address:
            print(f"→ {name}: Geocoding address '{address}'...")
            coords = geocode_address(address, cache)
            source = "address"

        if not coords and location:
            print(f"→ {name}: Geocoding location '{location}'...")
            coords = geocode_location(location, cache)
            source = "location"

        if coords:
            stats["newly_geocoded"] += 1
            print(f"  ✓ Found: {coords['lat']:.4f}, {coords['lng']:.4f} (from {source})")

            if not dry_run:
                lib_data["coordinates"] = coords
                modified = True
        else:
            stats["failed"] += 1
            print(f"  ✗ Could not geocode")

    # Save results
    if modified and not dry_run:
        with open(LIBRARIES_FILE, 'w', encoding='utf-8') as f:
            json.dump(libraries, f, indent=2, ensure_ascii=False)
        print(f"\n✓ Updated {LIBRARIES_FILE}")

        # Also copy to public/data
        public_file = SCRIPT_DIR.parent / "public" / "data" / "libraries.json"
        with open(public_file, 'w', encoding='utf-8') as f:
            json.dump(libraries, f, indent=2, ensure_ascii=False)
        print(f"✓ Updated {public_file}")

    # Save cache
    save_cache(cache)
    print(f"✓ Cache saved ({len(cache)} entries)")

    return stats


def main():
    parser = argparse.ArgumentParser(
        description="Geocode library addresses to get coordinates"
    )
    parser.add_argument(
        "--dry-run", "-n",
        action="store_true",
        help="Don't modify files, just show what would be done"
    )
    parser.add_argument(
        "--library", "-l",
        type=str,
        default=None,
        help="Only process library with this name (partial match)"
    )
    args = parser.parse_args()

    if args.dry_run:
        print("DRY RUN - No files will be modified\n")

    stats = process_libraries(
        dry_run=args.dry_run,
        library_filter=args.library
    )

    print("\n" + "=" * 40)
    print("Summary:")
    print(f"  Total libraries: {stats.get('total', 0)}")
    print(f"  Already geocoded: {stats.get('already_geocoded', 0)}")
    print(f"  Newly geocoded: {stats.get('newly_geocoded', 0)}")
    print(f"  Failed: {stats.get('failed', 0)}")
    if stats.get('skipped', 0):
        print(f"  Skipped (filter): {stats.get('skipped', 0)}")


if __name__ == "__main__":
    main()
