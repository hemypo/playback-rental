
import { supabase } from "@/integrations/supabase/client";
import { Product, BookingPeriod, Category, BookingFormData } from "@/types/product";

// Products
export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*');
  
  if (error) throw error;
  
  return data.map(product => ({
    ...product,
    id: product.id,
    uid: product.uid,
    title: product.title,
    description: product.description,
    price: Number(product.price),
    category: product.category,
    imageUrl: product.imageUrl,
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
    ...data,
    id: data.id,
    uid: data.uid,
    title: data.title,
    description: data.description,
    price: Number(data.price),
    category: data.category,
    imageUrl: data.imageUrl,
    available: data.available,
    quantity: data.quantity
  };
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .insert([{
      uid: product.uid,
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      available: product.available,
      quantity: product.quantity
    }])
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    ...data,
    id: data.id,
    uid: data.uid,
    title: data.title,
    description: data.description,
    price: Number(data.price),
    category: data.category,
    imageUrl: data.imageUrl,
    available: data.available,
    quantity: data.quantity
  };
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .update({
      uid: product.uid,
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      available: product.available,
      quantity: product.quantity
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    ...data,
    id: data.id,
    uid: data.uid,
    title: data.title,
    description: data.description,
    price: Number(data.price),
    category: data.category,
    imageUrl: data.imageUrl,
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
  
  return data.map(category => ({
    id: category.id,
    name: category.name,
    slug: category.slug
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
      slug: existingCategory.slug
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
    slug: data.slug
  };
};

// Bookings
export const getBookings = async (): Promise<BookingPeriod[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*');
  
  if (error) throw error;
  
  return data.map(booking => ({
    id: booking.id,
    productId: booking.product_id,
    startDate: new Date(booking.start_date),
    endDate: new Date(booking.end_date),
    customerName: booking.customer_name,
    customerEmail: booking.customer_email,
    customerPhone: booking.customer_phone,
    status: booking.status as 'pending' | 'confirmed' | 'cancelled' | 'completed',
    totalPrice: Number(booking.total_price),
    notes: booking.notes || '',
    createdAt: new Date(booking.created_at)
  }));
};

export const getProductBookings = async (productId: string): Promise<BookingPeriod[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('product_id', productId);
  
  if (error) throw error;
  
  return data.map(booking => ({
    id: booking.id,
    productId: booking.product_id,
    startDate: new Date(booking.start_date),
    endDate: new Date(booking.end_date),
    customerName: booking.customer_name,
    customerEmail: booking.customer_email,
    customerPhone: booking.customer_phone,
    status: booking.status as 'pending' | 'confirmed' | 'cancelled' | 'completed',
    totalPrice: Number(booking.total_price),
    notes: booking.notes || '',
    createdAt: new Date(booking.created_at)
  }));
};

export const createBooking = async (booking: BookingFormData): Promise<BookingPeriod> => {
  // Get product to calculate price
  const { data: product } = await supabase
    .from('products')
    .select('price')
    .eq('id', booking.productId)
    .single();
  
  if (!product) throw new Error('Product not found');
  
  // Calculate days between start and end date
  const days = Math.ceil((booking.endDate.getTime() - booking.startDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalPrice = Number(product.price) * days;
  
  const { data, error } = await supabase
    .from('bookings')
    .insert([{
      product_id: booking.productId,
      start_date: booking.startDate.toISOString(),
      end_date: booking.endDate.toISOString(),
      customer_name: booking.name,
      customer_email: booking.email,
      customer_phone: booking.phone,
      status: 'pending',
      total_price: totalPrice,
      notes: booking.notes || null
    }])
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    productId: data.product_id,
    startDate: new Date(data.start_date),
    endDate: new Date(data.end_date),
    customerName: data.customer_name,
    customerEmail: data.customer_email,
    customerPhone: data.customer_phone,
    status: data.status as 'pending' | 'confirmed' | 'cancelled' | 'completed',
    totalPrice: Number(data.total_price),
    notes: data.notes || '',
    createdAt: new Date(data.created_at)
  };
};

export const updateBookingStatus = async (id: string, status: BookingPeriod['status']): Promise<BookingPeriod> => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    productId: data.product_id,
    startDate: new Date(data.start_date),
    endDate: new Date(data.end_date),
    customerName: data.customer_name,
    customerEmail: data.customer_email,
    customerPhone: data.customer_phone,
    status: data.status as 'pending' | 'confirmed' | 'cancelled' | 'completed',
    totalPrice: Number(data.total_price),
    notes: data.notes || '',
    createdAt: new Date(data.created_at)
  };
};

// File exports/imports
export const exportProductsToCSV = async (): Promise<string> => {
  const { data: products, error } = await supabase
    .from('products')
    .select('*');
  
  if (error) throw error;
  
  const headers = ['UID', 'Category', 'Title', 'Description', 'Photo', 'Price', 'Quantity'];
  
  let csvContent = headers.join(',') + '\n';
  
  products.forEach((product) => {
    const row = [
      product.uid,
      product.category,
      `"${product.title.replace(/"/g, '""')}"`, // Escape quotes
      `"${product.description.replace(/"/g, '""')}"`,
      product.imageUrl,
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
  
  // Get existing products UIDs to avoid duplicates
  const { data: existingProducts } = await supabase
    .from('products')
    .select('uid');
  
  const existingUIDs = new Set(existingProducts?.map(p => p.uid) || []);
  const newProducts: any[] = [];
  
  // Parse CSV and prepare product objects
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = parseCSVLine(lines[i]);
    
    if (values.length !== headers.length) continue;
    
    const [uid, category, title, description, imageUrl, price, quantity] = values;
    
    // Skip if product with this UID already exists
    if (existingUIDs.has(uid)) continue;
    
    // Add category if it doesn't exist
    await addCategory(category);
    
    newProducts.push({
      uid,
      title,
      description,
      price: parseFloat(price),
      category,
      imageUrl,
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
      uid: product.uid,
      title: product.title,
      description: product.description,
      price: Number(product.price),
      category: product.category,
      imageUrl: product.imageUrl,
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
