/**
 * Bitrix24 integration service
 */

import { Product } from '@/components/ProductCard';
import { toast } from '@/hooks/use-toast';

// The mock products will be used as fallback if the API fails
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

// Mock bookings data will be used as fallback
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

// Mock categories will be used as fallback
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

// Simulate API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Configuration for Bitrix24 API
interface BitrixConfig {
  domain: string; // e.g., "yourcompany.bitrix24.com"
  token?: string; // REST API token if using access token auth
}

// Initialize config from localStorage or defaults
const getConfig = (): BitrixConfig => {
  const savedConfig = localStorage.getItem('bitrixConfig');
  return savedConfig ? JSON.parse(savedConfig) : { domain: '' };
};

// Save config to localStorage
const saveConfig = (config: BitrixConfig) => {
  localStorage.setItem('bitrixConfig', JSON.stringify(config));
};

// Check if integration is configured
const isConfigured = (): boolean => {
  const config = getConfig();
  return Boolean(config.domain);
};

/**
 * Make a request to the Bitrix24 REST API
 */
const callBitrix24Api = async (method: string, params: Record<string, any> = {}): Promise<any> => {
  try {
    const config = getConfig();
    
    if (!config.domain) {
      throw new Error('Bitrix24 integration not configured');
    }
    
    let url = `https://${config.domain}/rest/${method}`;
    
    // Add authentication parameters
    if (config.token) {
      url += `?auth=${config.token}`;
    }
    
    // Make the request
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      throw new Error(`Bitrix24 API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Bitrix24 returns errors in a successful response
    if (data.error) {
      throw new Error(`Bitrix24 API error: ${data.error_description || data.error}`);
    }
    
    return data.result;
  } catch (error) {
    console.error('Bitrix24 API call failed:', error);
    toast({
      title: 'Bitrix24 Error',
      description: error instanceof Error ? error.message : 'Failed to connect to Bitrix24',
      variant: 'destructive',
    });
    throw error;
  }
};

/**
 * Map Bitrix24 product data to our Product interface
 */
const mapBitrixProductToProduct = (bitrixProduct: any): Product => {
  return {
    id: bitrixProduct.ID || String(bitrixProduct.id),
    title: bitrixProduct.NAME || bitrixProduct.name,
    description: bitrixProduct.DESCRIPTION || bitrixProduct.description || '',
    price: parseFloat(bitrixProduct.PRICE || bitrixProduct.price || 0),
    category: bitrixProduct.SECTION_NAME || bitrixProduct.category || 'Uncategorized',
    imageUrl: bitrixProduct.DETAIL_PICTURE_URL || bitrixProduct.imageUrl || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop',
    available: bitrixProduct.AVAILABLE !== false,
  };
};

/**
 * The actual BitrixService implementation
 */
const BitrixService: BitrixService & { 
  configure: (config: BitrixConfig) => void;
  isConfigured: () => boolean;
} = {
  /**
   * Configure the Bitrix24 integration
   */
  configure: (config: BitrixConfig) => {
    saveConfig(config);
    toast({
      title: 'Bitrix24 Integration',
      description: 'Configuration saved successfully',
    });
  },
  
  /**
   * Check if Bitrix24 is configured
   */
  isConfigured,
  
  /**
   * Get products with optional filtering
   */
  getProducts: async (options = {}) => {
    try {
      if (!isConfigured()) {
        return MOCK_PRODUCTS;
      }
      
      // Call Bitrix24 API to get catalog items
      const result = await callBitrix24Api('catalog.product.list', {
        filter: options.category ? { SECTION_NAME: options.category } : {},
        select: ['ID', 'NAME', 'DESCRIPTION', 'PRICE', 'SECTION_NAME', 'DETAIL_PICTURE_URL', 'AVAILABLE'],
      });
      
      let products = (result?.products || []).map(mapBitrixProductToProduct);
      
      // Apply search filter if provided
      if (options.search && products.length > 0) {
        const searchLower = options.search.toLowerCase();
        products = products.filter(
          product => 
            product.title.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower) ||
            product.category.toLowerCase().includes(searchLower)
        );
      }
      
      return products;
    } catch (error) {
      console.error('Failed to get products from Bitrix24:', error);
      // Fall back to mock data
      return MOCK_PRODUCTS;
    }
  },
  
  /**
   * Get a single product by ID
   */
  getProductById: async (id: string) => {
    try {
      if (!isConfigured()) {
        return MOCK_PRODUCTS.find(product => product.id === id) || null;
      }
      
      const result = await callBitrix24Api('catalog.product.get', {
        id: parseInt(id, 10),
      });
      
      return result ? mapBitrixProductToProduct(result) : null;
    } catch (error) {
      console.error('Failed to get product from Bitrix24:', error);
      // Fall back to mock data
      return MOCK_PRODUCTS.find(product => product.id === id) || null;
    }
  },
  
  /**
   * Get all product categories
   */
  getCategories: async () => {
    try {
      if (!isConfigured()) {
        return MOCK_CATEGORIES;
      }
      
      const result = await callBitrix24Api('catalog.section.list', {
        select: ['ID', 'NAME'],
      });
      
      return (result || []).map((section: any) => ({
        id: section.ID || String(section.id),
        name: section.NAME || section.name,
      }));
    } catch (error) {
      console.error('Failed to get categories from Bitrix24:', error);
      // Fall back to mock data
      return MOCK_CATEGORIES;
    }
  },
  
  /**
   * Get bookings for a specific product
   */
  getProductBookings: async (productId: string) => {
    try {
      if (!isConfigured()) {
        return MOCK_BOOKINGS.filter(booking => booking.productId === productId);
      }
      
      // This would need to be implemented based on your Bitrix24 CRM structure
      // Here's an example assuming you have a custom CRM field for product bookings
      const result = await callBitrix24Api('crm.deal.list', {
        filter: { 'UF_CRM_PRODUCT_ID': productId },
        select: ['ID', 'UF_CRM_START_DATE', 'UF_CRM_END_DATE', 'UF_CRM_CUSTOMER_ID', 'STAGE_ID'],
      });
      
      return (result || []).map((deal: any) => {
        // Map Bitrix24 deal stages to booking statuses
        let status: BookingPeriod['status'] = 'pending';
        if (deal.STAGE_ID === 'WON') status = 'confirmed';
        else if (deal.STAGE_ID === 'COMPLETED') status = 'completed';
        else if (deal.STAGE_ID === 'LOSE') status = 'cancelled';
        
        return {
          productId,
          customerId: deal.UF_CRM_CUSTOMER_ID || 'unknown',
          startDate: new Date(deal.UF_CRM_START_DATE),
          endDate: new Date(deal.UF_CRM_END_DATE),
          status,
        };
      });
    } catch (error) {
      console.error('Failed to get bookings from Bitrix24:', error);
      // Fall back to mock data
      return MOCK_BOOKINGS.filter(booking => booking.productId === productId);
    }
  },
  
  /**
   * Create a new booking in Bitrix24
   */
  createBooking: async (booking: Omit<BookingPeriod, 'status'>) => {
    try {
      if (!isConfigured()) {
        const newBooking: BookingPeriod = {
          ...booking,
          status: 'pending',
        };
        console.log('Creating mock booking:', newBooking);
        return newBooking;
      }
      
      // Create a deal in Bitrix24 CRM
      const result = await callBitrix24Api('crm.deal.add', {
        fields: {
          TITLE: `Equipment Rental - Product ID: ${booking.productId}`,
          CATEGORY_ID: 1, // You might need to adjust this to your CRM structure
          STAGE_ID: 'NEW',
          UF_CRM_PRODUCT_ID: booking.productId,
          UF_CRM_CUSTOMER_ID: booking.customerId,
          UF_CRM_START_DATE: booking.startDate.toISOString(),
          UF_CRM_END_DATE: booking.endDate.toISOString(),
        },
      });
      
      return {
        ...booking,
        status: 'pending',
      };
    } catch (error) {
      console.error('Failed to create booking in Bitrix24:', error);
      toast({
        title: 'Booking Error',
        description: 'Could not create booking in Bitrix24. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  },
  
  /**
   * Get products that are available for booking in a date range
   */
  getAvailableProducts: async (startDate: Date, endDate: Date) => {
    try {
      // First get all products
      const allProducts = await BitrixService.getProducts();
      
      if (!isConfigured()) {
        // Use mock logic for availability checks
        return allProducts.filter(product => {
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
      }
      
      // This would need custom implementation in Bitrix24
      // For each product, check if it's available in the date range
      const availableProducts: Product[] = [];
      
      for (const product of allProducts) {
        if (!product.available) continue;
        
        // Get bookings for this product
        const bookings = await BitrixService.getProductBookings(product.id);
        
        // Check if product is already booked during this period
        const isBooked = bookings.some(
          booking => 
            booking.status !== 'cancelled' && (
              (startDate >= booking.startDate && startDate < booking.endDate) || 
              (endDate > booking.startDate && endDate <= booking.endDate) ||
              (startDate <= booking.startDate && endDate >= booking.endDate)
            )
        );
        
        if (!isBooked) {
          availableProducts.push(product);
        }
      }
      
      return availableProducts;
    } catch (error) {
      console.error('Failed to check available products:', error);
      // Fall back to mock data
      return MOCK_PRODUCTS.filter(product => product.available);
    }
  },
};

export default BitrixService;
