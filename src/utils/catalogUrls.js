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

  // MyTurn (used by Richland Library SC and other Library of Things)
  myturn: (baseUrl, catalogId, itemName) => {
    // MyTurn uses browse with search - items link to source_url instead
    return `${baseUrl}/library/inventory/browse`;
  },

  // Direct URL only (for non-catalog orgs like tool libraries, makerspaces)
  direct: (baseUrl, catalogId, itemName) => {
    // Just return the base URL - items should have source_url
    return baseUrl;
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

  // SOUTH CAROLINA
  sc_libraries: {
    name: 'South Carolina Libraries',
    shortName: 'SC',
    system: 'myturn',
    baseUrl: 'https://richlandlibrary.myturn.com',
    color: '#7B1FA2',
    region: 'South Carolina',
    state: 'SC',
  },

  // VIRGINIA
  va_tool_libraries: {
    name: 'Virginia Tool Libraries',
    shortName: 'VA-TL',
    system: 'myturn',
    baseUrl: 'https://cvilletools.myturn.com',
    color: '#2E7D32',
    region: 'Virginia',
    state: 'VA',
  },

  // NEW YORK TOOL LIBRARIES
  ny_tool_libraries: {
    name: 'New York Tool Libraries',
    shortName: 'NY-TL',
    system: 'myturn',
    baseUrl: 'https://universityheights.myturn.com',
    color: '#1565C0',
    region: 'Western New York',
    state: 'NY',
  },

  // MINNESOTA TOOL LIBRARIES
  mn_tool_libraries: {
    name: 'Minnesota Tool Library',
    shortName: 'MN-TL',
    system: 'myturn',
    baseUrl: 'https://mtl.myturn.com',
    color: '#00838F',
    region: 'Minneapolis-St. Paul',
    state: 'MN',
  },

  // WASHINGTON TOOL LIBRARIES
  wa_tool_libraries: {
    name: 'Washington Tool Libraries',
    shortName: 'WA-TL',
    system: 'myturn',
    baseUrl: 'https://wstl.myturn.com',
    color: '#558B2F',
    region: 'Seattle Area',
    state: 'WA',
  },

  // CALIFORNIA LIBRARIES
  ca_libraries: {
    name: 'California Libraries',
    shortName: 'CA',
    system: 'direct',
    baseUrl: 'https://www.berkeleypubliclibrary.org/locations/tool-lending-library',
    color: '#C62828',
    region: 'California',
    state: 'CA',
  },

  // INDIANA LIBRARIES
  in_libraries: {
    name: 'Indiana Libraries',
    shortName: 'IN',
    system: 'direct',
    baseUrl: 'https://www.indypl.org',
    color: '#1565C0',
    region: 'Midwest',
    state: 'IN',
  },

  // TENNESSEE LIBRARIES
  tn_libraries: {
    name: 'Tennessee Libraries',
    shortName: 'TN',
    system: 'direct',
    baseUrl: 'https://library.nashville.gov',
    color: '#FF6F00',
    region: 'Southeast',
    state: 'TN',
  },

  // OHIO LIBRARIES
  oh_libraries: {
    name: 'Ohio Libraries',
    shortName: 'OH',
    system: 'direct',
    baseUrl: 'https://www.starklibrary.org',
    color: '#C62828',
    region: 'Midwest',
    state: 'OH',
  },

  // ILLINOIS LIBRARIES
  il_libraries: {
    name: 'Illinois Libraries',
    shortName: 'IL',
    system: 'direct',
    baseUrl: 'https://www.oppl.org',
    color: '#1565C0',
    region: 'Midwest',
    state: 'IL',
  },

  // COLORADO LIBRARIES
  co_libraries: {
    name: 'Colorado Libraries',
    shortName: 'CO',
    system: 'direct',
    baseUrl: 'https://arapahoelibraries.org',
    color: '#2E7D32',
    region: 'Mountain West',
    state: 'CO',
  },

  // TEXAS LIBRARIES
  tx_libraries: {
    name: 'Texas Libraries',
    shortName: 'TX',
    system: 'direct',
    baseUrl: 'https://hcpl.net',
    color: '#BF360C',
    region: 'Southwest',
    state: 'TX',
  },

  // OREGON TOOL LIBRARIES
  or_tool_libraries: {
    name: 'Oregon Tool Libraries',
    shortName: 'OR-TL',
    system: 'direct',
    baseUrl: 'https://eastportlandtoollibrary.org',
    color: '#00695C',
    region: 'Pacific Northwest',
    state: 'OR',
  },

  // MICHIGAN LIBRARIES
  mi_libraries: {
    name: 'Michigan Libraries',
    shortName: 'MI',
    system: 'direct',
    baseUrl: 'https://livonialibrary.info',
    color: '#1565C0',
    region: 'Midwest',
    state: 'MI',
  },

  // IOWA LIBRARIES
  ia_libraries: {
    name: 'Iowa Libraries',
    shortName: 'IA',
    system: 'direct',
    baseUrl: 'https://www.dmpl.org',
    color: '#C62828',
    region: 'Midwest',
    state: 'IA',
  },

  // MISSOURI LIBRARIES
  mo_libraries: {
    name: 'Missouri Libraries',
    shortName: 'MO',
    system: 'direct',
    baseUrl: 'https://www.slcl.org',
    color: '#6A1B9A',
    region: 'Midwest',
    state: 'MO',
  },

  // FLORIDA LIBRARIES
  fl_libraries: {
    name: 'Florida Libraries',
    shortName: 'FL',
    system: 'direct',
    baseUrl: 'https://www.mymanatee.org',
    color: '#FF6F00',
    region: 'Southeast',
    state: 'FL',
  },

  // NORTH CAROLINA LIBRARIES
  nc_libraries: {
    name: 'North Carolina Libraries',
    shortName: 'NC',
    system: 'direct',
    baseUrl: 'https://www.nhcgov.com',
    color: '#00838F',
    region: 'Southeast',
    state: 'NC',
  },

  // OKLAHOMA LIBRARIES
  ok_libraries: {
    name: 'Oklahoma Libraries',
    shortName: 'OK',
    system: 'direct',
    baseUrl: 'https://www.metrolibrary.org',
    color: '#C62828',
    region: 'Southwest',
    state: 'OK',
  },

  // WISCONSIN LIBRARIES
  wi_libraries: {
    name: 'Wisconsin Libraries',
    shortName: 'WI',
    system: 'direct',
    baseUrl: 'https://oakcreeklibrary.org',
    color: '#C62828',
    region: 'Midwest',
    state: 'WI',
  },

  // LOUISIANA LIBRARIES
  la_libraries: {
    name: 'Louisiana Libraries',
    shortName: 'LA',
    system: 'direct',
    baseUrl: 'https://nolalibrary.org',
    color: '#6A1B9A',
    region: 'Southeast',
    state: 'LA',
  },

  // UTAH LIBRARIES
  ut_libraries: {
    name: 'Utah Libraries',
    shortName: 'UT',
    system: 'direct',
    baseUrl: 'https://www.slcolibrary.org',
    color: '#C62828',
    region: 'Mountain West',
    state: 'UT',
  },

  // KANSAS LIBRARIES
  ks_libraries: {
    name: 'Kansas Libraries',
    shortName: 'KS',
    system: 'direct',
    baseUrl: 'https://www.wichitalibrary.org',
    color: '#1565C0',
    region: 'Midwest',
    state: 'KS',
  },

  // ARIZONA LIBRARIES
  az_libraries: {
    name: 'Arizona Libraries',
    shortName: 'AZ',
    system: 'direct',
    baseUrl: 'https://www.mesalibrary.org',
    color: '#FF6F00',
    region: 'Southwest',
    state: 'AZ',
  },

  // GEORGIA LIBRARIES
  ga_libraries: {
    name: 'Georgia Libraries',
    shortName: 'GA',
    system: 'direct',
    baseUrl: 'https://chestateelibrary.org',
    color: '#C62828',
    region: 'Southeast',
    state: 'GA',
  },

  // KENTUCKY LIBRARIES
  ky_libraries: {
    name: 'Kentucky Libraries',
    shortName: 'KY',
    system: 'myturn',
    baseUrl: 'https://louisvilletoollibrary.myturn.com',
    color: '#1565C0',
    region: 'Southeast',
    state: 'KY',
  },

  // ALABAMA LIBRARIES
  al_libraries: {
    name: 'Alabama Libraries',
    shortName: 'AL',
    system: 'direct',
    baseUrl: 'https://www.dhcls.org',
    color: '#BF360C',
    region: 'Southeast',
    state: 'AL',
  },

  // NEW HAMPSHIRE LIBRARIES
  nh_libraries: {
    name: 'New Hampshire Libraries',
    shortName: 'NH',
    system: 'direct',
    baseUrl: 'https://concordpubliclibrary.net',
    color: '#2E7D32',
    region: 'New England',
    state: 'NH',
  },

  // VERMONT LIBRARIES
  vt_libraries: {
    name: 'Vermont Libraries',
    shortName: 'VT',
    system: 'direct',
    baseUrl: 'https://www.fletcherfree.org',
    color: '#00695C',
    region: 'New England',
    state: 'VT',
  },

  // NEBRASKA LIBRARIES
  ne_libraries: {
    name: 'Nebraska Libraries',
    shortName: 'NE',
    system: 'direct',
    baseUrl: 'https://www.gretna.org/library',
    color: '#C62828',
    region: 'Midwest',
    state: 'NE',
  },

  // NEW MEXICO LIBRARIES
  nm_libraries: {
    name: 'New Mexico Libraries',
    shortName: 'NM',
    system: 'direct',
    baseUrl: 'https://www.santafelibrary.org',
    color: '#6A1B9A',
    region: 'Southwest',
    state: 'NM',
  },

  // NEVADA LIBRARIES
  nv_libraries: {
    name: 'Nevada Libraries',
    shortName: 'NV',
    system: 'direct',
    baseUrl: 'https://bclibrary.org',
    color: '#FF6F00',
    region: 'Mountain West',
    state: 'NV',
  },

  // WASHINGTON DC LIBRARIES
  dc_libraries: {
    name: 'DC Libraries',
    shortName: 'DC',
    system: 'myturn',
    baseUrl: 'https://thelabs.myturn.com',
    color: '#1565C0',
    region: 'Mid-Atlantic',
    state: 'DC',
  },

  // ARKANSAS LIBRARIES
  ar_libraries: {
    name: 'Arkansas Libraries',
    shortName: 'AR',
    system: 'direct',
    baseUrl: 'https://cals.org',
    color: '#E65100',
    region: 'South Central',
    state: 'AR',
  },

  // WEST VIRGINIA LIBRARIES
  wv_libraries: {
    name: 'West Virginia Libraries',
    shortName: 'WV',
    system: 'direct',
    baseUrl: 'https://www.kcpls.org',
    color: '#1565C0',
    region: 'Appalachian',
    state: 'WV',
  },

  // IDAHO LIBRARIES
  id_libraries: {
    name: 'Idaho Libraries',
    shortName: 'ID',
    system: 'direct',
    baseUrl: 'https://communitylibrary.net',
    color: '#2E7D32',
    region: 'Mountain West',
    state: 'ID',
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
