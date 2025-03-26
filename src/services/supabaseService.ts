import { supabase } from "@/integrations/supabase/client";
import { Product, BookingPeriod, Category, BookingFormData } from "@/types/product";

// Products
export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*');
  
  if (error) throw error;
  
  return (data || []).map(product => ({
    id: product.id,
    title: product.title,
    description: product.description,
    price: Number(product.price),
    category: product.category,
    imageUrl: product.imageurl,
    available: product.available,
    quantity: product.quantity
  }));
};

export const getProductById = async (id: string): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    price: Number(data.price),
    category: data.category,
    imageUrl: data.imageurl,
    available: data.available,
    quantity: data.quantity
  };
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .insert([{
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      imageurl: product.imageUrl,
      available: product.available,
      quantity: product.quantity
    }])
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    price: Number(data.price),
    category: data.category,
    imageUrl: data.imageurl,
    available: data.available,
    quantity: data.quantity
  };
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
  const updateData: any = {};
  
  if (product.title !== undefined) updateData.title = product.title;
  if (product.description !== undefined) updateData.description = product.description;
  if (product.price !== undefined) updateData.price = product.price;
  if (product.category !== undefined) updateData.category = product.category;
  if (product.imageUrl !== undefined) updateData.imageurl = product.imageUrl;
  if (product.available !== undefined) updateData.available = product.available;
  if (product.quantity !== undefined) updateData.quantity = product.quantity;
  
  const { data, error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    price: Number(data.price),
    category: data.category,
    imageUrl: data.imageurl,
    available: data.available,
    quantity: data.quantity
  };
};

export const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Categories
export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*');
  
  if (error) throw error;
  
  return (data || []).map(category => ({
    id: category.id,
    name: category.name,
    slug: category.slug || ''
  }));
};

export const addCategory = async (categoryName: string): Promise<Category> => {
  // Check if category exists
  const { data: existingCategory } = await supabase
    .from('categories')
    .select('*')
    .ilike('name', categoryName)
    .single();
  
  if (existingCategory) {
    return {
      id: existingCategory.id,
      name: existingCategory.name,
      slug: existingCategory.slug || ''
    };
  }
  
  // Create new category
  const slug = categoryName.toLowerCase().replace(/\s+/g, '-');
  
  const { data, error } = await supabase
    .from('categories')
    .insert([{
      name: categoryName,
      slug: slug
    }])
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    name: data.name,
    slug: data.slug || ''
  };
};

// Bookings
const mapBookingData = (data: any): BookingPeriod => {
  return {
    id: data.id,
    productId: data.productId || '',
    startDate: new Date(data.start_date),
    endDate: new Date(data.end_date),
    customerName: data.customer_name,
    customerEmail: data.customer_email,
    customerPhone: data.customer_phone,
    status: data.status as BookingPeriod['status'],
    totalPrice: data.total_price,
    notes: data.notes || '',
    createdAt: new Date(data.created_at || Date.now())
  };
};

export const getBookings = async (): Promise<BookingPeriod[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching bookings:', error);
    throw new Error(error.message);
  }

  return (data || []).map(mapBookingData);
};

export const getProductBookings = async (productId: string): Promise<BookingPeriod[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('productId', productId)
    .order('start_date', { ascending: true });
    
  if (error) {
    console.error('Error fetching product bookings:', error);
    throw new Error(error.message);
  }

  return (data || []).map(mapBookingData);
};

export const createBooking = async (bookingData: BookingFormData): Promise<BookingPeriod> => {
  // Convert the booking data to the format expected by Supabase
  const supabaseBookingData = {
    productId: bookingData.productId,
    start_date: bookingData.startDate.toISOString(),
    end_date: bookingData.endDate.toISOString(),
    customer_name: bookingData.name,
    customer_email: bookingData.email,
    customer_phone: bookingData.phone,
    notes: bookingData.notes || '',
    status: 'pending' as const,
    total_price: 0 // Will calculate this based on the product price
  };
  
  // Get the product to calculate the price
  const product = await getProductById(bookingData.productId);
  if (!product) {
    throw new Error('Product not found');
  }
  
  // Calculate total price based on number of days
  const days = Math.ceil(
    (bookingData.endDate.getTime() - bookingData.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  supabaseBookingData.total_price = product.price * days;
  
  // Insert the booking
  const { data, error } = await supabase
    .from('bookings')
    .insert(supabaseBookingData)
    .select()
    .single();
    
  if (error) {
    console.error('Error creating booking:', error);
    throw new Error(error.message);
  }
  
  return mapBookingData(data);
};

export const updateBookingStatus = async (id: string, status: BookingPeriod['status']): Promise<BookingPeriod> => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating booking status:', error);
    throw new Error(error.message);
  }
  
  return mapBookingData(data);
};

// Add this new function for available products by date range
export const getAvailableProducts = async (startDate: Date, endDate: Date): Promise<Product[]> => {
  // First, get all products
  const products = await getProducts();
  
  // Then, get all bookings that overlap with the requested period
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .or(`start_date.lte.${endDate.toISOString()},end_date.gte.${startDate.toISOString()}`);
  
  if (error) {
    console.error('Error fetching overlapping bookings:', error);
    throw new Error(error.message);
  }
  
  // Extract product IDs that are unavailable during this period
  const unavailableProductIds = new Set(
    bookings?.map(booking => booking.productId) || []
  );
  
  // Filter out unavailable products
  return products.filter(product => 
    product.available && !unavailableProductIds.has(product.id)
  );
};

// File exports/imports
export const exportProductsToCSV = async (): Promise<string> => {
  const { data: products, error } = await supabase
    .from('products')
    .select('*');
  
  if (error) throw error;
  
  const headers = ['ID', 'Category', 'Title', 'Description', 'Photo', 'Price', 'Quantity'];
  
  let csvContent = headers.join(',') + '\n';
  
  products.forEach((product) => {
    const row = [
      product.id,
      product.category,
      `"${product.title.replace(/"/g, '""')}"`, // Escape quotes
      `"${product.description.replace(/"/g, '""')}"`,
      product.imageurl,
      product.price,
      product.quantity
    ];
    csvContent += row.join(',') + '\n';
  });
  
  return csvContent;
};

export const importProductsFromCSV = async (csvContent: string): Promise<Product[]> => {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',');
  
  // Get existing products IDs to avoid duplicates
  const { data: existingProducts } = await supabase
    .from('products')
    .select('id');
  
  const existingIDs = new Set(existingProducts?.map(p => p.id) || []);
  const newProducts: any[] = [];
  
  // Parse CSV and prepare product objects
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = parseCSVLine(lines[i]);
    
    if (values.length !== headers.length) continue;
    
    const [id, category, title, description, imageUrl, price, quantity] = values;
    
    // Skip if product with this ID already exists
    if (existingIDs.has(id)) continue;
    
    // Add category if it doesn't exist
    await addCategory(category);
    
    newProducts.push({
      title,
      description,
      price: parseFloat(price),
      category,
      imageurl: imageUrl,
      available: true,
      quantity: parseInt(quantity, 10)
    });
  }
  
  // Insert new products
  if (newProducts.length > 0) {
    const { data, error } = await supabase
      .from('products')
      .insert(newProducts)
      .select();
    
    if (error) throw error;
    
    return data.map(product => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: Number(product.price),
      category: product.category,
      imageUrl: product.imageurl,
      available: product.available,
      quantity: product.quantity
    }));
  }
  
  return [];
};

// Helper function to parse CSV line (handles quoted fields with commas)
function parseCSVLine(line: string): string[] {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        // Double quotes inside quotes - add a single quote
        current += '"';
        i++;
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add the last field
  result.push(current);
  
  return result;
}

// Auth functions (placeholders for now, will need to be updated for proper Supabase Auth)
export const login = async (username: string, password: string): Promise<{ success: boolean; token?: string }> => {
  // Simple admin authentication (in a real app, this would use Supabase Auth)
  if (username === 'admin' && password === 'admin123') {
    const token = `token-${Date.now()}`;
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify({ username, role: 'admin' }));
    return { success: true, token };
  } else {
    return { success: false };
  }
};

export const logout = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
};

export const checkAuth = (): boolean => {
  return !!localStorage.getItem('auth_token');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};
