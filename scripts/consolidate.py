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
# NOTE: Some networks removed due to explicit Terms of Service prohibitions on automated access:
#   - SAILS (sails_items.json) - robots.txt Disallow: / (blocks all crawling)
#   - MBLN/BPL (mbln_items.json, bpl_items.json) - BiblioCommons ToS prohibits automated harvesting
#   - Brooklyn PL - BiblioCommons ToS prohibits automated harvesting (removed from ny_items.json)
#   - Ramsey Free PL (NJ) - robots.txt blocks ClaudeBot, GPTBot
#   - Hunterdon County Library (NJ) - robots.txt blocks ChatGPT, GPTBot
NETWORK_FILES = {
    # Massachusetts
    "minuteman": "minuteman_items.json",
    "cwmars": "cwmars_items.json",
    # Connecticut
    "bibliomation": "ct_items.json",
    # Rhode Island
    "ocean_state": "ri_items.json",
    # New York
    "ny_libraries": "ny_items.json",
    # New Jersey
    "nj_libraries": "nj_items.json",
    # Maine
    "me_libraries": "me_items.json",
    # Pennsylvania
    "pa_libraries": "pa_items.json",
    # Delaware
    "de_libraries": "de_items.json",
    # Maryland
    "md_libraries": "md_items.json",
    # South Carolina
    "sc_libraries": "sc_items.json",
    # Virginia
    "va_tool_libraries": "va_items.json",
    # New York Tool Libraries
    "ny_tool_libraries": "ny_tool_libraries.json",
    # Minnesota
    "mn_tool_libraries": "mn_items.json",
    # Washington
    "wa_tool_libraries": "wa_items.json",
    # California
    "ca_libraries": "ca_items.json",
    # Indiana
    "in_libraries": "in_items.json",
    # Tennessee
    "tn_libraries": "tn_items.json",
    # Ohio
    "oh_libraries": "oh_items.json",
    # Illinois
    "il_libraries": "il_items.json",
    # Colorado
    "co_libraries": "co_items.json",
    # Texas
    "tx_libraries": "tx_items.json",
    # Oregon
    "or_tool_libraries": "or_items.json",
}

# Organization type constants
ORG_TYPE_LIBRARY = "public_library"
ORG_TYPE_TOOL_LIBRARY = "tool_library"
ORG_TYPE_MAKERSPACE = "makerspace"
ORG_TYPE_GEAR_LIBRARY = "gear_library"

# Access type constants
ACCESS_CHECKOUT = "checkout"      # Items can be taken home
ACCESS_IN_SPACE = "in_space"      # Use on-site only
ACCESS_BOTH = "both"              # Both options available

# Fee structure constants
FEE_FREE = "free"
FEE_MEMBERSHIP = "membership"
FEE_PER_ITEM = "per_item"
FEE_SLIDING_SCALE = "sliding_scale"
FEE_DEPOSIT_ONLY = "deposit_only"

# Network metadata (used if not in JSON file)
# New fields for sharing economy expansion:
#   org_type: public_library | tool_library | makerspace | gear_library
#   access_type: checkout | in_space | both
#   fee_structure: free | membership | per_item | sliding_scale | deposit_only
#   membership_fee: float (annual cost) or None
#   membership_fee_notes: string describing fee details
#   requires_membership: bool
NETWORK_METADATA = {
    # Massachusetts
    "minuteman": {
        "name": "Minuteman Library Network",
        "short_name": "MLN",
        "region": "MetroWest Boston",
        "state": "MA",
        "catalog_system": "aspen_discovery",
        "catalog_base_url": "https://catalog.minlib.net",
        "website": "https://www.minlib.net",
        "color": "#1E88E5",
        "org_type": ORG_TYPE_LIBRARY,
        "access_type": ACCESS_CHECKOUT,
        "fee_structure": FEE_FREE,
        "requires_membership": False,
    },
    "cwmars": {
        "name": "CWMARS",
        "short_name": "CW",
        "region": "Central/Western MA",
        "state": "MA",
        "catalog_system": "evergreen",
        "catalog_base_url": "https://catalog.cwmars.org",
        "website": "https://www.cwmars.org",
        "color": "#43A047",
        "org_type": ORG_TYPE_LIBRARY,
        "access_type": ACCESS_CHECKOUT,
        "fee_structure": FEE_FREE,
        "requires_membership": False,
    },
    # NOTE: sails, mbln, bpl removed - ToS prohibit automated access
    # Connecticut
    "bibliomation": {
        "name": "Bibliomation",
        "short_name": "BIBLIO",
        "region": "Connecticut",
        "state": "CT",
        "catalog_system": "evergreen",
        "catalog_base_url": "https://biblio.org",
        "website": "https://www.biblio.org",
        "color": "#4527A0",
        "org_type": ORG_TYPE_LIBRARY,
        "access_type": ACCESS_CHECKOUT,
        "fee_structure": FEE_FREE,
        "requires_membership": False,
    },
    # Rhode Island
    "ocean_state": {
        "name": "Ocean State Libraries",
        "short_name": "OSL",
        "region": "Rhode Island",
        "state": "RI",
        "catalog_system": "koha_aspen",
        "catalog_base_url": "https://catalog.oslri.net",
        "website": "https://oslri.org",
        "color": "#AD1457",
        "org_type": ORG_TYPE_LIBRARY,
        "access_type": ACCESS_CHECKOUT,
        "fee_structure": FEE_FREE,
        "requires_membership": False,
    },
    # New York
    "ny_libraries": {
        "name": "New York Libraries",
        "short_name": "NY",
        "region": "New York State",
        "state": "NY",
        "catalog_system": "polaris",
        "catalog_base_url": "https://catalog.nypl.org",
        "website": "https://www.nypl.org",
        "color": "#C62828",
        "org_type": ORG_TYPE_LIBRARY,
        "access_type": ACCESS_CHECKOUT,
        "fee_structure": FEE_FREE,
        "requires_membership": False,
    },
    # New Jersey
    "nj_libraries": {
        "name": "New Jersey Libraries",
        "short_name": "NJ",
        "region": "New Jersey",
        "state": "NJ",
        "catalog_system": "polaris",
        "catalog_base_url": "https://catalog.bccls.org",
        "website": "https://librarylinknj.org",
        "color": "#FF6F00",
        "org_type": ORG_TYPE_LIBRARY,
        "access_type": ACCESS_CHECKOUT,
        "fee_structure": FEE_FREE,
        "requires_membership": False,
    },
    # Maine
    "me_libraries": {
        "name": "Maine Libraries",
        "short_name": "ME",
        "region": "Maine",
        "state": "ME",
        "catalog_system": "koha",
        "catalog_base_url": "https://minerva.maine.edu",
        "website": "https://www.maineinfonet.org",
        "color": "#00695C",
        "org_type": ORG_TYPE_LIBRARY,
        "access_type": ACCESS_CHECKOUT,
        "fee_structure": FEE_FREE,
        "requires_membership": False,
    },
    # Pennsylvania
    "pa_libraries": {
        "name": "Pennsylvania Libraries",
        "short_name": "PA",
        "region": "Pennsylvania",
        "state": "PA",
        "catalog_system": "evergreen",
        "catalog_base_url": "https://accesspa.powerlibrary.org",
        "website": "https://powerlibrary.org",
        "color": "#1565C0",
        "org_type": ORG_TYPE_LIBRARY,
        "access_type": ACCESS_CHECKOUT,
        "fee_structure": FEE_FREE,
        "requires_membership": False,
    },
    # Delaware
    "de_libraries": {
        "name": "Delaware Libraries",
        "short_name": "DE",
        "region": "Delaware",
        "state": "DE",
        "catalog_system": "koha",
        "catalog_base_url": "https://delawarelibraries.org",
        "website": "https://lib.de.us",
        "color": "#6A1B9A",
        "org_type": ORG_TYPE_LIBRARY,
        "access_type": ACCESS_CHECKOUT,
        "fee_structure": FEE_FREE,
        "requires_membership": False,
    },
    # Maryland
    "md_libraries": {
        "name": "Maryland Libraries",
        "short_name": "MD",
        "region": "Maryland",
        "state": "MD",
        "catalog_system": "polaris",
        "catalog_base_url": "https://catalog.prattlibrary.org",
        "website": "https://www.prattlibrary.org",
        "color": "#E65100",
        "org_type": ORG_TYPE_LIBRARY,
        "access_type": ACCESS_CHECKOUT,
        "fee_structure": FEE_FREE,
        "requires_membership": False,
    },
    # South Carolina
    "sc_libraries": {
        "name": "South Carolina Libraries",
        "short_name": "SC",
        "region": "South Carolina",
        "state": "SC",
        "catalog_system": "myturn",
        "catalog_base_url": "https://richlandlibrary.myturn.com",
        "website": "https://www.richlandlibrary.com",
        "color": "#7B1FA2",
        "org_type": ORG_TYPE_LIBRARY,
        "access_type": ACCESS_CHECKOUT,
        "fee_structure": FEE_FREE,
        "requires_membership": False,
    },
    # Virginia - Tool Libraries
    "va_tool_libraries": {
        "name": "Virginia Tool Libraries",
        "short_name": "VA-TL",
        "region": "Virginia",
        "state": "VA",
        "catalog_system": "myturn",
        "catalog_base_url": "https://cvilletools.myturn.com",
        "website": "https://cvilletoollibrary.com",
        "color": "#2E7D32",
        "org_type": ORG_TYPE_TOOL_LIBRARY,
        "access_type": ACCESS_CHECKOUT,
        "fee_structure": FEE_SLIDING_SCALE,
        "membership_fee": 40.0,
        "membership_fee_notes": "Sliding scale $20-60/year based on income",
        "requires_membership": True,
    },
    # New York - Tool Libraries
    "ny_tool_libraries": {
        "name": "New York Tool Libraries",
        "short_name": "NY-TL",
        "region": "Western New York",
        "state": "NY",
        "catalog_system": "myturn",
        "catalog_base_url": "https://universityheights.myturn.com",
        "website": "https://thetoollibrary.org",
        "color": "#1565C0",
        "org_type": ORG_TYPE_TOOL_LIBRARY,
        "access_type": ACCESS_CHECKOUT,
        "fee_structure": FEE_MEMBERSHIP,
        "membership_fee": 30.0,
        "membership_fee_notes": "$30/year (Tool Belt), $75/year (Tool Box), $150/year (Wheelbarrow)",
        "requires_membership": True,
    },
    # Minnesota - Tool Libraries
    "mn_tool_libraries": {
        "name": "Minnesota Tool Library",
        "short_name": "MN-TL",
        "region": "Minneapolis-St. Paul",
        "state": "MN",
        "catalog_system": "myturn",
        "catalog_base_url": "https://mtl.myturn.com",
        "website": "https://www.mntoollibrary.org",
        "color": "#00838F",
        "org_type": ORG_TYPE_TOOL_LIBRARY,
        "access_type": ACCESS_BOTH,
        "fee_structure": FEE_MEMBERSHIP,
        "membership_fee": 65.0,
        "membership_fee_notes": "$65/year (basic) or $120/year (unlimited)",
        "requires_membership": True,
    },
    # Washington - Tool Libraries
    "wa_tool_libraries": {
        "name": "Washington Tool Libraries",
        "short_name": "WA-TL",
        "region": "Seattle Area",
        "state": "WA",
        "catalog_system": "myturn",
        "catalog_base_url": "https://wstl.myturn.com",
        "website": "https://www.wstools.org",
        "color": "#558B2F",
        "org_type": ORG_TYPE_TOOL_LIBRARY,
        "access_type": ACCESS_CHECKOUT,
        "fee_structure": FEE_SLIDING_SCALE,
        "membership_fee": 45.0,
        "membership_fee_notes": "Pay what you can, suggested $45/year",
        "requires_membership": True,
    },
    # California - Public Libraries
    "ca_libraries": {
        "name": "California Libraries",
        "short_name": "CA",
        "region": "California",
        "state": "CA",
        "catalog_system": "direct",
        "catalog_base_url": "https://www.berkeleypubliclibrary.org/locations/tool-lending-library",
        "website": "https://www.berkeleypubliclibrary.org/locations/tool-lending-library",
        "color": "#C62828",
        "org_type": ORG_TYPE_LIBRARY,
        "access_type": ACCESS_CHECKOUT,
        "fee_structure": FEE_FREE,
        "membership_fee_notes": "FREE with library card",
        "requires_membership": False,
    },
    # Indiana
    "in_libraries": {
        "name": "Indiana Libraries",
        "short_name": "IN",
        "region": "Midwest",
        "state": "IN",
        "catalog_system": "direct",
        "catalog_base_url": "https://www.indypl.org",
        "website": "https://www.indypl.org",
        "color": "#1565C0",
        "org_type": ORG_TYPE_LIBRARY,
        "access_type": ACCESS_CHECKOUT,
        "fee_structure": FEE_FREE,
        "requires_membership": False,
    },
    # Tennessee
    "tn_libraries": {
        "name": "Tennessee Libraries",
        "short_name": "TN",
        "region": "Southeast",
        "state": "TN",
        "catalog_system": "direct",
        "catalog_base_url": "https://library.nashville.gov",
        "website": "https://library.nashville.gov",
        "color": "#FF6F00",
        "org_type": ORG_TYPE_LIBRARY,
        "access_type": ACCESS_CHECKOUT,
        "fee_structure": FEE_FREE,
        "requires_membership": False,
    },
    # Ohio
    "oh_libraries": {
        "name": "Ohio Libraries",
        "short_name": "OH",
        "region": "Midwest",
        "state": "OH",
        "catalog_system": "direct",
        "catalog_base_url": "https://www.starklibrary.org",
        "website": "https://www.starklibrary.org",
        "color": "#C62828",
        "org_type": ORG_TYPE_LIBRARY,
        "access_type": ACCESS_CHECKOUT,
        "fee_structure": FEE_FREE,
        "requires_membership": False,
    },
    # Illinois
    "il_libraries": {
        "name": "Illinois Libraries",
        "short_name": "IL",
        "region": "Midwest",
        "state": "IL",
        "catalog_system": "direct",
        "catalog_base_url": "https://www.oppl.org",
        "website": "https://www.oppl.org",
        "color": "#1565C0",
        "org_type": ORG_TYPE_LIBRARY,
        "access_type": ACCESS_CHECKOUT,
        "fee_structure": FEE_FREE,
        "requires_membership": False,
    },
    # Colorado
    "co_libraries": {
        "name": "Colorado Libraries",
        "short_name": "CO",
        "region": "Mountain West",
        "state": "CO",
        "catalog_system": "direct",
        "catalog_base_url": "https://arapahoelibraries.org",
        "website": "https://arapahoelibraries.org",
        "color": "#2E7D32",
        "org_type": ORG_TYPE_LIBRARY,
        "access_type": ACCESS_CHECKOUT,
        "fee_structure": FEE_FREE,
        "requires_membership": False,
    },
    # Texas
    "tx_libraries": {
        "name": "Texas Libraries",
        "short_name": "TX",
        "region": "Southwest",
        "state": "TX",
        "catalog_system": "direct",
        "catalog_base_url": "https://hcpl.net",
        "website": "https://hcpl.net",
        "color": "#BF360C",
        "org_type": ORG_TYPE_LIBRARY,
        "access_type": ACCESS_CHECKOUT,
        "fee_structure": FEE_FREE,
        "requires_membership": False,
    },
    # Oregon - Tool Libraries
    "or_tool_libraries": {
        "name": "Oregon Tool Libraries",
        "short_name": "OR-TL",
        "region": "Pacific Northwest",
        "state": "OR",
        "catalog_system": "direct",
        "catalog_base_url": "https://eastportlandtoollibrary.org",
        "website": "https://eastportlandtoollibrary.org",
        "color": "#00695C",
        "org_type": ORG_TYPE_TOOL_LIBRARY,
        "access_type": ACCESS_CHECKOUT,
        "fee_structure": FEE_FREE,
        "requires_membership": False,
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


def load_network_data(network_id: str, filename: str):
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
