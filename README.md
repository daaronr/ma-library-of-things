# Massachusetts Library of Things Database

A consolidated, searchable database of "Library of Things" items available through Massachusetts library networks. These programs allow library cardholders to borrow tools, equipment, technology, and other non-traditional items for free.

> **DISCLAIMER:** This is an independent, community-maintained project. It is not affiliated with, endorsed by, or officially connected to any library network or individual library. For official information, please contact your local library directly.

## Project Goal

Library of Things programs are incredible public resources, but discovery is fragmented. Each library maintains its own webpage, making it difficult for patrons to find what's available across networks. This project consolidates that information into a searchable unified app.

## Networks Covered

| Network | Region | Libraries | Items | Status |
|---------|--------|-----------|-------|--------|
| **Minuteman (MLN)** | MetroWest Boston | 41 | 98+ | Active |
| **CWMARS** | Central/Western MA | 150+ | 33+ | Active |
| **SAILS** | Southeastern MA | 70 | 29+ | Active |
| **MBLN** | Greater Boston | 30+ | 6+ | Active |

**Total:** 166+ verified items across 13 libraries in 4 networks

## Key Finding: Morse Institute Library

**Morse Institute Library in Natick has the most extensive tool lending program in Massachusetts.** Their collection includes:
- Power tools (20V Drill Driver, Pressure Washer)
- Complete tool sets (65-piece homeowner's kit, 85-piece socket set)
- Professional measurement equipment (laser measurer, thermal imaging camera)
- Home inspection tools (radon detector, CO meter, electrical test kit)
- 168+ verified items total

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
python scripts/generate_xlsx.py --network cwmars
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
│   │   ├── Header.jsx
│   │   ├── SearchBar.jsx
│   │   ├── FilterPanel.jsx
│   │   ├── ItemCard.jsx
│   │   ├── ItemList.jsx
│   │   ├── Disclaimer.jsx
│   │   └── Footer.jsx
│   └── utils/                    # Utilities
│       ├── catalogUrls.js        # Catalog URL generators
│       └── categories.js         # Category icons/normalization
├── data/                         # JSON data files
│   ├── minuteman_items.json
│   ├── cwmars_items.json
│   ├── sails_items.json
│   ├── mbln_items.json
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

## Contributing

Want to add more libraries or networks? See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md).

Key ways to help:
1. **Add data** from libraries not yet included
2. **Verify accuracy** of existing entries
3. **Improve scrapers** for better automation
4. **Expand coverage** to other MA networks (NOBLE, OCLN, CLAMS, MVLC)

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
- Inspired by the amazing work of Massachusetts public librarians

---

*This is an independent community project. Not affiliated with any library or library network.*

*Last updated: January 2026*
