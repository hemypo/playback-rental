
// This is a wrapper around our Supabase service to maintain backward compatibility
import * as supabaseService from './supabaseService';
import { Product, BookingPeriod, Category, BookingFormData } from "@/types/product";

type ProductFilterParams = {
  category?: string;
  search?: string;
};

// Get all products
export const getProducts = async (params?: ProductFilterParams): Promise<Product[]> => {
  return supabaseService.getProducts();
};

// Get a single product by ID
export const getProductById = async (id: string): Promise<Product> => {
  return supabaseService.getProductById(id);
};

// Create a new product
export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  return supabaseService.createProduct(product);
};

// Update a product
export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
  return supabaseService.updateProduct(id, product);
};

// Delete a product
export const deleteProduct = async (id: string): Promise<void> => {
  return supabaseService.deleteProduct(id);
};

// Categories
export const getCategories = async (): Promise<Category[]> => {
  return supabaseService.getCategories();
};

export const addCategory = async (categoryName: string): Promise<Category> => {
  return supabaseService.addCategory(categoryName);
};

// Bookings
export const getBookings = async (): Promise<BookingPeriod[]> => {
  return supabaseService.getBookings();
};

export const getProductBookings = async (productId: string): Promise<BookingPeriod[]> => {
  return supabaseService.getProductBookings(productId);
};

export const createBooking = async (booking: BookingFormData): Promise<BookingPeriod> => {
  return supabaseService.createBooking(booking);
};

export const updateBookingStatus = async (id: string, status: BookingPeriod['status']): Promise<BookingPeriod> => {
  return supabaseService.updateBookingStatus(id, status);
};

// File exports/imports
export const exportProductsToCSV = async (): Promise<string> => {
  return supabaseService.exportProductsToCSV();
};

export const importProductsFromCSV = async (csvContent: string): Promise<Product[]> => {
  return supabaseService.importProductsFromCSV(csvContent);
};

// Auth
export const login = async (username: string, password: string): Promise<{ success: boolean; token?: string }> => {
  return supabaseService.login(username, password);
};

export const logout = (): void => {
  supabaseService.logout();
};

export const checkAuth = (): boolean => {
  return supabaseService.checkAuth();
};

export const getCurrentUser = () => {
  return supabaseService.getCurrentUser();
};
