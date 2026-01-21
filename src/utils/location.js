/**
 * Location utilities for distance calculation and geolocation
 */

/**
 * Calculate distance between two points using the Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lng1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lng2 - Longitude of second point
 * @returns {number} Distance in miles
 */
export function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians
 * @param {number} deg - Degrees
 * @returns {number} Radians
 */
function toRad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Get user's current location using browser Geolocation API
 * @returns {Promise<{lat: number, lng: number}>} User's coordinates
 */
export function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        let message = 'Unable to get your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location permission denied. Please enter your ZIP code instead.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information unavailable. Please enter your ZIP code.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out. Please enter your ZIP code.';
            break;
        }
        reject(new Error(message));
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // Cache for 5 minutes
      }
    );
  });
}

/**
 * Common ZIP codes for New England states with their coordinates
 * This is a subset for fast lookup; full dataset would be loaded separately
 */
const COMMON_ZIP_COORDS = {
  // Massachusetts
  '02101': { lat: 42.3601, lng: -71.0589 }, // Boston
  '02116': { lat: 42.3493, lng: -71.0779 }, // Boston Back Bay
  '02134': { lat: 42.3570, lng: -71.1312 }, // Allston
  '02138': { lat: 42.3770, lng: -71.1167 }, // Cambridge
  '02139': { lat: 42.3647, lng: -71.1042 }, // Cambridge
  '02140': { lat: 42.3932, lng: -71.1284 }, // Cambridge
  '02141': { lat: 42.3695, lng: -71.0816 }, // Cambridge
  '02142': { lat: 42.3629, lng: -71.0829 }, // Cambridge
  '02143': { lat: 42.3876, lng: -71.0995 }, // Somerville
  '02144': { lat: 42.4001, lng: -71.1230 }, // Somerville
  '02145': { lat: 42.3918, lng: -71.0836 }, // Somerville
  '02155': { lat: 42.4184, lng: -71.1062 }, // Medford
  '02176': { lat: 42.4584, lng: -71.0584 }, // Melrose
  '02420': { lat: 42.4473, lng: -71.2245 }, // Lexington
  '02445': { lat: 42.3418, lng: -71.1212 }, // Brookline
  '02446': { lat: 42.3446, lng: -71.1268 }, // Brookline
  '02459': { lat: 42.3370, lng: -71.2092 }, // Newton
  '02460': { lat: 42.3521, lng: -71.2121 }, // Newton
  '02461': { lat: 42.3188, lng: -71.2081 }, // Newton
  '02462': { lat: 42.2938, lng: -71.2629 }, // Newton
  '02464': { lat: 42.3521, lng: -71.2301 }, // Newton
  '02465': { lat: 42.3488, lng: -71.2401 }, // West Newton
  '02466': { lat: 42.3528, lng: -71.2521 }, // Auburndale
  '02467': { lat: 42.3118, lng: -71.1551 }, // Chestnut Hill
  '02468': { lat: 42.3121, lng: -71.2295 }, // Waban
  '02472': { lat: 42.3709, lng: -71.1828 }, // Watertown
  '02474': { lat: 42.4154, lng: -71.1565 }, // Arlington
  '02476': { lat: 42.4238, lng: -71.1890 }, // Arlington
  '02478': { lat: 42.3948, lng: -71.1801 }, // Belmont
  '02481': { lat: 42.3101, lng: -71.2734 }, // Wellesley
  '02482': { lat: 42.2951, lng: -71.2918 }, // Wellesley
  '02492': { lat: 42.2793, lng: -71.2376 }, // Needham
  '02493': { lat: 42.3521, lng: -71.2801 }, // Weston
  '02494': { lat: 42.2793, lng: -71.2376 }, // Needham
  '01701': { lat: 42.2793, lng: -71.4162 }, // Framingham
  '01702': { lat: 42.2793, lng: -71.4162 }, // Framingham
  '01718': { lat: 42.4743, lng: -71.3490 }, // Acton
  '01719': { lat: 42.4789, lng: -71.4363 }, // Boxborough
  '01720': { lat: 42.4601, lng: -71.3701 }, // Acton
  '01730': { lat: 42.4901, lng: -71.2584 }, // Bedford
  '01740': { lat: 42.4301, lng: -71.5584 }, // Bolton
  '01742': { lat: 42.4601, lng: -71.3501 }, // Concord
  '01746': { lat: 42.2126, lng: -71.4167 }, // Holliston
  '01748': { lat: 42.3243, lng: -71.5376 }, // Hopkinton
  '01749': { lat: 42.3751, lng: -71.5518 }, // Hudson
  '01752': { lat: 42.3501, lng: -71.5318 }, // Marlborough
  '01754': { lat: 42.4301, lng: -71.4601 }, // Maynard
  '01760': { lat: 42.2845, lng: -71.3468 }, // Natick
  '01770': { lat: 42.2276, lng: -71.3668 }, // Sherborn
  '01772': { lat: 42.3093, lng: -71.4751 }, // Southborough
  '01773': { lat: 42.3951, lng: -71.2451 }, // Lincoln
  '01775': { lat: 42.4401, lng: -71.4801 }, // Stow
  '01776': { lat: 42.3834, lng: -71.4162 }, // Sudbury
  '01778': { lat: 42.3626, lng: -71.3615 }, // Wayland
  '01801': { lat: 42.4793, lng: -71.1523 }, // Woburn
  '01803': { lat: 42.5001, lng: -71.1501 }, // Burlington
  '01810': { lat: 42.6584, lng: -71.1451 }, // Andover
  '01821': { lat: 42.5434, lng: -71.2501 }, // Billerica
  '01824': { lat: 42.5618, lng: -71.3918 }, // Chelmsford
  '01826': { lat: 42.5926, lng: -71.2168 }, // Dracut
  '01845': { lat: 42.7001, lng: -71.1584 }, // North Andover
  '01851': { lat: 42.6418, lng: -71.3151 }, // Lowell
  '01852': { lat: 42.6318, lng: -71.2884 }, // Lowell
  '01854': { lat: 42.6201, lng: -71.3418 }, // Lowell
  '01862': { lat: 42.6001, lng: -71.2801 }, // North Billerica
  '01863': { lat: 42.5684, lng: -71.3451 }, // North Chelmsford
  '01867': { lat: 42.5126, lng: -71.0951 }, // Reading
  '01876': { lat: 42.5418, lng: -71.1501 }, // Tewksbury
  '01880': { lat: 42.5043, lng: -71.0668 }, // Wakefield
  '01886': { lat: 42.5751, lng: -71.4368 }, // Westford
  '01887': { lat: 42.5626, lng: -71.1668 }, // Wilmington
  '01890': { lat: 42.4518, lng: -71.1418 }, // Winchester
  // Worcester area
  '01601': { lat: 42.2626, lng: -71.8023 }, // Worcester
  '01602': { lat: 42.2751, lng: -71.8251 }, // Worcester
  '01603': { lat: 42.2401, lng: -71.8168 }, // Worcester
  '01604': { lat: 42.2518, lng: -71.7551 }, // Worcester
  '01605': { lat: 42.2868, lng: -71.7901 }, // Worcester
  '01606': { lat: 42.3018, lng: -71.8101 }, // Worcester
  '01607': { lat: 42.2226, lng: -71.7951 }, // Worcester
  '01608': { lat: 42.2626, lng: -71.8023 }, // Worcester
  '01609': { lat: 42.2801, lng: -71.8351 }, // Worcester
  '01610': { lat: 42.2451, lng: -71.8168 }, // Worcester
  // Western MA
  '01002': { lat: 42.3765, lng: -72.5194 }, // Amherst
  '01003': { lat: 42.3765, lng: -72.5194 }, // Amherst
  '01013': { lat: 42.1487, lng: -72.6079 }, // Chicopee
  '01020': { lat: 42.1751, lng: -72.5751 }, // Chicopee
  '01040': { lat: 42.2101, lng: -72.6418 }, // Holyoke
  '01056': { lat: 42.2543, lng: -72.5768 }, // Ludlow
  '01057': { lat: 42.1040, lng: -72.3190 }, // Monson
  '01060': { lat: 42.3193, lng: -72.6295 }, // Northampton
  '01062': { lat: 42.3193, lng: -72.6295 }, // Florence/Northampton
  '01063': { lat: 42.3193, lng: -72.6295 }, // Northampton
  '01085': { lat: 42.1543, lng: -72.7268 }, // Westfield
  '01089': { lat: 42.1251, lng: -72.5668 }, // West Springfield
  '01101': { lat: 42.1015, lng: -72.5898 }, // Springfield
  '01103': { lat: 42.1015, lng: -72.5898 }, // Springfield
  '01104': { lat: 42.1251, lng: -72.5551 }, // Springfield
  '01105': { lat: 42.0918, lng: -72.5751 }, // Springfield
  '01106': { lat: 42.0468, lng: -72.5501 }, // Longmeadow
  '01107': { lat: 42.1126, lng: -72.6068 }, // Springfield
  '01108': { lat: 42.0801, lng: -72.5718 }, // Springfield
  '01109': { lat: 42.1251, lng: -72.5168 }, // Springfield
  '01118': { lat: 42.0743, lng: -72.5401 }, // Springfield
  '01119': { lat: 42.1226, lng: -72.5301 }, // Springfield
  '01128': { lat: 42.0918, lng: -72.4901 }, // Springfield
  '01129': { lat: 42.1168, lng: -72.4701 }, // Springfield
  // Southeastern MA
  '02301': { lat: 42.0834, lng: -71.0184 }, // Brockton
  '02302': { lat: 42.0918, lng: -71.0501 }, // Brockton
  '02324': { lat: 41.9904, lng: -70.9756 }, // Bridgewater
  '02333': { lat: 42.0251, lng: -70.9251 }, // East Bridgewater
  '02351': { lat: 42.1084, lng: -70.9118 }, // Abington
  '02359': { lat: 42.0826, lng: -70.8701 }, // Pembroke
  '02360': { lat: 41.9584, lng: -70.6668 }, // Plymouth
  '02368': { lat: 42.1618, lng: -71.0918 }, // Randolph
  '02379': { lat: 42.0168, lng: -71.0076 }, // West Bridgewater
  '02382': { lat: 42.0751, lng: -70.9501 }, // Whitman
  // New York (sample)
  '10001': { lat: 40.7484, lng: -73.9967 }, // Manhattan
  '10002': { lat: 40.7157, lng: -73.9863 }, // Manhattan
  '10003': { lat: 40.7317, lng: -73.9892 }, // Manhattan
  '10004': { lat: 40.6990, lng: -74.0384 }, // Manhattan
  '10005': { lat: 40.7068, lng: -74.0089 }, // Manhattan
  '10006': { lat: 40.7094, lng: -74.0131 }, // Manhattan
  '10007': { lat: 40.7135, lng: -74.0078 }, // Manhattan
  '10009': { lat: 40.7265, lng: -73.9793 }, // Manhattan
  '10010': { lat: 40.7390, lng: -73.9826 }, // Manhattan
  '10011': { lat: 40.7418, lng: -74.0002 }, // Manhattan
  '10012': { lat: 40.7258, lng: -73.9981 }, // Manhattan
  '10013': { lat: 40.7199, lng: -74.0046 }, // Manhattan
  '10014': { lat: 40.7340, lng: -74.0054 }, // Manhattan
  '10016': { lat: 40.7459, lng: -73.9780 }, // Manhattan
  '10017': { lat: 40.7527, lng: -73.9728 }, // Manhattan
  '10018': { lat: 40.7551, lng: -73.9930 }, // Manhattan
  '10019': { lat: 40.7654, lng: -73.9863 }, // Manhattan
  '10020': { lat: 40.7587, lng: -73.9787 }, // Manhattan
  '10021': { lat: 40.7693, lng: -73.9588 }, // Manhattan
  '10022': { lat: 40.7587, lng: -73.9679 }, // Manhattan
  '10023': { lat: 40.7765, lng: -73.9823 }, // Manhattan
  '10024': { lat: 40.7870, lng: -73.9754 }, // Manhattan
  '10025': { lat: 40.7987, lng: -73.9668 }, // Manhattan
  '11201': { lat: 40.6936, lng: -73.9899 }, // Brooklyn Heights
  '11211': { lat: 40.7128, lng: -73.9566 }, // Williamsburg
  '11215': { lat: 40.6628, lng: -73.9865 }, // Park Slope
  '11217': { lat: 40.6819, lng: -73.9787 }, // Brooklyn
  '11231': { lat: 40.6782, lng: -74.0024 }, // Red Hook
  '11238': { lat: 40.6795, lng: -73.9635 }, // Prospect Heights
  '11101': { lat: 40.7472, lng: -73.9438 }, // Long Island City
  '11375': { lat: 40.7207, lng: -73.8448 }, // Forest Hills
  '11372': { lat: 40.7515, lng: -73.8831 }, // Jackson Heights
  '10301': { lat: 40.6420, lng: -74.0900 }, // Staten Island
  '10451': { lat: 40.8200, lng: -73.9240 }, // Bronx
  '10452': { lat: 40.8370, lng: -73.9230 }, // Bronx
  '10453': { lat: 40.8520, lng: -73.9130 }, // Bronx
  '10454': { lat: 40.8071, lng: -73.9193 }, // Bronx
  '10456': { lat: 40.8311, lng: -73.9080 }, // Bronx
  '10458': { lat: 40.8615, lng: -73.8885 }, // Bronx
  '10461': { lat: 40.8457, lng: -73.8415 }, // Bronx
  '10463': { lat: 40.8792, lng: -73.9062 }, // Bronx
  '10466': { lat: 40.8908, lng: -73.8465 }, // Bronx
  '10467': { lat: 40.8693, lng: -73.8716 }, // Bronx
  // Long Island
  '11701': { lat: 40.6698, lng: -73.4115 }, // Amityville
  '11706': { lat: 40.7173, lng: -73.3262 }, // Bay Shore
  '11717': { lat: 40.7501, lng: -73.2351 }, // Brentwood
  '11756': { lat: 40.7243, lng: -73.5143 }, // Levittown
  '11757': { lat: 40.6943, lng: -73.3762 }, // Lindenhurst
  '11758': { lat: 40.6743, lng: -73.4562 }, // Massapequa
  '11772': { lat: 40.8068, lng: -72.9918 }, // Patchogue
  '11787': { lat: 40.8576, lng: -73.2015 }, // Smithtown
  '11788': { lat: 40.8268, lng: -73.1701 }, // Hauppauge
  '11790': { lat: 40.9076, lng: -73.1268 }, // Stony Brook
  '11794': { lat: 40.9076, lng: -73.1268 }, // Stony Brook (SUNY)
  '11801': { lat: 40.7448, lng: -73.5262 }, // Hicksville
  '11803': { lat: 40.7648, lng: -73.4262 }, // Plainview
  // Connecticut
  '06010': { lat: 41.6721, lng: -72.9251 }, // Bristol
  '06032': { lat: 41.7218, lng: -72.8268 }, // Farmington
  '06033': { lat: 41.7001, lng: -72.5401 }, // Glastonbury
  '06067': { lat: 41.6601, lng: -72.6401 }, // Rocky Hill
  '06070': { lat: 41.8768, lng: -72.8118 }, // Simsbury
  '06074': { lat: 41.6318, lng: -72.5768 }, // South Glastonbury
  '06082': { lat: 41.9826, lng: -72.5568 }, // Enfield
  '06089': { lat: 41.8618, lng: -72.8718 }, // Weatogue
  '06092': { lat: 41.8443, lng: -72.8518 }, // West Simsbury
  '06095': { lat: 41.8518, lng: -72.6601 }, // Windsor
  '06103': { lat: 41.7637, lng: -72.6851 }, // Hartford
  '06105': { lat: 41.7801, lng: -72.7001 }, // Hartford
  '06106': { lat: 41.7518, lng: -72.7068 }, // Hartford
  '06107': { lat: 41.7401, lng: -72.7518 }, // West Hartford
  '06108': { lat: 41.7768, lng: -72.6418 }, // East Hartford
  '06109': { lat: 41.6951, lng: -72.6768 }, // Wethersfield
  '06110': { lat: 41.7218, lng: -72.7318 }, // West Hartford
  '06111': { lat: 41.6843, lng: -72.7268 }, // Newington
  '06117': { lat: 41.7918, lng: -72.7668 }, // West Hartford
  '06118': { lat: 41.7518, lng: -72.6118 }, // East Hartford
  '06119': { lat: 41.7568, lng: -72.7418 }, // West Hartford
  '06401': { lat: 41.3418, lng: -73.0618 }, // Ansonia
  '06405': { lat: 41.2768, lng: -72.9568 }, // Branford
  '06410': { lat: 41.4318, lng: -72.8968 }, // Cheshire
  '06437': { lat: 41.2801, lng: -72.7768 }, // Guilford
  '06443': { lat: 41.3318, lng: -72.8068 }, // Madison
  '06450': { lat: 41.5368, lng: -72.8068 }, // Meriden
  '06460': { lat: 41.2218, lng: -73.0418 }, // Milford
  '06470': { lat: 41.3901, lng: -73.3068 }, // Newtown
  '06473': { lat: 41.3668, lng: -72.8518 }, // North Haven
  '06477': { lat: 41.2818, lng: -73.0218 }, // Orange
  '06480': { lat: 41.5618, lng: -72.5368 }, // Portland
  '06484': { lat: 41.2543, lng: -73.1268 }, // Shelton
  '06488': { lat: 41.4051, lng: -73.2368 }, // Southbury
  '06492': { lat: 41.4168, lng: -72.8218 }, // Wallingford
  '06510': { lat: 41.3065, lng: -72.9275 }, // New Haven
  '06511': { lat: 41.3168, lng: -72.9301 }, // New Haven
  '06512': { lat: 41.2868, lng: -72.8868 }, // East Haven
  '06513': { lat: 41.3118, lng: -72.8668 }, // New Haven
  '06515': { lat: 41.3218, lng: -72.9501 }, // New Haven
  '06516': { lat: 41.2768, lng: -72.9618 }, // West Haven
  '06604': { lat: 41.1868, lng: -73.2018 }, // Bridgeport
  '06605': { lat: 41.1618, lng: -73.2218 }, // Bridgeport
  '06606': { lat: 41.2018, lng: -73.2118 }, // Bridgeport
  '06607': { lat: 41.1768, lng: -73.1718 }, // Bridgeport
  '06608': { lat: 41.1918, lng: -73.1818 }, // Bridgeport
  '06610': { lat: 41.2018, lng: -73.1618 }, // Bridgeport
  '06611': { lat: 41.2418, lng: -73.2118 }, // Trumbull
  '06614': { lat: 41.2118, lng: -73.1118 }, // Stratford
  '06615': { lat: 41.1768, lng: -73.1318 }, // Stratford
  '06702': { lat: 41.5568, lng: -73.0368 }, // Waterbury
  '06704': { lat: 41.5468, lng: -73.0568 }, // Waterbury
  '06705': { lat: 41.5218, lng: -73.0118 }, // Waterbury
  '06706': { lat: 41.5368, lng: -73.0168 }, // Waterbury
  '06708': { lat: 41.5668, lng: -73.0668 }, // Waterbury
  '06710': { lat: 41.5768, lng: -73.0468 }, // Waterbury
  '06712': { lat: 41.4968, lng: -72.9718 }, // Prospect
  '06716': { lat: 41.5918, lng: -72.9718 }, // Wolcott
  '06770': { lat: 41.4868, lng: -73.0518 }, // Naugatuck
  '06776': { lat: 41.5768, lng: -73.4068 }, // New Milford
  '06790': { lat: 41.7518, lng: -73.1268 }, // Torrington
  '06801': { lat: 41.3701, lng: -73.3918 }, // Bethel
  '06810': { lat: 41.3951, lng: -73.4518 }, // Danbury
  '06811': { lat: 41.4168, lng: -73.4918 }, // Danbury
  '06820': { lat: 41.0651, lng: -73.4718 }, // Darien
  '06824': { lat: 41.1651, lng: -73.2618 }, // Fairfield
  '06825': { lat: 41.1801, lng: -73.2418 }, // Fairfield
  '06830': { lat: 41.0218, lng: -73.6301 }, // Greenwich
  '06831': { lat: 41.0618, lng: -73.6501 }, // Greenwich
  '06840': { lat: 41.1468, lng: -73.4918 }, // New Canaan
  '06850': { lat: 41.1118, lng: -73.4218 }, // Norwalk
  '06851': { lat: 41.1268, lng: -73.4218 }, // Norwalk
  '06854': { lat: 41.0818, lng: -73.4418 }, // South Norwalk
  '06855': { lat: 41.0968, lng: -73.4018 }, // East Norwalk
  '06880': { lat: 41.1368, lng: -73.3368 }, // Westport
  '06883': { lat: 41.2118, lng: -73.3318 }, // Weston
  '06890': { lat: 41.1418, lng: -73.2718 }, // Southport
  '06897': { lat: 41.2101, lng: -73.3918 }, // Wilton
  '06901': { lat: 41.0518, lng: -73.5418 }, // Stamford
  '06902': { lat: 41.0718, lng: -73.5318 }, // Stamford
  '06903': { lat: 41.0968, lng: -73.5718 }, // Stamford
  '06905': { lat: 41.0618, lng: -73.5618 }, // Stamford
  '06906': { lat: 41.0418, lng: -73.5218 }, // Stamford
  // Rhode Island
  '02806': { lat: 41.7415, lng: -71.3087 }, // Barrington
  '02809': { lat: 41.6801, lng: -71.2668 }, // Bristol
  '02818': { lat: 41.6534, lng: -71.4618 }, // East Greenwich
  '02840': { lat: 41.4901, lng: -71.3134 }, // Newport
  '02841': { lat: 41.5168, lng: -71.3268 }, // Newport
  '02842': { lat: 41.5268, lng: -71.2868 }, // Middletown
  '02852': { lat: 41.5768, lng: -71.4568 }, // North Kingstown
  '02860': { lat: 41.8718, lng: -71.3918 }, // Pawtucket
  '02861': { lat: 41.8868, lng: -71.3768 }, // Pawtucket
  '02863': { lat: 41.9018, lng: -71.3918 }, // Central Falls
  '02864': { lat: 41.9451, lng: -71.4368 }, // Cumberland
  '02865': { lat: 41.9318, lng: -71.4918 }, // Lincoln
  '02871': { lat: 41.5768, lng: -71.2518 }, // Portsmouth
  '02874': { lat: 41.4718, lng: -71.5268 }, // Saunderstown
  '02879': { lat: 41.4418, lng: -71.5268 }, // Wakefield
  '02881': { lat: 41.4851, lng: -71.5268 }, // Kingston
  '02882': { lat: 41.4118, lng: -71.4568 }, // Narragansett
  '02886': { lat: 41.7068, lng: -71.4718 }, // Warwick
  '02888': { lat: 41.7318, lng: -71.4268 }, // Warwick
  '02889': { lat: 41.6868, lng: -71.4118 }, // Warwick
  '02891': { lat: 41.3768, lng: -71.8268 }, // Westerly
  '02893': { lat: 41.6968, lng: -71.5218 }, // West Warwick
  '02895': { lat: 41.9768, lng: -71.5518 }, // Woonsocket
  '02896': { lat: 41.9618, lng: -71.5818 }, // North Smithfield
  '02903': { lat: 41.8201, lng: -71.4151 }, // Providence
  '02904': { lat: 41.8451, lng: -71.4401 }, // Providence
  '02905': { lat: 41.7868, lng: -71.4001 }, // Providence
  '02906': { lat: 41.8401, lng: -71.3918 }, // Providence
  '02907': { lat: 41.8068, lng: -71.4268 }, // Providence
  '02908': { lat: 41.8351, lng: -71.4501 }, // Providence
  '02909': { lat: 41.8168, lng: -71.4501 }, // Providence
  '02910': { lat: 41.7718, lng: -71.4418 }, // Cranston
  '02911': { lat: 41.8551, lng: -71.4768 }, // North Providence
  '02914': { lat: 41.8068, lng: -71.3668 }, // East Providence
  '02915': { lat: 41.7718, lng: -71.3468 }, // Riverside
  '02916': { lat: 41.8368, lng: -71.3618 }, // Rumford
  '02917': { lat: 41.9068, lng: -71.5168 }, // Smithfield
  '02919': { lat: 41.8618, lng: -71.5168 }, // Johnston
  '02920': { lat: 41.7568, lng: -71.4768 }, // Cranston
  '02921': { lat: 41.7418, lng: -71.5068 }, // Cranston
};

/**
 * Look up coordinates for a ZIP code
 * @param {string} zip - 5-digit ZIP code
 * @returns {{lat: number, lng: number} | null} Coordinates or null if not found
 */
export function getZipCoordinates(zip) {
  const normalizedZip = zip.replace(/\D/g, '').slice(0, 5);
  return COMMON_ZIP_COORDS[normalizedZip] || null;
}

/**
 * Validate ZIP code format
 * @param {string} zip - ZIP code to validate
 * @returns {boolean} True if valid format
 */
export function isValidZip(zip) {
  return /^\d{5}(-\d{4})?$/.test(zip.trim());
}

/**
 * Format distance for display
 * @param {number} miles - Distance in miles
 * @returns {string} Formatted distance string
 */
export function formatDistance(miles) {
  if (miles < 0.1) {
    return '< 0.1 mi';
  } else if (miles < 10) {
    return `${miles.toFixed(1)} mi`;
  } else {
    return `${Math.round(miles)} mi`;
  }
}

/**
 * Sort items by distance from a location
 * @param {Array} items - Array of items with coordinates
 * @param {{lat: number, lng: number}} userLocation - User's location
 * @returns {Array} Items sorted by distance with _distance property added
 */
export function sortByDistance(items, userLocation) {
  return items
    .map((item) => {
      if (item.coordinates) {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          item.coordinates.lat,
          item.coordinates.lng
        );
        return { ...item, _distance: distance };
      }
      return { ...item, _distance: Infinity };
    })
    .sort((a, b) => a._distance - b._distance);
}

/**
 * Filter items within a radius
 * @param {Array} items - Array of items with coordinates
 * @param {{lat: number, lng: number}} userLocation - User's location
 * @param {number} radiusMiles - Maximum distance in miles
 * @returns {Array} Items within radius with _distance property added
 */
export function filterByRadius(items, userLocation, radiusMiles) {
  return items
    .map((item) => {
      if (item.coordinates) {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          item.coordinates.lat,
          item.coordinates.lng
        );
        return { ...item, _distance: distance };
      }
      return { ...item, _distance: Infinity };
    })
    .filter((item) => item._distance <= radiusMiles);
}
