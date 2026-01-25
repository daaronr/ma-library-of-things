# US Library of Things Expansion Roadmap

## Overview

Gradual expansion to cover Library of Things programs across all US states.
- **Timeline**: 4-5 weeks
- **Constraint**: ~5% Claude allowance per week
- **Process**: Automated research + manual Claude Code sessions for integration

## Weekly Schedule

### Week 1: New England Completion + Mid-Atlantic Start
**States**: VT, NH, ME (finish New England), PA, DE, MD
**Estimated Libraries**: 15-25
**Priority**: High-density library networks

| State | Major Networks | Status |
|-------|---------------|--------|
| Vermont | Vermont Automated Libraries | Pending |
| New Hampshire | GMILCS, NH State Library | Pending |
| Maine | Maine InfoNet | Pending |
| Pennsylvania | ACCESS PA, POWER Library | Pending |
| Delaware | Delaware Libraries | Pending |
| Maryland | Maryland Digital Library | Pending |

### Week 2: Mid-Atlantic + Southeast Start
**States**: VA, WV, DC, NC, SC, GA
**Estimated Libraries**: 20-30

| State | Major Networks | Status |
|-------|---------------|--------|
| Virginia | Library of Virginia, LION | Pending |
| West Virginia | WV Library Commission | Pending |
| Washington DC | DC Public Library | Pending |
| North Carolina | NC Cardinal | Pending |
| South Carolina | SC LSTA | Pending |
| Georgia | PINES, GALILEO | Pending |

### Week 3: Southeast + Midwest Start
**States**: FL, AL, MS, LA, TN, KY, OH, IN
**Estimated Libraries**: 25-35

| State | Major Networks | Status |
|-------|---------------|--------|
| Florida | SEFLIN, TBLC | Pending |
| Alabama | Alabama Virtual Library | Pending |
| Mississippi | MS Library Commission | Pending |
| Louisiana | State Library of LA | Pending |
| Tennessee | TEL | Pending |
| Kentucky | KYVL | Pending |
| Ohio | OhioLINK, SearchOhio | Pending |
| Indiana | Evergreen Indiana | Pending |

### Week 4: Midwest + Plains
**States**: MI, IL, WI, MN, IA, MO, KS, NE, SD, ND
**Estimated Libraries**: 30-40

| State | Major Networks | Status |
|-------|---------------|--------|
| Michigan | MeLCat, TLN | Pending |
| Illinois | CARLI, RAILS | Pending |
| Wisconsin | WISCAT | Pending |
| Minnesota | MnLINK | Pending |
| Iowa | State Library of Iowa | Pending |
| Missouri | MOBIUS | Pending |
| Kansas | Kansas Library Network | Pending |
| Nebraska | NebraskAccess | Pending |
| South Dakota | SD State Library | Pending |
| North Dakota | ODIN | Pending |

### Week 5: Mountain + West Coast
**States**: TX, OK, AR, CO, NM, AZ, UT, NV, MT, WY, ID, WA, OR, CA, AK, HI
**Estimated Libraries**: 40-60

| State | Major Networks | Status |
|-------|---------------|--------|
| Texas | TexShare | Pending |
| Oklahoma | OK Virtual Library | Pending |
| Arkansas | ARKLink | Pending |
| Colorado | Marmot, Prospector | Pending |
| New Mexico | NM State Library | Pending |
| Arizona | AZLibraries | Pending |
| Utah | Utah State Library | Pending |
| Nevada | NV State Library | Pending |
| Montana | MT Shared Catalog | Pending |
| Wyoming | WY State Library | Pending |
| Idaho | LiLI | Pending |
| Washington | WA State Library | Pending |
| Oregon | Sage, CCRLS | Pending |
| California | Link+, CalPoly | Pending |
| Alaska | AK State Library | Pending |
| Hawaii | HI State Library | Pending |

## Process Per State

1. **Automated Research** (run `scripts/research_state.py`)
   - Find library consortiums and networks
   - Identify libraries with LoT programs
   - Check robots.txt for each library domain
   - Generate candidate list

2. **Manual Review** (~5 min per state)
   - Review candidate libraries
   - Verify LoT programs exist
   - Check ToS if robots.txt unclear

3. **Data Collection** (Claude Code session)
   - Fetch LoT pages for compliant libraries
   - Extract items, categories, descriptions
   - Create state data file

4. **Integration** (automated)
   - Run consolidate.py
   - Build and deploy

## Running Weekly Expansion

```bash
# 1. Run research script for the week's states
python scripts/research_state.py --states VT NH ME PA DE MD --week 1

# 2. Review output in data/research/week1_candidates.json

# 3. Start Claude Code session
claude

# 4. Tell Claude: "Continue US expansion - Week 1 states"
```

## Progress Tracking

| Week | States | Libraries Added | Items Added | Date Completed |
|------|--------|-----------------|-------------|----------------|
| 0 | MA, CT, RI, NY, NJ | 31 | 302 | 2026-01-25 |
| 1 | VT, NH, ME, PA, DE, MD | - | - | - |
| 2 | VA, WV, DC, NC, SC, GA | - | - | - |
| 3 | FL, AL, MS, LA, TN, KY, OH, IN | - | - | - |
| 4 | MI, IL, WI, MN, IA, MO, KS, NE, SD, ND | - | - | - |
| 5 | TX, OK, AR, CO, NM, AZ, UT, NV, MT, WY, ID, WA, OR, CA, AK, HI | - | - | - |

## Excluded Libraries Policy

Libraries are excluded if:
1. robots.txt explicitly blocks crawlers (Disallow: /)
2. robots.txt blocks AI bots (ClaudeBot, GPTBot, etc.)
3. ToS prohibits automated data collection (e.g., BiblioCommons)

All exclusions are documented in README.md and Footer.jsx.
