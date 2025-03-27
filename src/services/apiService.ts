
import axios from 'axios';

const API_URL = 'https://api.example.com';

// Auth related functions
export const login = async (username: string, password: string) => {
  try {
    // For demo purposes, we'll just check hardcoded credentials
    if (username === 'admin' && password === 'admin123') {
      // Store auth token in localStorage
      localStorage.setItem('authToken', 'demo-token-12345');
      localStorage.setItem('user', JSON.stringify({ username, role: 'admin' }));
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false };
  }
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  return true;
};

export const checkAuth = () => {
  const token = localStorage.getItem('authToken');
  return !!token;
};

export const getCurrentUser = () => {
  const userJson = localStorage.getItem('user');
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Product related functions
export const getProducts = async () => {
  try {
    // For demo purposes, we'll return data from supabaseService instead
    // In a real app, this would be an axios call to the API
    const response = await import('@/services/supabaseService').then(module => module.getProducts());
    return response;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getProductById = async (id: string) => {
  try {
    // For demo purposes, we'll return data from supabaseService instead
    const response = await import('@/services/supabaseService').then(module => module.getProductById(id));
    return response;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
};

export const createProduct = async (productData: any) => {
  try {
    const response = await axios.post(`${API_URL}/products`, productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
};

export const updateProduct = async (id: string, productData: any) => {
  try {
    const response = await axios.put(`${API_URL}/products/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    return null;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    await axios.delete(`${API_URL}/products/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    return false;
  }
};

// Category related functions
export const getCategories = async () => {
  try {
    // For demo purposes, we'll return data from supabaseService instead
    const response = await import('@/services/supabaseService').then(module => module.getCategories());
    return response;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Booking related functions
export const getBookings = async () => {
  try {
    // For demo purposes, we'll use mock data
    return [
      {
        id: '1',
        productId: '1',
        customerName: 'Иван Петров',
        customerPhone: '+7 (999) 123-4567',
        customerEmail: 'ivan@example.com',
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        totalPrice: 5400,
        status: 'confirmed',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        productId: '2',
        customerName: 'Мария Сидорова',
        customerPhone: '+7 (999) 765-4321',
        customerEmail: 'maria@example.com',
        startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        totalPrice: 3600,
        status: 'pending',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        productId: '3',
        customerName: 'Алексей Иванов',
        customerPhone: '+7 (999) 555-1234',
        customerEmail: 'alexey@example.com',
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        totalPrice: 2800,
        status: 'completed',
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      },
      {
        id: '4',
        productId: '4',
        customerName: 'Елена Смирнова',
        customerPhone: '+7 (999) 777-9999',
        customerEmail: 'elena@example.com',
        startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        totalPrice: 12500,
        status: 'confirmed',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: '5',
        productId: '1',
        customerName: 'Дмитрий Козлов',
        customerPhone: '+7 (999) 888-7777',
        customerEmail: 'dmitry@example.com',
        startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        totalPrice: 4200,
        status: 'cancelled',
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
      }
    ];
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
};

export const getProductBookings = async (productId: string) => {
  try {
    const allBookings = await getBookings();
    return allBookings.filter((booking: any) => booking.productId === productId);
  } catch (error) {
    console.error(`Error fetching bookings for product ${productId}:`, error);
    return [];
  }
};

export const createBooking = async (bookingData: any) => {
  try {
    // In a real app, we would make an API call here
    console.log('Booking data submitted:', bookingData);
    return {
      id: Math.random().toString(36).substring(2, 9),
      ...bookingData,
      status: 'pending',
      createdAt: new Date()
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    return null;
  }
};
