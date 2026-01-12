#!/usr/bin/env python3
"""
Main scraping script that runs all network scrapers and updates data files.

Usage:
    python scripts/scrape_all.py
    python scripts/scrape_all.py --network minuteman
    python scripts/scrape_all.py --dry-run
"""

import json
import argparse
import logging
from pathlib import Path
from datetime import datetime

from scrapers import LibGuidesScraper, NETWORK_SOURCES

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

SCRIPT_DIR = Path(__file__).parent
DATA_DIR = SCRIPT_DIR.parent / "data"


def load_existing_data(network_id: str) -> dict:
    """Load existing data file for a network."""
    filepath = DATA_DIR / f"{network_id}_items.json"

    if filepath.exists():
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)

    return {
        'network': {},
        'libraries': [],
        'items': [],
        'metadata': {},
    }


def merge_items(existing: list[dict], scraped: list[dict]) -> list[dict]:
    """
    Merge scraped items with existing items.

    - Updates existing items with new data
    - Adds new items not in existing
    - Keeps existing items not found in scrape (may be offline)
    """
    # Index existing items by library + name
    existing_index = {}
    for item in existing:
        key = (item.get('library', ''), item.get('name', '').lower())
        existing_index[key] = item

    # Process scraped items
    merged = []
    scraped_keys = set()

    for item in scraped:
        key = (item.get('library', ''), item.get('name', '').lower())
        scraped_keys.add(key)

        if key in existing_index:
            # Update existing item, preserving manual fields
            updated = {**existing_index[key], **item}
            merged.append(updated)
        else:
            # New item
            merged.append(item)

    # Keep existing items not found in scrape (with stale warning)
    for key, item in existing_index.items():
        if key not in scraped_keys:
            # Mark as not recently verified but keep it
            item['last_verified'] = item.get('last_verified', 'unknown')
            merged.append(item)

    return merged


def save_network_data(network_id: str, data: dict, dry_run: bool = False):
    """Save network data to JSON file."""
    filepath = DATA_DIR / f"{network_id}_items.json"

    if dry_run:
        logger.info(f"[DRY RUN] Would save {len(data['items'])} items to {filepath}")
        return

    DATA_DIR.mkdir(exist_ok=True)

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    logger.info(f"Saved {len(data['items'])} items to {filepath}")


def scrape_network(network_id: str, dry_run: bool = False) -> dict:
    """Scrape a single network and return updated data."""
    logger.info(f"=" * 50)
    logger.info(f"Scraping network: {network_id}")
    logger.info(f"=" * 50)

    config = NETWORK_SOURCES.get(network_id)
    if not config:
        logger.error(f"Unknown network: {network_id}")
        return {}

    # Load existing data
    existing = load_existing_data(network_id)

    # Run scraper
    scraper = LibGuidesScraper(network_id, config)
    scraped_items = scraper.scrape_all()

    logger.info(f"Scraped {len(scraped_items)} items from {network_id}")

    # Merge with existing
    merged_items = merge_items(existing.get('items', []), scraped_items)

    # Build updated data structure
    updated = {
        'network': {
            'name': config['network_name'],
            'id': network_id,
        },
        'libraries': [
            {k: v for k, v in lib.items() if k != 'lot_url'}
            for lib in config.get('libraries', [])
        ],
        'items': merged_items,
        'metadata': {
            'last_updated': datetime.now().strftime('%Y-%m-%d'),
            'verified_items_count': len([i for i in merged_items if i.get('last_verified')]),
            'data_source': 'Automated scraping + manual verification',
        },
    }

    # Save
    save_network_data(network_id, updated, dry_run)

    return updated


def main():
    parser = argparse.ArgumentParser(description="Scrape Library of Things data")
    parser.add_argument(
        '--network', '-n',
        type=str,
        help='Specific network to scrape (default: all)'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Show what would be done without saving'
    )
    parser.add_argument(
        '--list-networks',
        action='store_true',
        help='List available networks and exit'
    )
    args = parser.parse_args()

    if args.list_networks:
        print("Available networks:")
        for nid, config in NETWORK_SOURCES.items():
            libs = len(config.get('libraries', []))
            print(f"  {nid}: {config['network_name']} ({libs} libraries)")
        return

    # Determine which networks to scrape
    if args.network:
        networks = [args.network]
    else:
        networks = list(NETWORK_SOURCES.keys())

    # Run scrapers
    results = {}
    for network_id in networks:
        try:
            results[network_id] = scrape_network(network_id, args.dry_run)
        except Exception as e:
            logger.error(f"Error scraping {network_id}: {e}")

    # Summary
    logger.info("")
    logger.info("=" * 50)
    logger.info("SCRAPING COMPLETE")
    logger.info("=" * 50)

    total_items = 0
    for nid, data in results.items():
        count = len(data.get('items', []))
        total_items += count
        logger.info(f"  {nid}: {count} items")

    logger.info(f"  TOTAL: {total_items} items")


if __name__ == "__main__":
    main()
