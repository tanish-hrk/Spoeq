// Eco-friendly themed mock sports equipment data for landing page showcases
export const mockFeaturedProducts = [
  {
    id: 'm-ball-pro',
    name: 'Momentum Pro Basketball',
    category: 'Team Sports',
    brand: 'AeroX',
    price: { mrp: 2499, sale: 1899 },
    rating: 4.8,
    ratingCount: 312,
    badge: 'Hot',
    colors: ['#2e7d32','#ffb300'],
    img: '/images/mock/basketball.jpg'
  },
  {
    id: 's-carbon-racket',
    name: 'Carbon Smash Badminton Racket',
    category: 'Racquet',
    brand: 'FeatherLite',
    price: { mrp: 4999, sale: 3499 },
    rating: 4.6,
    ratingCount: 201,
    badge: 'New',
    colors: ['#43a047','#1e88e5'],
    img: '/images/mock/racket.jpg'
  },
  {
    id: 'trail-runner-2',
    name: 'TrailRunner 2.0 Shoes',
    category: 'Running',
    brand: 'StrideLab',
    price: { mrp: 6999, sale: 5299 },
    rating: 4.9,
    ratingCount: 842,
    badge: 'Best',
    colors: ['#81c784','#2e7d32'],
    img: '/images/mock/shoes.jpg'
  },
  {
    id: 'hybrid-yoga-mat',
    name: 'Hybrid Grip Yoga Mat',
    category: 'Fitness',
    brand: 'ZenFlex',
    price: { mrp: 2899, sale: 2199 },
    rating: 4.7,
    ratingCount: 455,
    badge: 'Eco',
    colors: ['#a5d6a7','#5d4037'],
    img: '/images/mock/yogamat.jpg'
  }
];

export const mockCategorySpotlight = [
  {
    key: 'running',
    title: 'Run Further, Lighter',
    blurb: 'Sustainable materials meet performance engineering for every stride.',
    gradient: 'from-eco-grass/30 via-eco-moss/20 to-transparent',
    img: '/images/mock/run-category.jpg'
  },
  {
    key: 'fitness',
    title: 'Build Clean Strength',
    blurb: 'Low-impact, recycled composites powering your daily reps.',
    gradient: 'from-eco-leaf/25 via-eco-fern/20 to-transparent',
    img: '/images/mock/fitness-category.jpg'
  },
  {
    key: 'training',
    title: 'Train With Intention',
    blurb: 'Precision tools for balance, mobility and power.',
    gradient: 'from-eco-fern/30 via-eco-grass/10 to-transparent',
    img: '/images/mock/training-category.jpg'
  }
];

export const mockTestimonials = [
  { id: 1, name: 'Aarav M.', sport: 'Marathon', quote: 'The TrailRunner shoes feel fast and grounded — love the eco materials!', rating: 5 },
  { id: 2, name: 'Kavya S.', sport: 'Yoga', quote: 'Grip and cushioning on the Hybrid Mat are next-level sustainable comfort.', rating: 5 },
  { id: 3, name: 'Rohan P.', sport: 'Badminton', quote: 'My smashes are cleaner and the balance is unreal on the Carbon Smash.', rating: 4.5 }
];

export const mockBadges = {
  Hot: 'bg-gradient-to-r from-amber-500 to-red-500 text-white',
  New: 'bg-gradient-to-r from-eco-grass to-eco-moss text-white',
  Best: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white',
  Eco: 'bg-gradient-to-r from-eco-leaf to-eco-grass text-white'
};
