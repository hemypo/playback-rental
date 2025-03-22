
import { Product } from '@/components/ProductCard';

interface BitrixDeal {
  id: string;
  title: string;
  stage: string;
  assignedBy: string;
  createdDate: string;
  updatedDate: string;
  contactId: string;
  products: string[];
  value: number;
}

interface BitrixContact {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
}

interface BitrixBookingPeriod {
  startDate: Date;
  endDate: Date;
  productId: string;
  customerId: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

// Имитируем данные Битрикс24
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Профессиональная DSLR камера',
    description: 'Высококлассная DSLR-камера с разрешением 24.2 мегапикселя, идеально подходит для профессиональной фотографии.',
    price: 89.99,
    category: 'Фотография',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop',
    available: true
  },
  {
    id: '2',
    title: 'Дрон с 4K камерой',
    description: 'Профессиональный дрон с 4K камерой, 30-минутным временем полета и избеганием препятствий.',
    price: 129.99,
    category: 'Фотография',
    imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=2070&auto=format&fit=crop',
    available: true
  },
  {
    id: '3',
    title: 'Профессиональный комплект освещения',
    description: 'Полный комплект освещения для профессионального видеопроизводства с регулируемой яркостью.',
    price: 69.99,
    category: 'Видео',
    imageUrl: 'https://images.unsplash.com/photo-1616530834117-9145a889ed11?q=80&w=1973&auto=format&fit=crop',
    available: true
  },
  {
    id: '4',
    title: 'Беспроводной петличный микрофон',
    description: 'Профессиональная беспроводная система петличных микрофонов для кристально чистой записи звука.',
    price: 49.99,
    category: 'Аудио',
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=2070&auto=format&fit=crop',
    available: false
  },
  {
    id: '5',
    title: 'Портативный зеленый экран',
    description: 'Складной зеленый экран для хромакея в видеопроизводстве, легкий в установке.',
    price: 39.99,
    category: 'Видео',
    imageUrl: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?q=80&w=2070&auto=format&fit=crop',
    available: true
  },
  {
    id: '6',
    title: 'Профессиональный штатив',
    description: 'Прочный штатив для камер и видеооборудования с жидкостной головкой для плавного панорамирования.',
    price: 59.99,
    category: 'Фотография',
    imageUrl: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?q=80&w=2070&auto=format&fit=crop',
    available: true
  },
  {
    id: '7',
    title: 'Аудио микшер',
    description: '8-канальный аудио микшер для профессиональной звукозаписи и живых выступлений.',
    price: 79.99,
    category: 'Аудио',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop',
    available: true
  },
  {
    id: '8',
    title: 'Беспроводные наушники',
    description: 'Профессиональные беспроводные наушники с шумоподавлением для мониторинга аудио.',
    price: 44.99,
    category: 'Аудио',
    imageUrl: 'https://images.unsplash.com/photo-1545127398-14699f92334b?q=80&w=2035&auto=format&fit=crop',
    available: true
  }
];

// Макет данных бронирования
const MOCK_BOOKINGS: BitrixBookingPeriod[] = [
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

// Имитируем категории
const MOCK_CATEGORIES = [
  { id: '1', name: 'Фотография' },
  { id: '2', name: 'Видео' },
  { id: '3', name: 'Аудио' },
  { id: '4', name: 'Освещение' },
  { id: '5', name: 'Аксессуары' },
];

// Имитация задержки API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Базовые параметры для запросов к Битрикс24
const BASE_BITRIX_URL = "https://your-domain.bitrix24.ru/rest/";
// В реальном приложении, этот токен должен храниться в безопасном месте, например, в серверном коде
const WEBHOOK_TOKEN = "your_webhook_token";

class Bitrix24Service {
  // Методы для работы с товарами
  async getProducts(options: { category?: string; search?: string } = {}): Promise<Product[]> {
    // В реальном API это был бы запрос к Битрикс24
    await delay(800);
    
    let filteredProducts = [...MOCK_PRODUCTS];
    
    if (options.category) {
      filteredProducts = filteredProducts.filter(
        product => product.category.toLowerCase() === options.category?.toLowerCase()
      );
    }
    
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
  }
  
  async getProductById(id: string): Promise<Product | null> {
    // В реальном API это был бы запрос к Битрикс24
    await delay(500);
    return MOCK_PRODUCTS.find(product => product.id === id) || null;
  }
  
  // Методы для работы с категориями
  async getCategories(): Promise<{ id: string; name: string }[]> {
    // В реальном API это был бы запрос к Битрикс24
    await delay(300);
    return MOCK_CATEGORIES;
  }
  
  // Методы для работы с бронированиями
  async getProductBookings(productId: string): Promise<BitrixBookingPeriod[]> {
    // В реальном API это был бы запрос к Битрикс24
    await delay(500);
    return MOCK_BOOKINGS.filter(booking => booking.productId === productId);
  }
  
  async createBooking(booking: Omit<BitrixBookingPeriod, 'status'>): Promise<BitrixBookingPeriod> {
    // В реальном API это был бы запрос к Битрикс24
    await delay(1000);
    
    // Создаем новое бронирование
    const newBooking: BitrixBookingPeriod = {
      ...booking,
      status: 'pending',
    };
    
    // В реальном приложении эти данные были бы отправлены в Битрикс24
    console.log('Создание бронирования:', newBooking);
    
    return newBooking;
  }
  
  async getAvailableProducts(startDate: Date, endDate: Date): Promise<Product[]> {
    // В реальном API это был бы запрос к Битрикс24
    await delay(800);
    
    // Проверяем, какие товары доступны в указанном диапазоне дат
    return MOCK_PRODUCTS.filter(product => {
      if (!product.available) return false;
      
      // Проверяем, забронирован ли уже продукт в этот период
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
  
  // Методы для работы с сделками в Битрикс24
  async createDeal(deal: Partial<BitrixDeal>): Promise<BitrixDeal> {
    // В реальной реализации здесь был бы HTTP запрос к API Битрикс24
    await delay(1000);
    
    console.log('Создание сделки в Битрикс24:', deal);
    
    // Имитируем ответ API
    return {
      id: Math.random().toString(36).substr(2, 9),
      title: deal.title || 'Новая сделка',
      stage: deal.stage || 'NEW',
      assignedBy: deal.assignedBy || 'admin',
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      contactId: deal.contactId || '',
      products: deal.products || [],
      value: deal.value || 0,
    };
  }
  
  // Методы для работы с контактами в Битрикс24
  async createContact(contact: Partial<BitrixContact>): Promise<BitrixContact> {
    // В реальной реализации здесь был бы HTTP запрос к API Битрикс24
    await delay(800);
    
    console.log('Создание контакта в Битрикс24:', contact);
    
    // Имитируем ответ API
    return {
      id: Math.random().toString(36).substr(2, 9),
      name: contact.name || '',
      lastName: contact.lastName || '',
      email: contact.email || '',
      phone: contact.phone || '',
    };
  }
}

export default new Bitrix24Service();
