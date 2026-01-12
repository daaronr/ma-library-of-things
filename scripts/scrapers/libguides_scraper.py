"""
Scraper for LibGuides-based Library of Things pages.

Many libraries use Springshare LibGuides to document their LoT collections.
This scraper handles the common LibGuides HTML structure.
"""

import re
import logging
from datetime import date
from typing import Optional
from urllib.parse import urljoin

from bs4 import BeautifulSoup, Tag

from .base_scraper import BaseScraper

logger = logging.getLogger(__name__)


class LibGuidesScraper(BaseScraper):
    """Scraper for LibGuides-based Library of Things pages."""

    def scrape_library(self, library_config: dict) -> list[dict]:
        """
        Scrape items from a library's LibGuides page.

        Args:
            library_config: Dict with 'name', 'lot_url', etc.

        Returns:
            List of item dicts
        """
        items = []
        lot_url = library_config.get('lot_url')

        if not lot_url:
            logger.warning(f"No LoT URL for {library_config['name']}")
            return items

        soup = self.get_page(lot_url)
        if not soup:
            return items

        # Try different LibGuides structures
        items.extend(self._parse_libguides_boxes(soup, library_config, lot_url))
        items.extend(self._parse_libguides_assets(soup, library_config, lot_url))
        items.extend(self._parse_generic_lists(soup, library_config, lot_url))

        # Deduplicate by name
        seen = set()
        unique_items = []
        for item in items:
            key = (item['library'], item['name'].lower())
            if key not in seen:
                seen.add(key)
                unique_items.append(item)

        return unique_items

    def _parse_libguides_boxes(
        self, soup: BeautifulSoup, library_config: dict, source_url: str
    ) -> list[dict]:
        """Parse LibGuides content boxes (.s-lg-box)."""
        items = []

        for box in soup.select('.s-lg-box'):
            # Get category from box title
            title_elem = box.select_one('.s-lg-box-title')
            category = self._extract_category(title_elem)

            # Find items in the box
            for item_elem in box.select('.s-lg-link, .s-lg-book-title, li'):
                item = self._parse_item_element(
                    item_elem, library_config, category, source_url
                )
                if item:
                    items.append(item)

        return items

    def _parse_libguides_assets(
        self, soup: BeautifulSoup, library_config: dict, source_url: str
    ) -> list[dict]:
        """Parse LibGuides assets (.s-lg-asset)."""
        items = []

        for asset in soup.select('.s-lg-asset'):
            # Try to find category from parent box
            parent_box = asset.find_parent(class_='s-lg-box')
            title_elem = parent_box.select_one('.s-lg-box-title') if parent_box else None
            category = self._extract_category(title_elem)

            # Get item details
            name_elem = asset.select_one('.s-lg-asset-name, .s-lg-link-title, h4, h5')
            desc_elem = asset.select_one('.s-lg-asset-description, .s-lg-book-description, p')
            link_elem = asset.select_one('a[href]')

            if name_elem:
                name = self._clean_text(name_elem.get_text())
                if name and not self._is_noise(name):
                    items.append({
                        'library': library_config['name'],
                        'category': category,
                        'name': name,
                        'description': self._clean_text(desc_elem.get_text()) if desc_elem else '',
                        'catalog_url': self._extract_catalog_url(link_elem, source_url),
                        'source_url': source_url,
                        'last_verified': date.today().isoformat(),
                    })

        return items

    def _parse_generic_lists(
        self, soup: BeautifulSoup, library_config: dict, source_url: str
    ) -> list[dict]:
        """Parse generic HTML lists that might contain items."""
        items = []

        # Look for lists under headers that might indicate categories
        for header in soup.select('h2, h3, h4'):
            category = self._extract_category(header)

            # Find the next list after this header
            next_elem = header.find_next_sibling()
            while next_elem and next_elem.name not in ['h2', 'h3', 'h4', 'ul', 'ol']:
                next_elem = next_elem.find_next_sibling()

            if next_elem and next_elem.name in ['ul', 'ol']:
                for li in next_elem.select('li'):
                    item = self._parse_item_element(
                        li, library_config, category, source_url
                    )
                    if item:
                        items.append(item)

        return items

    def _parse_item_element(
        self, elem: Tag, library_config: dict, category: str, source_url: str
    ) -> Optional[dict]:
        """Parse a single item element."""
        if not elem:
            return None

        # Get text content
        text = self._clean_text(elem.get_text())

        if not text or self._is_noise(text):
            return None

        # Try to separate name from description
        name, description = self._split_name_description(text)

        # Look for catalog link
        link = elem.select_one('a[href]') if isinstance(elem, Tag) else None
        catalog_url = self._extract_catalog_url(link, source_url)

        return {
            'library': library_config['name'],
            'category': category,
            'name': name,
            'description': description,
            'catalog_url': catalog_url,
            'source_url': source_url,
            'last_verified': date.today().isoformat(),
        }

    def _extract_category(self, elem: Optional[Tag]) -> str:
        """Extract and normalize category from an element."""
        if not elem:
            return 'Other'

        text = self._clean_text(elem.get_text())

        # Skip non-category headers
        skip_patterns = ['welcome', 'about', 'how to', 'contact', 'hours', 'location']
        if any(p in text.lower() for p in skip_patterns):
            return 'Other'

        return self.normalize_category(text) if text else 'Other'

    def _extract_catalog_url(self, link: Optional[Tag], source_url: str) -> Optional[str]:
        """Extract catalog URL from a link element."""
        if not link:
            return None

        href = link.get('href', '')

        # Only keep links that look like catalog links
        catalog_indicators = ['catalog', 'record', 'item', 'search', 'opac']
        if any(ind in href.lower() for ind in catalog_indicators):
            return urljoin(source_url, href)

        return None

    def _split_name_description(self, text: str) -> tuple[str, str]:
        """Split text into name and description."""
        # Try splitting on common separators
        separators = [' - ', ' – ', ': ', ' | ']

        for sep in separators:
            if sep in text:
                parts = text.split(sep, 1)
                return parts[0].strip(), parts[1].strip()

        # If no separator, check if text is very long (probably has description)
        if len(text) > 80:
            # Try to find a natural break point
            match = re.match(r'^(.{20,60}?)[,.](.+)$', text)
            if match:
                return match.group(1).strip(), match.group(2).strip()

        return text, ''

    def _clean_text(self, text: str) -> str:
        """Clean and normalize text content."""
        if not text:
            return ''
        # Remove extra whitespace
        text = ' '.join(text.split())
        # Remove common noise
        text = text.strip(' .,;:')
        return text

    def _is_noise(self, text: str) -> bool:
        """Check if text is noise (navigation, etc) rather than an item."""
        if not text or len(text) < 3:
            return True

        noise_patterns = [
            'click here', 'learn more', 'read more', 'see more',
            'back to', 'return to', 'home', 'contact us',
            'hours', 'location', 'directions', 'sign up',
            'login', 'log in', 'register', 'subscribe',
            'facebook', 'twitter', 'instagram', 'youtube',
        ]

        lower = text.lower()
        return any(p in lower for p in noise_patterns)
