# Data Collection Methodology

## Overview

This document describes how data was collected for the Massachusetts Library of Things database.

## Data Sources

### Primary Sources

1. **Library Websites**: Direct scraping/reading of library LibGuides and collection pages
2. **Network Catalogs**: Minuteman (minlib.net), CWMARS catalog searches
3. **News Articles**: NBC Boston, Boston 25, local news coverage of Library of Things programs

### Verified Libraries

#### Minuteman Network

| Library | URL | Verification Date | Items Found |
|---------|-----|-------------------|-------------|
| Morse Institute | morseinstitute.libguides.com/library-of-things | 2026-01-11 | 168+ |
| Robbins Library | robbinslibrary.org/collections/library-of-things | 2026-01-11 | 30+ |
| Watertown | watertownlib.org/610/Library-of-Things | 2026-01-11 | 20+ |
| Needham | needhamlibrary.org/lot | 2026-01-11 | 15+ |
| Brookline | brooklinelibrary.org | 2026-01-11 | 10+ |
| Framingham | framinghamlibrary.org/browse/libraryofthings | 2026-01-11 | 10+ |

#### CWMARS Network

| Library | URL | Verification Date | Items Found |
|---------|-----|-------------------|-------------|
| Worcester Public | mywpl.libguides.com/WPLlibraryofthings | 2026-01-10 | 21 |
| Forbes Library | forbeslibrary.org/library-of-things | 2026-01-10 | 15+ |

## Data Collection Process

### Step 1: Identify Libraries with Programs

1. Search network websites for "Library of Things"
2. Check individual library websites for LoT pages
3. Search news articles mentioning local Library of Things programs

### Step 2: Extract Item Data

For each library with a documented program:

1. Visit the Library of Things page
2. Record each item with:
   - Item name
   - Category (standardized)
   - Description/contents
   - Any lending restrictions

### Step 3: Standardize Categories

Items are categorized into standardized categories:

- **Home Improvement**: Power tools, hand tools, hardware
- **Measurement & Detection**: Laser measurers, levels, stud finders
- **Home Inspection**: Thermal cameras, gas detectors, moisture meters
- **Auto/Vehicle**: OBD scanners, battery testers, tire gauges
- **Bicycle**: Repair kits, stands, locks
- **Gardening**: Hand tools, soil testers, planters
- **Outdoor/Camping**: Tents, snowshoes, binoculars
- **Outdoor Games**: Cornhole, bocce, lawn games
- **Crafts/Sewing**: Sewing machines, Cricut, knitting
- **Technology**: Gaming consoles, projectors, hotspots
- **Music**: Instruments, karaoke, turntables
- **Kitchen**: Appliances, specialty pans
- **Party/Event**: Bubble machines, PA systems
- **Wellness/Health**: BP monitors, light therapy
- **Games/Recreation**: Board games, puzzles
- **Dolls**: American Girl dolls

### Step 4: Verify Contact Information

Contact information is verified from:

1. Library staff directory pages
2. Massachusetts Board of Library Commissioners directory
3. Town/city government websites
4. LinkedIn (for title verification only)

## Data Quality Notes

### Known Limitations

1. **Incomplete Coverage**: Not all libraries with LoT programs have well-documented online collections
2. **Currency**: Library collections change; items may be added or removed
3. **Availability**: Items listed may be checked out or temporarily unavailable
4. **Regional Bias**: Better documentation for MetroWest libraries vs. rural areas

### Confidence Levels

- **High Confidence**: Items directly scraped from library LibGuides pages with full descriptions
- **Medium Confidence**: Items mentioned in news articles or catalog searches
- **Low Confidence**: Items inferred from category listings without individual verification

### Morse Institute Library

Morse Institute data is **HIGH CONFIDENCE** because:
- Comprehensive LibGuides page with photos and full descriptions
- Each item has catalog link for verification
- Recently updated (December 2025)

## Updating Data

### Recommended Update Frequency

- **Monthly**: Check for new items at major libraries
- **Quarterly**: Full verification of existing items
- **Annually**: Add new libraries to the database

### How to Verify an Item

1. Visit the library's catalog or LibGuides page
2. Search for the item by name
3. Confirm it's still in the collection
4. Update description if changed

## Tools Used

- **Claude AI**: Data extraction and consolidation
- **Web browsers**: Manual verification
- **Python/openpyxl**: Excel file generation
- **React**: Interactive app development

## Future Improvements

1. **Automated scraping**: Build scrapers for LibGuides pages
2. **Catalog API integration**: Connect to library catalog APIs
3. **Community contributions**: Allow libraries to submit their own data
4. **Real-time availability**: Show current checkout status
