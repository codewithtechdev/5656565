export const CATEGORIES = {
  HTML_CSS_JS: 'html-css-js',
  PYTHON: 'python',
  OPEN_SOURCE: 'open-source'
}

export const PRODUCT_FEATURES = [
  'Responsive Design',
  'Dark Mode',
  'Source Code Included',
  'Documentation',
  'Lifetime Updates',
  'Technical Support',
  'MIT License',
  'Mobile Friendly',
  'SEO Optimized',
  'Cross Browser Compatible'
]

export const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: 1000 },
  { label: 'Under $25', min: 0, max: 25 },
  { label: '$25 - $50', min: 25, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: 'Over $100', min: 100, max: 1000 },
  { label: 'Free', min: 0, max: 0 }
]

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A to Z' },
  { value: 'featured', label: 'Featured First' }
]

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
}

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}