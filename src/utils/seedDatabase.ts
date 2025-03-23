
import { supabase } from "@/integrations/supabase/client";

// Sample data for initial DB population
const sampleProducts = [
  {
    uid: '1',
    title: 'Sony Alpha A7 III',
    description: 'Полнокадровая беззеркальная камера с разрешением 24.2 МП',
    price: 4500,
    category: 'Фотокамеры',
    imageUrl: 'https://images.unsplash.com/photo-1516724562728-afc824a36e84',
    available: true,
    quantity: 3
  },
  {
    uid: '2',
    title: 'Canon EF 70-200mm f/2.8L IS III USM',
    description: 'Телеобъектив с постоянной диафрагмой для профессиональных фотографов',
    price: 2800,
    category: 'Объективы',
    imageUrl: 'https://images.unsplash.com/photo-1499085650423-45149d8166a6',
    available: true,
    quantity: 2
  },
  {
    uid: '3',
    title: 'Godox SL-60W LED',
    description: 'Постоянный LED свет мощностью 60Вт с управлением через пульт',
    price: 1200,
    category: 'Освещение',
    imageUrl: 'https://images.unsplash.com/photo-1534003276576-0cbfc449fb6f',
    available: true,
    quantity: 5
  },
  {
    uid: '4',
    title: 'Rode VideoMic Pro+',
    description: 'Направленный микрофон для камер и DSLR с улучшенным качеством звука',
    price: 950,
    category: 'Аудио',
    imageUrl: 'https://images.unsplash.com/photo-1520170350707-b2da59970118',
    available: false,
    quantity: 4
  },
  {
    uid: '5',
    title: 'DJI Ronin-S',
    description: 'Трехосевой стабилизатор для DSLR и беззеркальных камер',
    price: 2100,
    category: 'Стабилизаторы',
    imageUrl: 'https://images.unsplash.com/photo-1542192143-6cb2c972e497',
    available: true,
    quantity: 2
  },
  {
    uid: '6',
    title: 'Blackmagic Pocket Cinema Camera 6K',
    description: 'Кинокамера с разрешением 6K и записью в Blackmagic RAW',
    price: 5200,
    category: 'Видеокамеры',
    imageUrl: 'https://images.unsplash.com/photo-1585939268110-1fa0f2a708b5',
    available: true,
    quantity: 1
  },
  {
    uid: '7',
    title: 'DJI Mavic 3',
    description: 'Профессиональный дрон с камерой Hasselblad и увеличенным временем полета',
    price: 6500,
    category: 'Дроны',
    imageUrl: 'https://images.unsplash.com/photo-1508444845599-5c89863b1c44',
    available: true,
    quantity: 2
  },
  {
    uid: '8',
    title: 'Zoom H6',
    description: 'Портативный аудиорекордер с 6 входами и сменными микрофонными капсюлями',
    price: 1800,
    category: 'Аудио',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04',
    available: true,
    quantity: 3
  }
];

const sampleCategories = [
  { name: 'Фотокамеры', slug: 'photo-cameras' },
  { name: 'Видеокамеры', slug: 'video-cameras' },
  { name: 'Объективы', slug: 'lenses' },
  { name: 'Освещение', slug: 'lighting' },
  { name: 'Аудио', slug: 'audio' },
  { name: 'Стабилизаторы', slug: 'stabilizers' },
  { name: 'Дроны', slug: 'drones' },
  { name: 'Аксессуары', slug: 'accessories' }
];

// Sample bookings
const currentDate = new Date();
const nextWeek = new Date(currentDate);
nextWeek.setDate(nextWeek.getDate() + 7);

const twoWeeksLater = new Date(currentDate);
twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);

const threeWeeksLater = new Date(currentDate);
threeWeeksLater.setDate(threeWeeksLater.getDate() + 21);

export const seedDatabase = async () => {
  try {
    // Check if database is already seeded
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    if (count && count > 0) {
      console.log('Database already seeded, skipping...');
      return;
    }
    
    console.log('Seeding database...');
    
    // Insert categories
    const { error: categoriesError } = await supabase
      .from('categories')
      .insert(sampleCategories);
    
    if (categoriesError) {
      console.error('Error seeding categories:', categoriesError);
      return;
    }
    
    // Insert products
    const { error: productsError } = await supabase
      .from('products')
      .insert(sampleProducts);
    
    if (productsError) {
      console.error('Error seeding products:', productsError);
      return;
    }
    
    // Get product IDs
    const { data: products } = await supabase
      .from('products')
      .select('id, uid');
    
    if (!products || products.length === 0) {
      console.error('No products found after seeding');
      return;
    }
    
    // Map old product IDs to new UUIDs
    const productIdMap = Object.fromEntries(
      products.map(product => [product.uid, product.id])
    );
    
    // Create sample bookings
    const sampleBookings = [
      {
        product_id: productIdMap['1'],
        start_date: currentDate.toISOString(),
        end_date: nextWeek.toISOString(),
        customer_name: 'Иван Петров',
        customer_email: 'ivan@example.com',
        customer_phone: '+7 (999) 123-4567',
        status: 'confirmed',
        total_price: 4500 * 7,
        notes: null
      },
      {
        product_id: productIdMap['3'],
        start_date: nextWeek.toISOString(),
        end_date: twoWeeksLater.toISOString(),
        customer_name: 'Анна Сидорова',
        customer_email: 'anna@example.com',
        customer_phone: '+7 (999) 765-4321',
        status: 'pending',
        total_price: 1200 * 7,
        notes: 'Нужен дополнительный аккумулятор'
      },
      {
        product_id: productIdMap['7'],
        start_date: twoWeeksLater.toISOString(),
        end_date: threeWeeksLater.toISOString(),
        customer_name: 'Алексей Иванов',
        customer_email: 'alex@example.com',
        customer_phone: '+7 (999) 111-2222',
        status: 'confirmed',
        total_price: 6500 * 7,
        notes: null
      }
    ];
    
    // Insert bookings
    const { error: bookingsError } = await supabase
      .from('bookings')
      .insert(sampleBookings);
    
    if (bookingsError) {
      console.error('Error seeding bookings:', bookingsError);
      return;
    }
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
