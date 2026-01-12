"""
Base scraper class for Library of Things data collection.
"""

import time
import logging
from abc import ABC, abstractmethod
from typing import Optional

import requests
from bs4 import BeautifulSoup

from .config import SCRAPE_CONFIG, CATEGORY_MAPPINGS

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class BaseScraper(ABC):
    """Abstract base class for library scrapers."""

    def __init__(self, network_id: str, network_config: dict):
        self.network_id = network_id
        self.config = network_config
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': SCRAPE_CONFIG['user_agent'],
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
        })
        self.delay = SCRAPE_CONFIG['delay_between_requests']
        self.timeout = SCRAPE_CONFIG['timeout']
        self.max_retries = SCRAPE_CONFIG['max_retries']

    def get_page(self, url: str) -> Optional[BeautifulSoup]:
        """
        Fetch a page and return parsed BeautifulSoup object.

        Args:
            url: URL to fetch

        Returns:
            BeautifulSoup object or None if fetch failed
        """
        for attempt in range(self.max_retries):
            try:
                logger.info(f"Fetching: {url}")
                response = self.session.get(url, timeout=self.timeout)
                response.raise_for_status()

                # Rate limiting
                time.sleep(self.delay)

                return BeautifulSoup(response.text, 'lxml')

            except requests.RequestException as e:
                logger.warning(f"Attempt {attempt + 1} failed for {url}: {e}")
                if attempt < self.max_retries - 1:
                    time.sleep(self.delay * 2)

        logger.error(f"Failed to fetch {url} after {self.max_retries} attempts")
        return None

    def normalize_category(self, category: str) -> str:
        """
        Normalize category name to standard format.

        Args:
            category: Raw category name

        Returns:
            Normalized category name
        """
        if not category:
            return 'Other'

        lower = category.lower().strip()
        return CATEGORY_MAPPINGS.get(lower, category)

    @abstractmethod
    def scrape_library(self, library_config: dict) -> list[dict]:
        """
        Scrape items from a single library.

        Args:
            library_config: Library configuration dict with name, lot_url, etc.

        Returns:
            List of item dicts with name, category, description, etc.
        """
        pass

    def scrape_all(self) -> list[dict]:
        """
        Scrape all libraries in this network.

        Returns:
            List of all items from all libraries
        """
        all_items = []

        for library in self.config.get('libraries', []):
            logger.info(f"Scraping {library['name']}...")

            try:
                items = self.scrape_library(library)
                logger.info(f"  Found {len(items)} items")
                all_items.extend(items)

            except Exception as e:
                logger.error(f"  Error scraping {library['name']}: {e}")

        return all_items
