/**
 * Format a price for display.
 * @param {number} price
 * @param {string} [priceType] - 'monthly', 'free', or undefined for one-time
 * @returns {string}
 */
export function formatPrice(price, priceType) {
  if (priceType === 'free' || price === 0) return 'Free';

  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  if (priceType === 'monthly') return `${formatted}/mo`;
  return formatted;
}

/**
 * Format distance in miles.
 * @param {number} miles
 * @returns {string}
 */
export function formatDistance(miles) {
  if (miles == null) return '';
  if (miles < 1) return `${miles.toFixed(1)} mi`;
  return `${Math.round(miles)} mi away`;
}

/**
 * Format an ISO date string as a relative time string.
 * @param {string} isoDate
 * @returns {string}
 */
export function formatTimeAgo(isoDate) {
  if (!isoDate) return '';

  const now = new Date();
  const date = new Date(isoDate);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;

  const years = Math.floor(days / 365);
  return `${years} year${years !== 1 ? 's' : ''} ago`;
}

/**
 * Returns a Tailwind color class for a given condition.
 * @param {string} condition
 * @returns {string}
 */
export function getConditionColor(condition) {
  const colors = {
    new: 'text-green-600 bg-green-100',
    'like new': 'text-emerald-600 bg-emerald-100',
    'like_new': 'text-emerald-600 bg-emerald-100',
    excellent: 'text-blue-600 bg-blue-100',
    good: 'text-yellow-600 bg-yellow-100',
    fair: 'text-orange-600 bg-orange-100',
    poor: 'text-red-600 bg-red-100',
    salvage: 'text-red-700 bg-red-200',
  };
  return colors[condition?.toLowerCase()] || 'text-gray-600 bg-gray-100';
}

/**
 * Returns a display label for a condition value.
 * @param {string} condition
 * @returns {string}
 */
export function getConditionLabel(condition) {
  const labels = {
    new: 'New',
    'like new': 'Like New',
    'like_new': 'Like New',
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    poor: 'Poor',
    salvage: 'Salvage',
  };
  return labels[condition?.toLowerCase()] || condition || 'Unknown';
}

const CAR_TERMS = [
  'car', 'truck', 'suv', 'van', 'vehicle', 'auto', 'automobile',
  'toyota', 'honda', 'ford', 'chevy', 'chevrolet', 'bmw', 'mercedes',
  'audi', 'nissan', 'hyundai', 'kia', 'subaru', 'jeep', 'dodge',
  'tesla', 'lexus', 'acura', 'mazda', 'volkswagen', 'vw', 'volvo',
  'sedan', 'coupe', 'convertible', 'minivan', 'pickup',
];

const HOUSING_TERMS = [
  'apartment', 'house', 'condo', 'townhouse', 'rent', 'rental',
  'bedroom', 'bath', 'studio', 'duplex', 'lease', 'housing',
  'room', 'sublet', 'flat', 'loft',
];

const ELECTRONICS_TERMS = [
  'phone', 'iphone', 'samsung', 'laptop', 'computer', 'tablet',
  'ipad', 'macbook', 'tv', 'television', 'monitor', 'console',
  'playstation', 'xbox', 'nintendo', 'camera', 'headphones',
  'airpods', 'speaker', 'gpu', 'graphics card',
];

const FURNITURE_TERMS = [
  'couch', 'sofa', 'table', 'chair', 'desk', 'bed', 'dresser',
  'bookshelf', 'cabinet', 'nightstand', 'mattress', 'futon',
  'ottoman', 'recliner', 'shelf',
];

/**
 * Analyze search text and guess the most likely category.
 * @param {string} query
 * @returns {string} category name or empty string
 */
export function detectSearchCategory(query) {
  if (!query || !query.trim()) return '';

  const q = query.toLowerCase();

  const score = (terms) =>
    terms.reduce((count, term) => (q.includes(term) ? count + 1 : count), 0);

  const categories = [
    { name: 'vehicles', score: score(CAR_TERMS) },
    { name: 'housing', score: score(HOUSING_TERMS) },
    { name: 'electronics', score: score(ELECTRONICS_TERMS) },
    { name: 'furniture', score: score(FURNITURE_TERMS) },
  ];

  const best = categories.reduce((a, b) => (b.score > a.score ? b : a));
  return best.score > 0 ? best.name : '';
}

/**
 * Generate autocomplete suggestions based on partial query text.
 * @param {string} query
 * @returns {string[]}
 */
export function generateSearchSuggestions(query) {
  if (!query || query.trim().length < 2) return [];

  const q = query.toLowerCase().trim();

  const allSuggestions = [
    // Vehicles
    'Toyota Camry', 'Honda Civic', 'Ford F-150', 'Tesla Model 3',
    'BMW 3 Series', 'Jeep Wrangler', 'Chevrolet Silverado',
    'Used cars under $10,000', 'Trucks for sale', 'SUV with low mileage',
    // Electronics
    'iPhone 15 Pro', 'Samsung Galaxy S24', 'MacBook Pro', 'iPad Air',
    'PlayStation 5', 'Xbox Series X', 'Nintendo Switch',
    'Gaming laptop', '4K TV', 'AirPods Pro',
    // Furniture
    'Sectional sofa', 'Standing desk', 'Queen bed frame',
    'Dining table set', 'Office chair', 'Bookshelf',
    // Housing
    'Apartments for rent', '2 bedroom house', 'Studio apartment',
    'Room for rent', 'Furnished apartment',
    // General
    'Bikes', 'Gym equipment', 'Tools', 'Baby stroller',
    'Winter jacket', 'Moving sale', 'Free stuff',
  ];

  return allSuggestions
    .filter((s) => s.toLowerCase().includes(q))
    .slice(0, 8);
}
