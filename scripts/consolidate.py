#!/usr/bin/env python3
"""
Consolidate all network JSON files into a single all_networks.json file.

Usage:
    python scripts/consolidate.py
    python scripts/consolidate.py --output public/data/all_networks.json
"""

import json
import argparse
import hashlib
from pathlib import Path
from datetime import datetime


SCRIPT_DIR = Path(__file__).parent
DATA_DIR = SCRIPT_DIR.parent / "data"
PUBLIC_DATA_DIR = SCRIPT_DIR.parent / "public" / "data"

# Network file mapping
NETWORK_FILES = {
    "minuteman": "minuteman_items.json",
    "cwmars": "cwmars_items.json",
    "sails": "sails_items.json",
    "mbln": "mbln_items.json",
    "bpl": "bpl_items.json",
}

# Network metadata (used if not in JSON file)
NETWORK_METADATA = {
    "minuteman": {
        "name": "Minuteman Library Network",
        "short_name": "MLN",
        "region": "MetroWest Boston",
        "catalog_system": "aspen_discovery",
        "catalog_base_url": "https://catalog.minlib.net",
        "website": "https://www.minlib.net",
        "color": "#1E88E5",
    },
    "cwmars": {
        "name": "CWMARS",
        "short_name": "CW",
        "region": "Central/Western MA",
        "catalog_system": "evergreen",
        "catalog_base_url": "https://catalog.cwmars.org",
        "website": "https://www.cwmars.org",
        "color": "#43A047",
    },
    "sails": {
        "name": "SAILS Library Network",
        "short_name": "SAILS",
        "region": "Southeastern MA",
        "catalog_system": "sirsidynix",
        "catalog_base_url": "https://sails.ent.sirsi.net",
        "website": "https://sailsinc.org",
        "color": "#FB8C00",
    },
    "mbln": {
        "name": "Metro Boston Library Network",
        "short_name": "MBLN",
        "region": "Greater Boston",
        "catalog_system": "polaris",
        "catalog_base_url": "https://catalog.mbln.org",
        "website": "https://www.mbln.org",
        "color": "#8E24AA",
    },
    "bpl": {
        "name": "Boston Public Library",
        "short_name": "BPL",
        "region": "Boston",
        "catalog_system": "bibliocommons",
        "catalog_base_url": "https://bpl.bibliocommons.com",
        "website": "https://www.bpl.org",
        "color": "#D81B60",
    },
}


def slugify(text: str) -> str:
    """Convert text to a URL-friendly slug."""
    return text.lower().replace(" ", "_").replace("'", "").replace("-", "_")


def generate_item_id(network_id: str, library: str, item_name: str) -> str:
    """Generate a unique ID for an item."""
    # Create a hash-based ID to handle long names
    raw = f"{network_id}_{slugify(library)}_{slugify(item_name)}"
    if len(raw) > 80:
        # Use hash for very long IDs
        hash_suffix = hashlib.md5(raw.encode()).hexdigest()[:8]
        raw = f"{network_id}_{slugify(library)[:20]}_{hash_suffix}"
    return raw


def load_network_data(network_id: str, filename: str) -> dict | None:
    """Load data from a network JSON file."""
    filepath = DATA_DIR / filename
    if not filepath.exists():
        print(f"  ⚠ File not found: {filename}")
        return None

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f"  ✓ Loaded {filename}: {len(data.get('items', []))} items")
        return data
    except json.JSONDecodeError as e:
        print(f"  ✗ JSON error in {filename}: {e}")
        return None


def consolidate_data() -> dict:
    """Consolidate all network data into a single structure."""
    consolidated = {
        "networks": {},
        "items": [],
        "metadata": {
            "last_updated": datetime.now().strftime("%Y-%m-%d"),
            "total_items": 0,
            "total_libraries": 0,
            "total_networks": 0,
            "generated_by": "consolidate.py",
        },
    }

    all_libraries = set()

    print("Loading network data files...")

    for network_id, filename in NETWORK_FILES.items():
        data = load_network_data(network_id, filename)

        if data is None:
            continue

        # Add network info
        network_info = data.get("network", {})
        consolidated["networks"][network_id] = {
            **NETWORK_METADATA.get(network_id, {}),
            **network_info,
            "id": network_id,
        }

        # Process items
        for item in data.get("items", []):
            # Add network field
            item["network"] = network_id

            # Generate unique ID if not present
            if "id" not in item:
                item["id"] = generate_item_id(
                    network_id,
                    item.get("library", "unknown"),
                    item.get("name", "unknown")
                )

            # Track libraries
            if item.get("library"):
                all_libraries.add(item["library"])

            consolidated["items"].append(item)

    # Update metadata
    consolidated["metadata"]["total_items"] = len(consolidated["items"])
    consolidated["metadata"]["total_libraries"] = len(all_libraries)
    consolidated["metadata"]["total_networks"] = len(consolidated["networks"])

    return consolidated


def write_output(data: dict, output_path: Path):
    """Write consolidated data to JSON file."""
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\n✓ Written to: {output_path}")
    print(f"  Networks: {data['metadata']['total_networks']}")
    print(f"  Libraries: {data['metadata']['total_libraries']}")
    print(f"  Items: {data['metadata']['total_items']}")


def main():
    parser = argparse.ArgumentParser(
        description="Consolidate network JSON files into all_networks.json"
    )
    parser.add_argument(
        "--output", "-o",
        type=str,
        default=None,
        help="Output file path (default: public/data/all_networks.json)"
    )
    args = parser.parse_args()

    # Determine output path
    if args.output:
        output_path = Path(args.output)
    else:
        output_path = PUBLIC_DATA_DIR / "all_networks.json"

    # Consolidate and write
    data = consolidate_data()
    write_output(data, output_path)

    # Also write to data/ for reference
    data_output = DATA_DIR / "all_networks.json"
    write_output(data, data_output)


if __name__ == "__main__":
    main()
