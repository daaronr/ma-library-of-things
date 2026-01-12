#!/usr/bin/env python3
"""
Validate Library of Things JSON data files.

Checks:
- JSON syntax
- Required fields present
- Data types correct
- No duplicate items
- URLs are valid format

Usage:
    python scripts/validate_data.py
    python scripts/validate_data.py --file data/minuteman_items.json
"""

import json
import argparse
import sys
from pathlib import Path
from urllib.parse import urlparse

SCRIPT_DIR = Path(__file__).parent
DATA_DIR = SCRIPT_DIR.parent / "data"

# Required fields per item
REQUIRED_ITEM_FIELDS = ['library', 'name']

# Optional but recommended fields
RECOMMENDED_ITEM_FIELDS = ['category', 'description']

# Valid category values
VALID_CATEGORIES = [
    'Home Improvement',
    'Measurement & Detection',
    'Home Inspection',
    'Auto/Vehicle',
    'Bicycle',
    'Gardening',
    'Outdoor/Camping',
    'Outdoor/Recreation',
    'Outdoor Games',
    'Crafts/Sewing',
    'Crafts/Hobbies',
    'Technology',
    'Technology/Gaming',
    'Technology/STEM',
    'Music',
    'Musical Instruments',
    'Kitchen',
    'Party/Event',
    'Wellness/Health',
    'Health/Wellness',
    'Games',
    'Games/Puzzles',
    'Games/Recreation',
    'Science/Education',
    'Entertainment',
    'Home Equipment',
    'Tools/Accessories',
    'Dolls',
    'Other',
]


class ValidationError:
    def __init__(self, file: str, message: str, severity: str = 'error'):
        self.file = file
        self.message = message
        self.severity = severity  # 'error' or 'warning'

    def __str__(self):
        return f"[{self.severity.upper()}] {self.file}: {self.message}"


def validate_url(url: str) -> bool:
    """Check if URL is valid format."""
    if not url:
        return True  # Empty is OK, just means no URL
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except Exception:
        return False


def validate_item(item: dict, file: str, index: int) -> list[ValidationError]:
    """Validate a single item."""
    errors = []
    prefix = f"Item {index}"

    # Check required fields
    for field in REQUIRED_ITEM_FIELDS:
        if field not in item or not item[field]:
            errors.append(ValidationError(
                file, f"{prefix}: Missing required field '{field}'"
            ))

    # Check recommended fields (warnings only)
    for field in RECOMMENDED_ITEM_FIELDS:
        if field not in item or not item[field]:
            errors.append(ValidationError(
                file, f"{prefix}: Missing recommended field '{field}'",
                severity='warning'
            ))

    # Validate category if present
    if item.get('category') and item['category'] not in VALID_CATEGORIES:
        errors.append(ValidationError(
            file, f"{prefix}: Unknown category '{item['category']}'",
            severity='warning'
        ))

    # Validate URLs
    for url_field in ['catalog_url', 'source_url']:
        if item.get(url_field) and not validate_url(item[url_field]):
            errors.append(ValidationError(
                file, f"{prefix}: Invalid URL in '{url_field}': {item[url_field]}"
            ))

    return errors


def validate_file(filepath: Path) -> list[ValidationError]:
    """Validate a single JSON file."""
    errors = []
    filename = filepath.name

    # Check file exists
    if not filepath.exists():
        errors.append(ValidationError(filename, "File not found"))
        return errors

    # Try to parse JSON
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        errors.append(ValidationError(filename, f"Invalid JSON: {e}"))
        return errors

    # Check top-level structure
    if not isinstance(data, dict):
        errors.append(ValidationError(filename, "Root must be an object"))
        return errors

    # Check for items array
    items = data.get('items', [])
    if not isinstance(items, list):
        errors.append(ValidationError(filename, "'items' must be an array"))
        return errors

    if len(items) == 0:
        errors.append(ValidationError(
            filename, "No items found", severity='warning'
        ))

    # Validate each item
    seen_items = set()
    for i, item in enumerate(items):
        if not isinstance(item, dict):
            errors.append(ValidationError(
                filename, f"Item {i}: Must be an object, got {type(item).__name__}"
            ))
            continue

        # Check for duplicates
        key = (item.get('library', ''), item.get('name', '').lower())
        if key in seen_items:
            errors.append(ValidationError(
                filename, f"Item {i}: Duplicate item '{item.get('name')}' at '{item.get('library')}'",
                severity='warning'
            ))
        seen_items.add(key)

        # Validate item fields
        errors.extend(validate_item(item, filename, i))

    # Check metadata
    if 'metadata' not in data:
        errors.append(ValidationError(
            filename, "Missing 'metadata' section", severity='warning'
        ))

    return errors


def main():
    parser = argparse.ArgumentParser(description="Validate Library of Things data")
    parser.add_argument(
        '--file', '-f',
        type=str,
        help='Specific file to validate (default: all *_items.json files)'
    )
    parser.add_argument(
        '--strict',
        action='store_true',
        help='Treat warnings as errors'
    )
    args = parser.parse_args()

    # Determine files to validate
    if args.file:
        files = [Path(args.file)]
    else:
        files = list(DATA_DIR.glob('*_items.json'))
        files.append(DATA_DIR / 'all_networks.json')
        files = [f for f in files if f.exists()]

    if not files:
        print("No data files found to validate")
        sys.exit(1)

    # Run validation
    all_errors = []
    for filepath in files:
        print(f"Validating {filepath.name}...")
        errors = validate_file(filepath)
        all_errors.extend(errors)

    # Report results
    error_count = sum(1 for e in all_errors if e.severity == 'error')
    warning_count = sum(1 for e in all_errors if e.severity == 'warning')

    print()
    if all_errors:
        print("Validation issues found:")
        for error in all_errors:
            print(f"  {error}")
        print()

    print(f"Errors: {error_count}, Warnings: {warning_count}")

    # Exit code
    if error_count > 0:
        sys.exit(1)
    if args.strict and warning_count > 0:
        sys.exit(1)

    print("Validation passed!")
    sys.exit(0)


if __name__ == "__main__":
    main()
