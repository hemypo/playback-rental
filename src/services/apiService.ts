
import { Product, BookingPeriod, Category, BookingFormData } from "@/types/product";

// Mocking localStorage as our temporary database
const PRODUCTS_KEY = 'rental_products';
const BOOKINGS_KEY = 'rental_bookings';
const CATEGORIES_KEY = 'rental_categories';

// Initialize with some sample data if not already present
const initializeData = () => {
  // Sample products
  if (!localStorage.getItem(PRODUCTS_KEY)) {
    const sampleProducts: Product[] = [
      {
        id: '1',
        uid: 'cam-001',
        title: 'Sony Alpha A7 III',
        description: 'Полнокадровая беззеркальная камера с разрешением 24.2 МП',
        price: 4500,
        category: 'Фотокамеры',
        imageUrl: 'https://images.unsplash.com/photo-1516724562728-afc824a36e84',
        available: true,
        quantity: 3
      },
      {
        id: '2',
        uid: 'lens-001',
        title: 'Canon EF 70-200mm f/2.8L IS III USM',
        description: 'Телеобъектив с постоянной диафрагмой для профессиональных фотографов',
        price: 2800,
        category: 'Объективы',
        imageUrl: 'https://images.unsplash.com/photo-1499085650423-45149d8166a6',
        available: true,
        quantity: 2
      },
      {
        id: '3',
        uid: 'light-001',
        title: 'Godox SL-60W LED',
        description: 'Постоянный LED свет мощностью 60Вт с управлением через пульт',
        price: 1200,
        category: 'Освещение',
        imageUrl: 'https://images.unsplash.com/photo-1534003276576-0cbfc449fb6f',
        available: true,
        quantity: 5
      },
      {
        id: '4',
        uid: 'audio-001',
        title: 'Rode VideoMic Pro+',
        description: 'Направленный микрофон для камер и DSLR с улучшенным качеством звука',
        price: 950,
        category: 'Аудио',
        imageUrl: 'https://images.unsplash.com/photo-1520170350707-b2da59970118',
        available: false,
        quantity: 4
      },
      {
        id: '5',
        uid: 'stab-001',
        title: 'DJI Ronin-S',
        description: 'Трехосевой стабилизатор для DSLR и беззеркальных камер',
        price: 2100,
        category: 'Стабилизаторы',
        imageUrl: 'https://images.unsplash.com/photo-1542192143-6cb2c972e497',
        available: true,
        quantity: 2
      },
      {
        id: '6',
        uid: 'cam-002',
        title: 'Blackmagic Pocket Cinema Camera 6K',
        description: 'Кинокамера с разрешением 6K и записью в Blackmagic RAW',
        price: 5200,
        category: 'Видеокамеры',
        imageUrl: 'https://images.unsplash.com/photo-1585939268110-1fa0f2a708b5',
        available: true,
        quantity: 1
      },
      {
        id: '7',
        uid: 'drone-001',
        title: 'DJI Mavic 3',
        description: 'Профессиональный дрон с камерой Hasselblad и увеличенным временем полета',
        price: 6500,
        category: 'Дроны',
        imageUrl: 'https://images.unsplash.com/photo-1508444845599-5c89863b1c44',
        available: true,
        quantity: 2
      },
      {
        id: '8',
        uid: 'audio-002',
        title: 'Zoom H6',
        description: 'Портативный аудиорекордер с 6 входами и сменными микрофонными капсюлями',
        price: 1800,
        category: 'Аудио',
        imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04',
        available: true,
        quantity: 3
      }
    ];
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(sampleProducts));
  }

  // Sample categories
  if (!localStorage.getItem(CATEGORIES_KEY)) {
    const sampleCategories: Category[] = [
      { id: '1', name: 'Фотокамеры', slug: 'photo-cameras' },
      { id: '2', name: 'Видеокамеры', slug: 'video-cameras' },
      { id: '3', name: 'Объективы', slug: 'lenses' },
      { id: '4', name: 'Освещение', slug: 'lighting' },
      { id: '5', name: 'Аудио', slug: 'audio' },
      { id: '6', name: 'Стабилизаторы', slug: 'stabilizers' },
      { id: '7', name: 'Дроны', slug: 'drones' },
      { id: '8', name: 'Аксессуары', slug: 'accessories' }
    ];
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(sampleCategories));
  }

  // Sample bookings
  if (!localStorage.getItem(BOOKINGS_KEY)) {
    const currentDate = new Date();
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const twoWeeksLater = new Date(currentDate);
    twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
    
    const threeWeeksLater = new Date(currentDate);
    threeWeeksLater.setDate(threeWeeksLater.getDate() + 21);

    const sampleBookings: BookingPeriod[] = [
      {
        id: '1',
        productId: '1',
        startDate: new Date(currentDate),
        endDate: new Date(nextWeek),
        customerName: 'Иван Петров',
        customerEmail: 'ivan@example.com',
        customerPhone: '+7 (999) 123-4567',
        status: 'confirmed',
        totalPrice: 4500 * 7,
        createdAt: new Date()
      },
      {
        id: '2',
        productId: '3',
        startDate: new Date(nextWeek),
        endDate: new Date(twoWeeksLater),
        customerName: 'Анна Сидорова',
        customerEmail: 'anna@example.com',
        customerPhone: '+7 (999) 765-4321',
        status: 'pending',
        totalPrice: 1200 * 7,
        notes: 'Нужен дополнительный аккумулятор',
        createdAt: new Date()
      },
      {
        id: '3',
        productId: '7',
        startDate: new Date(twoWeeksLater),
        endDate: new Date(threeWeeksLater),
        customerName: 'Алексей Иванов',
        customerEmail: 'alex@example.com',
        customerPhone: '+7 (999) 111-2222',
        status: 'confirmed',
        totalPrice: 6500 * 7,
        createdAt: new Date()
      }
    ];
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(sampleBookings));
  }
};

// Initialize data at module load
initializeData();

// API functions

// Products
export const getProducts = async (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
      resolve(products);
    }, 300);
  });
};

export const getProductById = async (id: string): Promise<Product> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
      const product = products.find((p: Product) => p.id === id);
      if (product) {
        resolve(product);
      } else {
        reject(new Error('Product not found'));
      }
    }, 300);
  });
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
      const newProduct = {
        ...product,
        id: Date.now().toString()
      };
      products.push(newProduct);
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
      resolve(newProduct);
    }, 300);
  });
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
      const index = products.findIndex((p: Product) => p.id === id);
      if (index !== -1) {
        products[index] = { ...products[index], ...product };
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
        resolve(products[index]);
      } else {
        reject(new Error('Product not found'));
      }
    }, 300);
  });
};

export const deleteProduct = async (id: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
      const filtered = products.filter((p: Product) => p.id !== id);
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filtered));
      resolve();
    }, 300);
  });
};

// Categories
export const getCategories = async (): Promise<Category[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const categories = JSON.parse(localStorage.getItem(CATEGORIES_KEY) || '[]');
      resolve(categories);
    }, 300);
  });
};

// Bookings
export const getBookings = async (): Promise<BookingPeriod[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const bookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
      // Parse dates properly
      const bookingsWithDates = bookings.map((booking: any) => ({
        ...booking,
        startDate: new Date(booking.startDate),
        endDate: new Date(booking.endDate),
        createdAt: new Date(booking.createdAt)
      }));
      resolve(bookingsWithDates);
    }, 300);
  });
};

export const getProductBookings = async (productId: string): Promise<BookingPeriod[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const bookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
      const filtered = bookings
        .filter((b: BookingPeriod) => b.productId === productId)
        .map((booking: any) => ({
          ...booking,
          startDate: new Date(booking.startDate),
          endDate: new Date(booking.endDate),
          createdAt: new Date(booking.createdAt)
        }));
      resolve(filtered);
    }, 300);
  });
};

export const createBooking = async (booking: BookingFormData): Promise<BookingPeriod> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const bookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
      const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
      
      // Calculate price
      const product = products.find((p: Product) => p.id === booking.productId);
      const days = Math.ceil((booking.endDate.getTime() - booking.startDate.getTime()) / (1000 * 60 * 60 * 24));
      const totalPrice = product ? product.price * days : 0;
      
      const newBooking = {
        id: Date.now().toString(),
        productId: booking.productId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        customerName: booking.name,
        customerEmail: booking.email,
        customerPhone: booking.phone,
        status: 'pending',
        totalPrice,
        notes: booking.notes || '',
        createdAt: new Date()
      };
      
      bookings.push(newBooking);
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
      resolve(newBooking as BookingPeriod);
    }, 300);
  });
};

export const updateBookingStatus = async (id: string, status: BookingPeriod['status']): Promise<BookingPeriod> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const bookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
      const index = bookings.findIndex((b: BookingPeriod) => b.id === id);
      if (index !== -1) {
        bookings[index].status = status;
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
        resolve(bookings[index]);
      } else {
        reject(new Error('Booking not found'));
      }
    }, 300);
  });
};

// File exports
export const exportProductsToCSV = (): string => {
  const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
  const headers = ['UID', 'Category', 'Title', 'Description', 'Photo', 'Price', 'Quantity'];
  
  let csvContent = headers.join(',') + '\n';
  
  products.forEach((product: Product) => {
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
  return new Promise((resolve) => {
    setTimeout(() => {
      const lines = csvContent.split('\n');
      const headers = lines[0].split(',');
      
      const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
      const existingProductIds = new Set(products.map((p: Product) => p.uid));
      
      const newProducts: Product[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = parseCSVLine(lines[i]);
        
        if (values.length !== headers.length) continue;
        
        const [uid, category, title, description, imageUrl, price, quantity] = values;
        
        // Skip if product with this UID already exists
        if (existingProductIds.has(uid)) continue;
        
        const newProduct: Product = {
          id: Date.now().toString() + i, // Generate unique ID
          uid,
          title,
          description,
          price: parseFloat(price),
          category,
          imageUrl,
          available: true,
          quantity: parseInt(quantity, 10)
        };
        
        newProducts.push(newProduct);
        existingProductIds.add(uid);
      }
      
      // Add new products to storage
      const updatedProducts = [...products, ...newProducts];
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));
      
      resolve(newProducts);
    }, 500);
  });
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

// Auth functions
export const login = async (username: string, password: string): Promise<{ success: boolean; token?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple admin authentication (in a real app, this would be a server call)
      if (username === 'admin' && password === 'admin123') {
        const token = `token-${Date.now()}`;
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify({ username, role: 'admin' }));
        resolve({ success: true, token });
      } else {
        resolve({ success: false });
      }
    }, 500);
  });
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
