"""
Configuration for library scrapers.
"""

import os

# Scraping configuration
SCRAPE_CONFIG = {
    'delay_between_requests': float(os.environ.get('SCRAPE_DELAY', 2.0)),
    'max_retries': 3,
    'timeout': 30,
    'user_agent': 'MA-Library-Things-Bot/1.0 (+https://github.com/ma-library-of-things)',
}

# Network sources - libraries with known Library of Things pages
NETWORK_SOURCES = {
    'minuteman': {
        'network_name': 'Minuteman Library Network',
        'libraries': [
            {
                'name': 'Morse Institute Library',
                'lot_url': 'https://morseinstitute.libguides.com/library-of-things',
                'location': 'Natick, MA',
                'phone': '508-647-6520',
            },
            {
                'name': 'Robbins Library',
                'lot_url': 'https://www.robbinslibrary.org/collections/library-of-things/',
                'location': 'Arlington, MA',
                'phone': '781-316-3200',
            },
            {
                'name': 'Watertown Free Public Library',
                'lot_url': 'https://www.watertownlib.org/610/Library-of-Things',
                'location': 'Watertown, MA',
                'phone': '617-972-6431',
            },
            {
                'name': 'Needham Free Public Library',
                'lot_url': 'https://needhamlibrary.org/lot/',
                'location': 'Needham, MA',
                'phone': '781-455-7559',
            },
            {
                'name': 'Framingham Public Library',
                'lot_url': 'https://framinghamlibrary.org/browse/libraryofthings/',
                'location': 'Framingham, MA',
                'phone': '508-532-5570',
            },
            {
                'name': 'Cary Memorial Library',
                'lot_url': 'https://www.carylibrary.org/library-things',
                'location': 'Lexington, MA',
                'phone': '781-862-6288',
            },
        ],
    },
    'cwmars': {
        'network_name': 'CWMARS',
        'libraries': [
            {
                'name': 'Worcester Public Library',
                'lot_url': 'https://mywpl.libguides.com/WPLlibraryofthings',
                'location': 'Worcester, MA',
                'phone': '508-799-1655',
            },
            {
                'name': 'Forbes Library',
                'lot_url': 'https://forbeslibrary.org/library-of-things/',
                'location': 'Northampton, MA',
                'phone': '413-587-1011',
            },
        ],
    },
    'sails': {
        'network_name': 'SAILS Library Network',
        'libraries': [
            {
                'name': 'Bridgewater Public Library',
                'lot_url': 'https://www.bridgewaterpubliclibrary.org/',
                'location': 'Bridgewater, MA',
                'phone': '508-697-3331',
            },
            {
                'name': 'East Bridgewater Public Library',
                'lot_url': 'https://www.eb-library.org/',
                'location': 'East Bridgewater, MA',
                'phone': '508-378-1616',
            },
        ],
    },
    'mbln': {
        'network_name': 'Metro Boston Library Network',
        'libraries': [
            {
                'name': 'Boston Public Library',
                'lot_url': 'https://www.bpl.org/library-of-things/',
                'location': 'Boston, MA',
                'phone': '617-536-5400',
            },
        ],
    },
}

# Category mappings for normalization
CATEGORY_MAPPINGS = {
    # Lowercase variations -> Standard category
    'tools': 'Home Improvement',
    'home improvement': 'Home Improvement',
    'home improvement tools': 'Home Improvement',
    'technology': 'Technology',
    'tech': 'Technology',
    'electronics': 'Technology',
    'gaming': 'Technology/Gaming',
    'video games': 'Technology/Gaming',
    'music': 'Music',
    'instruments': 'Musical Instruments',
    'musical instruments': 'Musical Instruments',
    'outdoor': 'Outdoor/Camping',
    'camping': 'Outdoor/Camping',
    'recreation': 'Outdoor/Recreation',
    'games': 'Games',
    'board games': 'Games',
    'lawn games': 'Outdoor Games',
    'outdoor games': 'Outdoor Games',
    'kitchen': 'Kitchen',
    'cooking': 'Kitchen',
    'craft': 'Crafts/Sewing',
    'crafts': 'Crafts/Sewing',
    'sewing': 'Crafts/Sewing',
    'health': 'Wellness/Health',
    'wellness': 'Wellness/Health',
    'garden': 'Gardening',
    'gardening': 'Gardening',
    'auto': 'Auto/Vehicle',
    'vehicle': 'Auto/Vehicle',
    'car': 'Auto/Vehicle',
    'bike': 'Bicycle',
    'bicycle': 'Bicycle',
    'science': 'Science/Education',
    'stem': 'Technology/STEM',
    'measurement': 'Measurement & Detection',
    'detection': 'Measurement & Detection',
    'inspection': 'Home Inspection',
    'home inspection': 'Home Inspection',
    'party': 'Party/Event',
    'event': 'Party/Event',
}
