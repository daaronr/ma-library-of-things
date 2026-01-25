#!/usr/bin/env python3
"""
Research Library of Things programs in US states.

This script automates the initial research phase:
1. Searches for library consortiums in each state
2. Finds libraries with Library of Things programs
3. Checks robots.txt for scraping permissions
4. Outputs a candidate list for manual review

Usage:
    python scripts/research_state.py --states VT NH ME
    python scripts/research_state.py --week 1
    python scripts/research_state.py --all
"""

import argparse
import json
import re
import time
from pathlib import Path
from urllib.parse import urlparse
from urllib.robotparser import RobotFileParser
import requests
from datetime import datetime

SCRIPT_DIR = Path(__file__).parent
DATA_DIR = SCRIPT_DIR.parent / "data"
RESEARCH_DIR = DATA_DIR / "research"

# User agent for requests
USER_AGENT = "LibraryOfThingsResearch/1.0 (community project; respects robots.txt)"

# AI bot names to check for blocking
AI_BOTS = ["ClaudeBot", "GPTBot", "ChatGPT-User", "Google-Extended", "anthropic-ai"]

# Weekly state batches
WEEKLY_BATCHES = {
    1: ["VT", "NH", "ME", "PA", "DE", "MD"],
    2: ["VA", "WV", "DC", "NC", "SC", "GA"],
    3: ["FL", "AL", "MS", "LA", "TN", "KY", "OH", "IN"],
    4: ["MI", "IL", "WI", "MN", "IA", "MO", "KS", "NE", "SD", "ND"],
    5: ["TX", "OK", "AR", "CO", "NM", "AZ", "UT", "NV", "MT", "WY", "ID", "WA", "OR", "CA", "AK", "HI"],
}

# Known library networks by state (starting point for research)
STATE_NETWORKS = {
    "VT": [
        {"name": "Vermont Department of Libraries", "url": "https://libraries.vermont.gov"},
        {"name": "Catamount Library Network", "url": "https://www.catamountlibrarynetwork.org"},
    ],
    "NH": [
        {"name": "NH State Library", "url": "https://www.nh.gov/nhsl"},
        {"name": "GMILCS", "url": "https://www.gmilcs.org"},
    ],
    "ME": [
        {"name": "Maine State Library", "url": "https://www.maine.gov/msl"},
        {"name": "Maine InfoNet", "url": "https://www.maineinfonet.org"},
    ],
    "PA": [
        {"name": "Access PA", "url": "https://accesspa.powerlibrary.org"},
        {"name": "POWER Library", "url": "https://powerlibrary.org"},
        {"name": "Free Library of Philadelphia", "url": "https://libwww.freelibrary.org"},
    ],
    "DE": [
        {"name": "Delaware Libraries", "url": "https://lib.de.us"},
    ],
    "MD": [
        {"name": "Maryland State Library", "url": "https://www.marylandlibraries.org"},
        {"name": "Enoch Pratt Free Library", "url": "https://www.prattlibrary.org"},
    ],
    "VA": [
        {"name": "Library of Virginia", "url": "https://www.lva.virginia.gov"},
        {"name": "Fairfax County PL", "url": "https://www.fairfaxcounty.gov/library"},
    ],
    "WV": [
        {"name": "WV Library Commission", "url": "https://librarycommission.wv.gov"},
    ],
    "DC": [
        {"name": "DC Public Library", "url": "https://www.dclibrary.org"},
    ],
    "NC": [
        {"name": "NC Cardinal", "url": "https://ncardinal.org"},
        {"name": "State Library of NC", "url": "https://statelibrary.ncdcr.gov"},
    ],
    "SC": [
        {"name": "SC State Library", "url": "https://www.statelibrary.sc.gov"},
        {"name": "Charleston County PL", "url": "https://www.ccpl.org"},
    ],
    "GA": [
        {"name": "PINES", "url": "https://pines.georgialibraries.org"},
        {"name": "Atlanta-Fulton PL", "url": "https://www.afpls.org"},
    ],
    "FL": [
        {"name": "SEFLIN", "url": "https://seflin.org"},
        {"name": "Tampa Bay Library Consortium", "url": "https://tblc.org"},
        {"name": "Miami-Dade PL", "url": "https://www.mdpls.org"},
    ],
    "OH": [
        {"name": "SearchOhio", "url": "https://searchohio.org"},
        {"name": "OhioLINK", "url": "https://www.ohiolink.edu"},
        {"name": "Cleveland PL", "url": "https://cpl.org"},
        {"name": "Columbus Metro Library", "url": "https://www.columbuslibrary.org"},
    ],
    "MI": [
        {"name": "MeLCat", "url": "https://elibrary.mel.org"},
        {"name": "The Library Network", "url": "https://tln.lib.mi.us"},
        {"name": "Detroit PL", "url": "https://detroitpubliclibrary.org"},
    ],
    "IL": [
        {"name": "RAILS", "url": "https://www.railslibraries.info"},
        {"name": "Chicago PL", "url": "https://www.chipublib.org"},
    ],
    "TX": [
        {"name": "TexShare", "url": "https://www.tsl.texas.gov/texshare"},
        {"name": "Houston PL", "url": "https://houstonlibrary.org"},
        {"name": "Austin PL", "url": "https://library.austintexas.gov"},
    ],
    "CA": [
        {"name": "Link+", "url": "https://csul.iii.com"},
        {"name": "LA Public Library", "url": "https://www.lapl.org"},
        {"name": "San Francisco PL", "url": "https://sfpl.org"},
        {"name": "Oakland PL", "url": "https://oaklandlibrary.org"},
    ],
    "WA": [
        {"name": "WA State Library", "url": "https://www.sos.wa.gov/library"},
        {"name": "Seattle PL", "url": "https://www.spl.org"},
        {"name": "King County Library System", "url": "https://kcls.org"},
    ],
    "OR": [
        {"name": "Sage Library System", "url": "https://www.sagelibrary.org"},
        {"name": "Multnomah County Library", "url": "https://multcolib.org"},
    ],
    "CO": [
        {"name": "Marmot Library Network", "url": "https://marmot.org"},
        {"name": "Denver PL", "url": "https://www.denverlibrary.org"},
        {"name": "Prospector", "url": "https://prospector.coalliance.org"},
    ],
    "AZ": [
        {"name": "Arizona Libraries", "url": "https://azlibrary.gov"},
        {"name": "Phoenix PL", "url": "https://www.phoenixpubliclibrary.org"},
        {"name": "Pima County PL", "url": "https://www.library.pima.gov"},
    ],
    "MN": [
        {"name": "MnLINK", "url": "https://www.mnlink.org"},
        {"name": "Hennepin County Library", "url": "https://www.hclib.org"},
        {"name": "St. Paul PL", "url": "https://sppl.org"},
    ],
    # Add more states as needed
}


def check_robots_txt(url: str) -> dict:
    """
    Check robots.txt for a domain.
    Returns dict with allow status and any AI bot restrictions.
    """
    result = {
        "url": url,
        "robots_txt_url": None,
        "allows_crawling": True,
        "blocks_ai_bots": False,
        "blocked_bots": [],
        "error": None,
    }

    try:
        parsed = urlparse(url)
        base_url = f"{parsed.scheme}://{parsed.netloc}"
        robots_url = f"{base_url}/robots.txt"
        result["robots_txt_url"] = robots_url

        response = requests.get(robots_url, timeout=10, headers={"User-Agent": USER_AGENT})

        if response.status_code == 404:
            # No robots.txt = allow all
            return result

        if response.status_code != 200:
            result["error"] = f"HTTP {response.status_code}"
            return result

        robots_content = response.text.lower()

        # Check for blanket disallow
        rp = RobotFileParser()
        rp.set_url(robots_url)
        rp.parse(robots_content.split('\n'))

        if not rp.can_fetch("*", "/"):
            result["allows_crawling"] = False

        # Check for AI bot blocks
        for bot in AI_BOTS:
            if bot.lower() in robots_content:
                # Check if it's actually blocked
                if f"user-agent: {bot.lower()}" in robots_content or f"user-agent: {bot}" in robots_content.lower():
                    result["blocks_ai_bots"] = True
                    result["blocked_bots"].append(bot)

        # Also check for common AI blocking patterns
        ai_block_patterns = [
            "user-agent: gptbot",
            "user-agent: chatgpt",
            "user-agent: claude",
            "user-agent: anthropic",
            "user-agent: google-extended",
        ]
        for pattern in ai_block_patterns:
            if pattern in robots_content:
                result["blocks_ai_bots"] = True

    except requests.exceptions.RequestException as e:
        result["error"] = str(e)

    return result


def search_for_lot_programs(state: str) -> list:
    """
    Search for Library of Things programs in a state.
    Returns list of potential libraries with LoT programs.

    Note: This is a placeholder - in practice, this would need
    web search API access or manual research.
    """
    # For now, return known networks for the state
    return STATE_NETWORKS.get(state, [])


def research_state(state: str) -> dict:
    """
    Research Library of Things programs in a single state.
    """
    print(f"\n{'='*50}")
    print(f"Researching: {state}")
    print('='*50)

    result = {
        "state": state,
        "researched_at": datetime.now().isoformat(),
        "networks": [],
        "candidates": [],
        "excluded": [],
    }

    # Get known networks for this state
    networks = search_for_lot_programs(state)

    for network in networks:
        print(f"\n  Checking: {network['name']}")
        print(f"    URL: {network['url']}")

        # Check robots.txt
        robots_result = check_robots_txt(network['url'])

        network_info = {
            **network,
            **robots_result,
        }

        result["networks"].append(network_info)

        if not robots_result["allows_crawling"]:
            print(f"    ❌ Blocked: robots.txt disallows crawling")
            result["excluded"].append({
                "name": network["name"],
                "reason": "robots.txt blocks all crawling",
            })
        elif robots_result["blocks_ai_bots"]:
            print(f"    ⚠️  Blocked: AI bots restricted ({', '.join(robots_result['blocked_bots'])})")
            result["excluded"].append({
                "name": network["name"],
                "reason": f"robots.txt blocks AI bots: {', '.join(robots_result['blocked_bots'])}",
            })
        elif robots_result["error"]:
            print(f"    ⚠️  Error: {robots_result['error']}")
        else:
            print(f"    ✓ Allowed: Can proceed with research")
            result["candidates"].append(network)

        # Rate limit
        time.sleep(1)

    return result


def main():
    parser = argparse.ArgumentParser(
        description="Research Library of Things programs in US states"
    )
    parser.add_argument(
        "--states", "-s",
        nargs="+",
        help="State codes to research (e.g., VT NH ME)"
    )
    parser.add_argument(
        "--week", "-w",
        type=int,
        choices=[1, 2, 3, 4, 5],
        help="Research states for a specific week"
    )
    parser.add_argument(
        "--all", "-a",
        action="store_true",
        help="Research all states"
    )
    parser.add_argument(
        "--output", "-o",
        type=str,
        help="Output file path"
    )
    args = parser.parse_args()

    # Determine which states to research
    states = []
    if args.states:
        states = [s.upper() for s in args.states]
    elif args.week:
        states = WEEKLY_BATCHES.get(args.week, [])
    elif args.all:
        states = [s for batch in WEEKLY_BATCHES.values() for s in batch]
    else:
        print("Please specify --states, --week, or --all")
        return

    print(f"Researching {len(states)} states: {', '.join(states)}")

    # Create research directory
    RESEARCH_DIR.mkdir(parents=True, exist_ok=True)

    # Research each state
    results = {
        "generated_at": datetime.now().isoformat(),
        "states_researched": states,
        "results": [],
        "summary": {
            "total_networks": 0,
            "total_candidates": 0,
            "total_excluded": 0,
        }
    }

    for state in states:
        state_result = research_state(state)
        results["results"].append(state_result)
        results["summary"]["total_networks"] += len(state_result["networks"])
        results["summary"]["total_candidates"] += len(state_result["candidates"])
        results["summary"]["total_excluded"] += len(state_result["excluded"])

    # Determine output path
    if args.output:
        output_path = Path(args.output)
    elif args.week:
        output_path = RESEARCH_DIR / f"week{args.week}_research.json"
    else:
        output_path = RESEARCH_DIR / f"research_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"

    # Write results
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    # Print summary
    print(f"\n{'='*50}")
    print("SUMMARY")
    print('='*50)
    print(f"States researched: {len(states)}")
    print(f"Networks found: {results['summary']['total_networks']}")
    print(f"Candidates (allowed): {results['summary']['total_candidates']}")
    print(f"Excluded (blocked): {results['summary']['total_excluded']}")
    print(f"\nResults written to: {output_path}")
    print("\nNext steps:")
    print("1. Review the candidates in the output file")
    print("2. Search each candidate's website for 'Library of Things' pages")
    print("3. Run Claude Code to extract item data from allowed libraries")


if __name__ == "__main__":
    main()
