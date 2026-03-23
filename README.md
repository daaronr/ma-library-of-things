# Library of Things USA

A consolidated, searchable database of "Library of Things" items available through public libraries and tool-lending organizations across the United States. These programs allow community members to borrow tools, equipment, technology, outdoor gear, and other non-traditional items — often for free.

**Features:**
- Search by location (ZIP code or geolocation)
- Filter by radius (5, 10, 25, 50 miles)
- Browse by network, library, state, or category
- Filter by organization type (public library vs. tool library) and free-only items
- Statistics dashboard with coverage breakdowns
- Direct links to library catalogs

> **DISCLAIMER:** This is an independent, community-maintained project. It is not affiliated with, endorsed by, or officially connected to any library network or individual library. For official information, please contact your local library directly.

## Project Goal

Library of Things programs are incredible public resources, but discovery is fragmented. Each library maintains its own webpage, making it difficult for patrons to find what's available across networks. This project consolidates that information into a searchable unified app with location-based filtering.

## Current Coverage

**1,299+ items across 34 networks in 32 states**

### Public Libraries

| State | Network | Items | Status |
|-------|---------|-------|--------|
| AZ | Arizona Libraries | 3+ | Active |
| CA | California Libraries | 92+ | Active |
| CO | Colorado Libraries | 12+ | Active |
| CT | Connecticut Libraries (Bibliomation) | 19+ | Active |
| DE | Delaware Libraries | 30+ | Active |
| FL | Florida Libraries | 18+ | Active |
| IA | Iowa Libraries | 19+ | Active |
| IL | Illinois Libraries | 15+ | Active |
| IN | Indiana Libraries | 20+ | Active |
| KS | Kansas Libraries | 10+ | Active |
| LA | Louisiana Libraries | 4+ | Active |
| MA | Minuteman Library Network (MLN) | 130+ | Active |
| MA | CWMARS | 41+ | Active |
| MD | Maryland Libraries | 11+ | Active |
| ME | Maine Libraries | 113+ | Active |
| MI | Michigan Libraries | 36+ | Active |
| MO | Missouri Libraries | 10+ | Active |
| NC | North Carolina Libraries | 7+ | Active |
| NJ | New Jersey Libraries | 47+ | Active |
| NY | New York Libraries | 22+ | Active |
| OH | Ohio Libraries | 13+ | Active |
| OK | Oklahoma Libraries | 31+ | Active |
| PA | Pennsylvania Libraries | 30+ | Active |
| RI | Ocean State Libraries | 75+ | Active |
| SC | South Carolina Libraries (Richland) | 180+ | Active |
| TN | Tennessee Libraries | 15+ | Active |
| TX | Texas Libraries | 14+ | Active |
| UT | Utah Libraries | 14+ | Active |
| WI | Wisconsin Libraries | 14+ | Active |

### Tool Libraries & Sharing Organizations

| State | Organization | Items Listed | Total Collection | Fee |
|-------|-------------|-------------|-----------------|-----|
| CA | Berkeley Tool Lending Library | 92+ | ~3,500 tools | FREE |
| MN | Minnesota Tool Library | 50+ | 8,219 tools | $65-120/yr |
| NY | The Tool Library, Buffalo | 50+ | 4,806 tools | $30-150/yr |
| OR | Oregon Tool Libraries | 15+ | varies | varies |
| VA | Charlottesville Tool Library | 89+ | 1,071 tools | varies |
| WA | West Seattle Tool Library | 50+ | 2,426 tools | pay what you can |

### Excluded Libraries

The following libraries have been excluded due to their Terms of Service explicitly prohibiting automated data collection:

| Library | Reason |
|---------|--------|
| Boston Public Library | BiblioCommons ToS prohibits automated harvesting |
| Brooklyn Public Library | BiblioCommons ToS prohibits automated harvesting |
| SAILS Network (Bridgewater, W. Bridgewater) | robots.txt blocks all automated access |
| Ramsey Free Public Library (NJ) | robots.txt blocks AI bots |
| Hunterdon County Library (NJ) | robots.txt blocks AI bots |
| Chicago Tool Library | blocks ClaudeBot |

We respect library policies and encourage users to visit these libraries directly for their Library of Things offerings.

## Quick Start

### Run the Web App Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Generate Excel Files

```bash
python scripts/generate_xlsx.py --network minuteman
python scripts/generate_xlsx.py --all
```

### Update Data

```bash
# Run scrapers (requires Python dependencies)
pip install -r scripts/requirements.txt
python scripts/scrape_all.py

# Consolidate all network data
python scripts/consolidate.py

# Validate data files
python scripts/validate_data.py
```

## Project Structure

```
ma-library-of-things/
├── src/                          # React app source
│   ├── App.jsx                   # Main app component
│   ├── components/               # React components
│   │   ├── Dashboard.jsx         # Statistics dashboard
│   │   ├── Header.jsx
│   │   ├── SearchBar.jsx
│   │   ├── LocationInput.jsx
│   │   ├── RadiusFilter.jsx
│   │   ├── FilterPanel.jsx
│   │   ├── ItemCard.jsx
│   │   ├── ItemList.jsx
│   │   ├── SubmitLibrary.jsx
│   │   ├── Disclaimer.jsx
│   │   └── Footer.jsx
│   └── utils/                    # Utilities
│       ├── catalogUrls.js        # Catalog URL generators
│       └── categories.js         # Category icons/normalization
├── data/                         # JSON data files (per-state + consolidated)
│   ├── {state}_items.json        # Per-state/network data (32 files)
│   └── all_networks.json         # Consolidated data
├── public/data/                  # Build-time data
│   └── all_networks.json
├── scripts/                      # Python scripts
│   ├── scrapers/                 # Web scrapers
│   │   ├── base_scraper.py
│   │   ├── libguides_scraper.py
│   │   └── config.py
│   ├── scrape_all.py             # Main scraper
│   ├── consolidate.py            # Data consolidation
│   ├── validate_data.py          # Data validation
│   └── generate_xlsx.py          # Excel generation
├── .github/workflows/            # GitHub Actions
│   ├── deploy.yml                # Netlify deployment
│   └── update-data.yml           # Weekly data updates
├── design-concepts.html          # UI design explorations
├── apps/                         # Legacy standalone apps
├── docs/                         # Documentation
└── outputs/                      # Generated Excel files
```

## Automated Updates

Data is automatically updated weekly via GitHub Actions:
- **Schedule:** Sundays at 3 AM EST
- **Process:** Scrape library websites → Validate → Consolidate → Deploy
- **Manual trigger:** Available via GitHub Actions workflow_dispatch

## Deployment

The app is configured for deployment to Netlify:

1. Connect your GitHub repo to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add required secrets for GitHub Actions:
   - `NETLIFY_AUTH_TOKEN`
   - `NETLIFY_SITE_ID`
   - `NETLIFY_BUILD_HOOK` (optional, for auto-deploy after data updates)

## Data Schema

Each item in the database includes:

```json
{
  "id": "minuteman_morse_drill_kit",
  "library": "Morse Institute Library",
  "network": "minuteman",
  "category": "Home Improvement",
  "name": "20V Drill Driver Kit",
  "description": "Denali drill, battery, charger, 32 bits",
  "catalog_url": "https://catalog.minlib.net/...",
  "source_url": "https://morseinstitute.libguides.com/library-of-things",
  "last_verified": "2026-01-11"
}
```

Organizations also include:
```json
{
  "org_type": "public_library | tool_library | makerspace | gear_library",
  "access_type": "checkout | in_space | both",
  "fee_structure": "free | membership | sliding_scale | per_item",
  "membership_fee": 25.00,
  "requires_membership": true
}
```

## Contributing

Want to add more libraries or networks? See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md).

Key ways to help:
1. **Add data** from libraries not yet included
2. **Verify accuracy** of existing entries
3. **Improve scrapers** for better automation
4. **Expand coverage** to remaining states

### Adding a New Network

1. Create `data/{network}_items.json` following the existing schema
2. Add network config to `scripts/scrapers/config.py`
3. Add network metadata to `src/utils/catalogUrls.js`
4. Run `python scripts/consolidate.py`
5. Submit a pull request

## Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS
- **Scraping:** Python, BeautifulSoup, requests
- **CI/CD:** GitHub Actions, Netlify
- **Data:** JSON

## License

This project is released under the MIT License. The underlying data is publicly available from library websites.

## Acknowledgments

- Created by [David Reinstein](https://davidreinstein.org) with assistance from [Claude AI](https://claude.ai)
- Data sourced from individual library websites
- Inspired by the amazing work of public librarians and tool-lending organizations across the US

---

*This is an independent community project. Not affiliated with any library or library network.*

*Last updated: March 2026*
