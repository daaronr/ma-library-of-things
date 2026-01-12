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

  // CWMARS - Evergreen
  evergreen: (baseUrl, catalogId, itemName) => {
    if (catalogId) {
      return `${baseUrl}/eg/opac/record/${catalogId}`;
    }
    // Fallback to search
    return `${baseUrl}/eg/opac/results?query=${encodeURIComponent(itemName)}&qtype=keyword`;
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
};

// Network configuration with catalog details
export const networkCatalogs = {
  minuteman: {
    name: 'Minuteman Library Network',
    shortName: 'MLN',
    system: 'aspen_discovery',
    baseUrl: 'https://catalog.minlib.net',
    color: '#1E88E5',
    region: 'MetroWest Boston',
  },
  cwmars: {
    name: 'CWMARS',
    shortName: 'CW',
    system: 'evergreen',
    baseUrl: 'https://catalog.cwmars.org',
    color: '#43A047',
    region: 'Central/Western MA',
  },
  sails: {
    name: 'SAILS Library Network',
    shortName: 'SAILS',
    system: 'sirsidynix',
    baseUrl: 'https://sails.ent.sirsi.net',
    color: '#FB8C00',
    region: 'Southeastern MA',
  },
  mbln: {
    name: 'Metro Boston Library Network',
    shortName: 'MBLN',
    system: 'polaris',
    baseUrl: 'https://catalog.mbln.org',
    color: '#8E24AA',
    region: 'Greater Boston',
  },
  bpl: {
    name: 'Boston Public Library',
    shortName: 'BPL',
    system: 'bibliocommons',
    baseUrl: 'https://bpl.bibliocommons.com',
    color: '#D81B60',
    region: 'Boston',
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
