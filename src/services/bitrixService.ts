
/**
 * This is a mock service for Bitrix24 integration
 * In a real implementation, this would be replaced with actual API calls to Bitrix24
 */

import { Product } from '@/components/ProductCard';

// This would come from Bitrix24 in a real implementation
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Professional DSLR Camera',
    description: 'High-end DSLR camera with 24.2 megapixels, perfect for professional photography.',
    price: 89.99,
    category: 'Photography',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop',
    available: true
  },
  {
    id: '2',
    title: 'Drone with 4K Camera',
    description: 'Professional drone with 4K camera, 30-minute flight time, and obstacle avoidance.',
    price: 129.99,
    category: 'Photography',
    imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=2070&auto=format&fit=crop',
    available: true
  },
  {
    id: '3',
    title: 'Professional Video Lighting Kit',
    description: 'Complete lighting kit for professional video production with adjustable brightness.',
    price: 69.99,
    category: 'Video',
    imageUrl: 'https://images.unsplash.com/photo-1616530834117-9145a889ed11?q=80&w=1973&auto=format&fit=crop',
    available: true
  },
  {
    id: '4',
    title: 'Wireless Lavalier Microphone',
    description: 'Professional wireless lavalier microphone system for crystal clear audio recording.',
    price: 49.99,
    category: 'Audio',
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=2070&auto=format&fit=crop',
    available: false
  },
  {
    id: '5',
    title: 'Portable Green Screen',
    description: 'Collapsible green screen for chroma keying in video production, easy to set up.',
    price: 39.99,
    category: 'Video',
    imageUrl: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?q=80&w=2070&auto=format&fit=crop',
    available: true
  },
  {
    id: '6',
    title: 'Professional Tripod',
    description: 'Heavy-duty tripod for cameras and video equipment with fluid head for smooth panning.',
    price: 59.99,
    category: 'Photography',
    imageUrl: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?q=80&w=2070&auto=format&fit=crop',
    available: true
  },
  {
    id: '7',
    title: 'Audio Mixer',
    description: '8-channel audio mixer for professional sound recording and live performance.',
    price: 79.99,
    category: 'Audio',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop',
    available: true
  },
  {
    id: '8',
    title: 'Wireless Headphones',
    description: 'Professional-grade wireless headphones with noise cancellation for monitoring audio.',
    price: 44.99,
    category: 'Audio',
    imageUrl: 'https://images.unsplash.com/photo-1545127398-14699f92334b?q=80&w=2035&auto=format&fit=crop',
    available: true
  }
];

export interface BookingPeriod {
  startDate: Date;
  endDate: Date;
  productId: string;
  customerId: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

// Mock bookings data
const MOCK_BOOKINGS: BookingPeriod[] = [
  {
    productId: '1',
    customerId: 'user1',
    startDate: new Date(2023, 10, 15, 10, 0),
    endDate: new Date(2023, 10, 17, 18, 0),
    status: 'confirmed',
  },
  {
    productId: '3',
    customerId: 'user2',
    startDate: new Date(2023, 10, 20, 9, 0),
    endDate: new Date(2023, 10, 21, 17, 0),
    status: 'pending',
  },
];

// Mock categories
const MOCK_CATEGORIES = [
  { id: '1', name: 'Photography' },
  { id: '2', name: 'Video' },
  { id: '3', name: 'Audio' },
  { id: '4', name: 'Lighting' },
  { id: '5', name: 'Accessories' },
];

export interface BitrixService {
  getProducts: (options?: { category?: string; search?: string }) => Promise<Product[]>;
  getProductById: (id: string) => Promise<Product | null>;
  getCategories: () => Promise<{ id: string; name: string }[]>;
  getProductBookings: (productId: string) => Promise<BookingPeriod[]>;
  createBooking: (booking: Omit<BookingPeriod, 'status'>) => Promise<BookingPeriod>;
  getAvailableProducts: (startDate: Date, endDate: Date) => Promise<Product[]>;
}

// Simulating API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const BitrixService: BitrixService = {
  getProducts: async (options = {}) => {
    // Simulate API call delay
    await delay(800);
    
    let filteredProducts = [...MOCK_PRODUCTS];
    
    // Apply category filter if provided
    if (options.category) {
      filteredProducts = filteredProducts.filter(
        product => product.category.toLowerCase() === options.category?.toLowerCase()
      );
    }
    
    // Apply search filter if provided
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        product => 
          product.title.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower)
      );
    }
    
    return filteredProducts;
  },
  
  getProductById: async (id: string) => {
    await delay(500);
    return MOCK_PRODUCTS.find(product => product.id === id) || null;
  },
  
  getCategories: async () => {
    await delay(300);
    return MOCK_CATEGORIES;
  },
  
  getProductBookings: async (productId: string) => {
    await delay(500);
    return MOCK_BOOKINGS.filter(booking => booking.productId === productId);
  },
  
  createBooking: async (booking: Omit<BookingPeriod, 'status'>) => {
    await delay(1000);
    const newBooking: BookingPeriod = {
      ...booking,
      status: 'pending',
    };
    
    // In a real implementation, this would send the data to Bitrix24
    console.log('Creating booking:', newBooking);
    
    return newBooking;
  },
  
  getAvailableProducts: async (startDate: Date, endDate: Date) => {
    await delay(800);
    
    // Check which products are available in the given date range
    return MOCK_PRODUCTS.filter(product => {
      if (!product.available) return false;
      
      // Check if the product is already booked during this period
      const productBookings = MOCK_BOOKINGS.filter(
        booking => booking.productId === product.id && booking.status !== 'cancelled'
      );
      
      const isBooked = productBookings.some(
        booking => 
          (startDate >= booking.startDate && startDate < booking.endDate) || 
          (endDate > booking.startDate && endDate <= booking.endDate) ||
          (startDate <= booking.startDate && endDate >= booking.endDate)
      );
      
      return !isBooked;
    });
  },
};

export default BitrixService;
