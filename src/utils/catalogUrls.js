/**
 * Generate catalog URLs for different library catalog systems
 */

const catalogUrlGenerators = {
  // Minuteman Network - Aspen Discovery
  aspen_discovery: (baseUrl, catalogId, itemName) => {
    if (catalogId) {
      return `${baseUrl}/GroupedWork/${catalogId}`;
    }
    // Fallback to search
    return `${baseUrl}/Search/Results?lookfor=${encodeURIComponent(itemName)}&searchIndex=Keyword`;
  },

  // CWMARS - Evergreen (uses www.cwmars.org/search)
  evergreen: (baseUrl, catalogId, itemName) => {
    if (catalogId) {
      return `${baseUrl}/eg/opac/record/${catalogId}`;
    }
    // Use the main CWMARS search page with query parameter
    return `https://www.cwmars.org/search?query=${encodeURIComponent(itemName)}&qtype=keyword&locg=1`;
  },

  // SAILS - SirsiDynix Enterprise
  sirsidynix: (baseUrl, catalogId, itemName) => {
    // SirsiDynix typically uses search-based URLs
    return `${baseUrl}/client/en_US/default/search/results?qu=${encodeURIComponent(itemName)}&te=`;
  },

  // MBLN - Polaris
  polaris: (baseUrl, catalogId, itemName) => {
    if (catalogId) {
      return `${baseUrl}/polaris/search/title.aspx?ctx=1.1033.0.0.1&pos=1&cn=${catalogId}`;
    }
    return `${baseUrl}/polaris/search/searchresults.aspx?ctx=1.1033.0.0.1&type=Keyword&term=${encodeURIComponent(itemName)}`;
  },

  // Boston Public Library - BiblioCommons
  bibliocommons: (baseUrl, catalogId, itemName) => {
    if (catalogId) {
      return `${baseUrl}/v2/record/${catalogId}`;
    }
    return `${baseUrl}/v2/search?query=${encodeURIComponent(itemName)}&searchType=smart`;
  },

  // Rhode Island - Koha + Aspen Discovery (Ocean State Libraries)
  koha: (baseUrl, catalogId, itemName) => {
    if (catalogId) {
      return `${baseUrl}/cgi-bin/koha/opac-detail.pl?biblionumber=${catalogId}`;
    }
    return `${baseUrl}/cgi-bin/koha/opac-search.pl?q=${encodeURIComponent(itemName)}`;
  },

  // Rhode Island Ocean State with Aspen Discovery layer
  koha_aspen: (baseUrl, catalogId, itemName) => {
    if (catalogId) {
      return `${baseUrl}/GroupedWork/${catalogId}`;
    }
    return `${baseUrl}/Search/Results?lookfor=${encodeURIComponent(itemName)}&searchIndex=Keyword`;
  },

  // NYPL - Encore (Sierra-based)
  nypl_encore: (baseUrl, catalogId, itemName) => {
    if (catalogId) {
      return `${baseUrl}/record=${catalogId}`;
    }
    return `${baseUrl}/search~S1?/X${encodeURIComponent(itemName)}&searchscope=1&SORT=D`;
  },

  // Queens Library - Sierra Web OPAC
  sierra: (baseUrl, catalogId, itemName) => {
    if (catalogId) {
      return `${baseUrl}/record=b${catalogId}`;
    }
    return `${baseUrl}/search/?searchtype=X&searcharg=${encodeURIComponent(itemName)}`;
  },

  // Innovative Interfaces (various NY libraries)
  innovative: (baseUrl, catalogId, itemName) => {
    return `${baseUrl}/search~S1/?searchtype=X&searcharg=${encodeURIComponent(itemName)}`;
  },

  // Connecticut - Bibliomation uses Evergreen (same generator)
  // Uses 'evergreen' generator

  // Connecticut - LION uses Aspen Discovery
  // Uses 'aspen_discovery' generator

  // OCLC WorldShare (academic libraries)
  oclc_wms: (baseUrl, catalogId, itemName) => {
    return `${baseUrl}/discovery/search?queryString=${encodeURIComponent(itemName)}`;
  },
};

// Network configuration with catalog details
export const networkCatalogs = {
  // MASSACHUSETTS
  minuteman: {
    name: 'Minuteman Library Network',
    shortName: 'MLN',
    system: 'aspen_discovery',
    baseUrl: 'https://catalog.minlib.net',
    color: '#1E88E5',
    region: 'MetroWest Boston',
    state: 'MA',
  },
  cwmars: {
    name: 'CWMARS',
    shortName: 'CW',
    system: 'evergreen',
    baseUrl: 'https://catalog.cwmars.org',
    color: '#43A047',
    region: 'Central/Western MA',
    state: 'MA',
  },
  sails: {
    name: 'SAILS Library Network',
    shortName: 'SAILS',
    system: 'sirsidynix',
    baseUrl: 'https://sails.ent.sirsi.net',
    color: '#FB8C00',
    region: 'Southeastern MA',
    state: 'MA',
  },
  mbln: {
    name: 'Metro Boston Library Network',
    shortName: 'MBLN',
    system: 'polaris',
    baseUrl: 'https://catalog.mbln.org',
    color: '#8E24AA',
    region: 'Greater Boston',
    state: 'MA',
  },
  bpl: {
    name: 'Boston Public Library',
    shortName: 'BPL',
    system: 'bibliocommons',
    baseUrl: 'https://bpl.bibliocommons.com',
    color: '#D81B60',
    region: 'Boston',
    state: 'MA',
  },

  // NEW YORK
  sals: {
    name: 'Southern Adirondack Library System',
    shortName: 'SALS',
    system: 'polaris',
    baseUrl: 'https://catalog.sals.edu',
    color: '#2E7D32',
    region: 'Upstate NY',
    state: 'NY',
  },
  nassau: {
    name: 'Nassau Library System',
    shortName: 'NLS',
    system: 'polaris',
    baseUrl: 'https://catalog.nassaulibrary.org',
    color: '#1565C0',
    region: 'Long Island',
    state: 'NY',
  },
  suffolk: {
    name: 'Suffolk Cooperative Library System',
    shortName: 'SCLS',
    system: 'polaris',
    baseUrl: 'https://catalog.suffolklibrarysystem.org',
    color: '#6A1B9A',
    region: 'Long Island',
    state: 'NY',
  },
  nypl: {
    name: 'New York Public Library',
    shortName: 'NYPL',
    system: 'nypl_encore',
    baseUrl: 'https://catalog.nypl.org',
    color: '#C62828',
    region: 'Manhattan/Bronx/Staten Island',
    state: 'NY',
  },
  brooklyn_pl: {
    name: 'Brooklyn Public Library',
    shortName: 'BPL-BK',
    system: 'bibliocommons',
    baseUrl: 'https://www.bklynlibrary.org/catalog',
    color: '#00838F',
    region: 'Brooklyn',
    state: 'NY',
  },
  queens_pl: {
    name: 'Queens Public Library',
    shortName: 'QPL',
    system: 'sierra',
    baseUrl: 'https://queenslibrary.org',
    color: '#EF6C00',
    region: 'Queens',
    state: 'NY',
  },

  // CONNECTICUT
  bibliomation: {
    name: 'Bibliomation',
    shortName: 'BIBLIO',
    system: 'evergreen',
    baseUrl: 'https://biblio.org',
    color: '#4527A0',
    region: 'Connecticut',
    state: 'CT',
  },
  lion: {
    name: 'Libraries Online (LION)',
    shortName: 'LION',
    system: 'aspen_discovery',
    baseUrl: 'https://catalog.lioninc.org',
    color: '#F57C00',
    region: 'Connecticut',
    state: 'CT',
  },
  library_connection: {
    name: 'Library Connection',
    shortName: 'LC',
    system: 'innovative',
    baseUrl: 'https://www.libraryconnection.info',
    color: '#00695C',
    region: 'Connecticut',
    state: 'CT',
  },

  // RHODE ISLAND
  ocean_state: {
    name: 'Ocean State Libraries',
    shortName: 'OSL',
    system: 'koha_aspen',
    baseUrl: 'https://catalog.oslri.net',
    color: '#AD1457',
    region: 'Rhode Island',
    state: 'RI',
  },

  // NEW JERSEY
  bccls: {
    name: 'Bergen County Cooperative Library System',
    shortName: 'BCCLS',
    system: 'polaris',
    baseUrl: 'https://catalog.bccls.org',
    color: '#FF6F00',
    region: 'Northern NJ',
    state: 'NJ',
  },
  main_nj: {
    name: 'MAIN Library Alliance',
    shortName: 'MAIN',
    system: 'polaris',
    baseUrl: 'https://catalog.mainlib.org',
    color: '#E65100',
    region: 'Central NJ',
    state: 'NJ',
  },
  stella: {
    name: 'STELLA Consortium',
    shortName: 'STELLA',
    system: 'polaris',
    baseUrl: 'https://catalog.lmxac.org',
    color: '#BF360C',
    region: 'Middlesex/Monmouth NJ',
    state: 'NJ',
  },

  // MAINE
  me_libraries: {
    name: 'Maine Libraries',
    shortName: 'ME',
    system: 'koha',
    baseUrl: 'https://minerva.maine.edu',
    color: '#00695C',
    region: 'Maine',
    state: 'ME',
  },

  // PENNSYLVANIA
  pa_libraries: {
    name: 'Pennsylvania Libraries',
    shortName: 'PA',
    system: 'evergreen',
    baseUrl: 'https://accesspa.powerlibrary.org',
    color: '#1565C0',
    region: 'Pennsylvania',
    state: 'PA',
  },

  // DELAWARE
  de_libraries: {
    name: 'Delaware Libraries',
    shortName: 'DE',
    system: 'koha',
    baseUrl: 'https://delawarelibraries.org',
    color: '#6A1B9A',
    region: 'Delaware',
    state: 'DE',
  },

  // MARYLAND
  md_libraries: {
    name: 'Maryland Libraries',
    shortName: 'MD',
    system: 'polaris',
    baseUrl: 'https://catalog.prattlibrary.org',
    color: '#E65100',
    region: 'Maryland',
    state: 'MD',
  },
};

/**
 * Generate a catalog URL for an item
 * @param {string} networkId - Network identifier (minuteman, cwmars, etc.)
 * @param {string|null} catalogId - Catalog system ID if known
 * @param {string} itemName - Item name for search fallback
 * @returns {string|null} - Catalog URL or null if network not found
 */
export function getCatalogUrl(networkId, catalogId, itemName) {
  const network = networkCatalogs[networkId];
  if (!network) return null;

  const generator = catalogUrlGenerators[network.system];
  if (!generator) return null;

  return generator(network.baseUrl, catalogId, itemName);
}

/**
 * Get network display info
 * @param {string} networkId - Network identifier
 * @returns {object|null} - Network info or null
 */
export function getNetworkInfo(networkId) {
  return networkCatalogs[networkId] || null;
}

export default {
  getCatalogUrl,
  getNetworkInfo,
  networkCatalogs,
};
