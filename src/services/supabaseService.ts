import { createClient } from '@supabase/supabase-js';
import { isDateRangeAvailable } from '@/utils/dateUtils';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Get all products
 */
export const getProducts = async () => {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting products:', error);
    return [];
  }
};

/**
 * Get a single product by ID
 */
export const getProductById = async (id: string) => {
  try {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) throw error;
    return data || null;
  } catch (error) {
    console.error('Error getting product by ID:', error);
    return null;
  }
};

/**
 * Get all categories
 */
export const getCategories = async () => {
  try {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
};

/**
 * Create a new booking
 */
export const createBooking = async (bookingData: any) => {
  try {
    const { data, error } = await supabase.from('bookings').insert([bookingData]);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating booking:', error);
    return null;
  }
};

/**
 * Update a booking
 */
export const updateBooking = async (id: string, updates: any) => {
  try {
    const { data, error } = await supabase.from('bookings').update(updates).eq('id', id);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating booking:', error);
    return null;
  }
};

/**
 * Delete a booking
 */
export const deleteBooking = async (id: string) => {
  try {
    const { data, error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error deleting booking:', error);
    return null;
  }
};

/**
 * Get all available products for a specific date range
 */
export const getAvailableProducts = async (startDate: Date, endDate: Date) => {
  try {
    const { data: products } = await supabase.from('products').select('*');
    const { data: bookings } = await supabase.from('bookings').select('*');
    
    if (!products || !bookings) return [];
    
    // Map bookings to DateRange objects
    const bookedRanges = bookings.map(booking => ({
      start: new Date(booking.start_date),
      end: new Date(booking.end_date)
    }));
    
    // Filter products that are available during the selected period
    const availableProducts = products.filter(product => {
      if (!product.available) return false;
      
      // Find bookings for this product
      const productBookings = bookings.filter(booking => booking.product_id === product.id);
      
      // Map to DateRange objects
      const productBookedRanges = productBookings.map(booking => ({
        start: new Date(booking.start_date),
        end: new Date(booking.end_date)
      }));
      
      // Check if the product is available during the selected period
      return isDateRangeAvailable(startDate, endDate, productBookedRanges);
    });
    
    return availableProducts;
  } catch (error) {
    console.error('Error getting available products:', error);
    return [];
  }
};

/**
 * Get all bookings
 */
export const getBookings = async () => {
  try {
    const { data, error } = await supabase.from('bookings').select(`
      id,
      product_id,
      customer_name,
      customer_email,
      customer_phone,
      start_date,
      end_date,
      total_price,
      status,
      notes,
      created_at
    `);
    
    if (error) throw error;
    
    // Transform booking data to BookingPeriod objects
    return data.map(booking => ({
      id: booking.id,
      productId: booking.product_id,
      startDate: new Date(booking.start_date),
      endDate: new Date(booking.end_date),
      customerName: booking.customer_name,
      customerEmail: booking.customer_email,
      customerPhone: booking.customer_phone,
      status: booking.status,
      totalPrice: booking.total_price,
      notes: booking.notes,
      createdAt: new Date(booking.created_at)
    }));
  } catch (error) {
    console.error('Error getting bookings:', error);
    return [];
  }
};
