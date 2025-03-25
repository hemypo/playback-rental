
// This is a wrapper around our Supabase service to maintain backward compatibility
import * as supabaseService from './supabaseService';
import { Product, BookingPeriod, Category, BookingFormData, ProductFilterParams } from "@/types/product";

// Get all products
export const getProducts = async (params?: ProductFilterParams): Promise<Product[]> => {
  try {
    return await supabaseService.getProducts();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Get a single product by ID
export const getProductById = async (id: string): Promise<Product> => {
  try {
    return await supabaseService.getProductById(id);
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

// Create a new product
export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  try {
    return await supabaseService.createProduct(product);
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Update a product
export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
  try {
    return await supabaseService.updateProduct(id, product);
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    return await supabaseService.deleteProduct(id);
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    throw error;
  }
};

// Categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    return await supabaseService.getCategories();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const addCategory = async (categoryName: string): Promise<Category> => {
  try {
    return await supabaseService.addCategory(categoryName);
  } catch (error) {
    console.error(`Error adding category ${categoryName}:`, error);
    throw error;
  }
};

// Bookings
export const getBookings = async (): Promise<BookingPeriod[]> => {
  try {
    return await supabaseService.getBookings();
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

export const getProductBookings = async (productId: string): Promise<BookingPeriod[]> => {
  try {
    return await supabaseService.getProductBookings(productId);
  } catch (error) {
    console.error(`Error fetching bookings for product ${productId}:`, error);
    throw error;
  }
};

export const createBooking = async (booking: BookingFormData): Promise<BookingPeriod> => {
  try {
    return await supabaseService.createBooking(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const updateBookingStatus = async (id: string, status: BookingPeriod['status']): Promise<BookingPeriod> => {
  try {
    return await supabaseService.updateBookingStatus(id, status);
  } catch (error) {
    console.error(`Error updating booking status for ID ${id}:`, error);
    throw error;
  }
};

// File exports/imports
export const exportProductsToCSV = async (): Promise<string> => {
  try {
    return await supabaseService.exportProductsToCSV();
  } catch (error) {
    console.error('Error exporting products to CSV:', error);
    throw error;
  }
};

export const importProductsFromCSV = async (csvContent: string): Promise<Product[]> => {
  try {
    return await supabaseService.importProductsFromCSV(csvContent);
  } catch (error) {
    console.error('Error importing products from CSV:', error);
    throw error;
  }
};

// Auth
export const login = async (username: string, password: string): Promise<{ success: boolean; token?: string }> => {
  try {
    return await supabaseService.login(username, password);
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const logout = (): void => {
  try {
    supabaseService.logout();
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};

export const checkAuth = (): boolean => {
  try {
    return supabaseService.checkAuth();
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

export const getCurrentUser = () => {
  try {
    return supabaseService.getCurrentUser();
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};
