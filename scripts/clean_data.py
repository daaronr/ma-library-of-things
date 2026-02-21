#!/usr/bin/env python3
"""Clean non-item entries from network data files."""

import json
from pathlib import Path

# Categories that are NOT actual borrowable items
NON_ITEM_CATEGORIES = {
    "Borrowing",
    "Related Pages",
    "Requesting, Picking Up, & Returning Things",
    "Framingham Public Library",
    "Main Library",
    "Quick Links",
}

# Item names that indicate policy/info, not actual items
NON_ITEM_KEYWORDS = [
    "must have a",
    "must be 18",
    "will receive a",
    "must pick up",
    "residents may request",
    "cannot be sent",
    "will receive a notification",
    "Library card",
    "agreement",
    "Library of Things Lending",
    "Contact ",
    "Events",
    "Search Catalog",
    "Museum Passes",
    "Ask a Librarian",
    "Newsletter",
    "Get A Library Card",
    "New Arrivals",
    "FPL Foundation",
    "FPL Friends",
    "508-532-",  # phone number
]


def is_valid_item(item):
    """Check if an item is a valid borrowable item."""
    category = item.get("category", "")
    name = item.get("name", "")

    # Skip non-item categories
    if category in NON_ITEM_CATEGORIES:
        return False

    # Skip items with informational keywords in name
    for keyword in NON_ITEM_KEYWORDS:
        if keyword.lower() in name.lower():
            return False

    return True


def clean_network_file(filepath):
    """Clean a network JSON file."""
    with open(filepath, "r") as f:
        data = json.load(f)

    original_count = len(data.get("items", []))
    data["items"] = [item for item in data.get("items", []) if is_valid_item(item)]
    new_count = len(data["items"])

    removed = original_count - new_count
    if removed > 0:
        print(f"  Removed {removed} non-item entries from {filepath.name}")
        with open(filepath, "w") as f:
            json.dump(data, f, indent=2)
    else:
        print(f"  No changes needed for {filepath.name}")

    return removed


def main():
    data_dir = Path(__file__).parent.parent / "data"

    print("Cleaning network data files...")
    total_removed = 0

    for filepath in data_dir.glob("*_items.json"):
        total_removed += clean_network_file(filepath)

    # Also clean all_networks.json if it exists
    all_networks = data_dir / "all_networks.json"
    if all_networks.exists():
        total_removed += clean_network_file(all_networks)

    print(f"\nTotal removed: {total_removed} non-item entries")
    print("Run 'python scripts/consolidate.py' to update all_networks.json")


if __name__ == "__main__":
    main()
