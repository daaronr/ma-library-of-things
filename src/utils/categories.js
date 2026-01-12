/**
 * Category icons and normalization utilities
 */

export const categoryIcons = {
  'Home Improvement': '🔧',
  'Measurement & Detection': '📏',
  'Home Inspection': '🔍',
  'Auto/Vehicle': '🚗',
  'Bicycle': '🚲',
  'Gardening': '🌱',
  'Outdoor/Camping': '⛺',
  'Outdoor Games': '🎯',
  'Crafts/Sewing': '🧵',
  'Crafts/Hobbies': '✂️',
  'Technology': '💻',
  'Technology/Gaming': '🎮',
  'Technology/STEM': '🤖',
  'Music': '🎸',
  'Musical Instruments': '🎵',
  'Kitchen': '🍳',
  'Party/Event': '🎉',
  'Wellness/Health': '❤️',
  'Health/Wellness': '💚',
  'Games': '🎲',
  'Games/Puzzles': '🧩',
  'Games/Recreation': '🎮',
  'Outdoor/Recreation': '🏕️',
  'Science/Education': '🔬',
  'Entertainment': '🎭',
  'Home Equipment': '🏠',
  'Tools/Accessories': '🔨',
  'Dolls': '👧',
};

/**
 * Get icon for a category
 * @param {string} category - Category name
 * @returns {string} - Emoji icon
 */
export function getCategoryIcon(category) {
  return categoryIcons[category] || '📦';
}

/**
 * Normalize category name for consistency
 * @param {string} category - Raw category name
 * @returns {string} - Normalized category
 */
export function normalizeCategory(category) {
  // Map variations to standard names
  const normalizations = {
    'tools': 'Home Improvement',
    'home improvement': 'Home Improvement',
    'technology': 'Technology',
    'tech': 'Technology',
    'gaming': 'Technology/Gaming',
    'music': 'Music',
    'instruments': 'Musical Instruments',
    'musical instruments': 'Musical Instruments',
    'outdoor': 'Outdoor/Camping',
    'camping': 'Outdoor/Camping',
    'games': 'Games',
    'board games': 'Games',
    'lawn games': 'Outdoor Games',
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
  };

  const lower = category.toLowerCase().trim();
  return normalizations[lower] || category;
}

/**
 * Get all standard categories sorted
 * @returns {string[]} - Sorted category names
 */
export function getStandardCategories() {
  return Object.keys(categoryIcons).sort();
}

export default {
  categoryIcons,
  getCategoryIcon,
  normalizeCategory,
  getStandardCategories,
};
