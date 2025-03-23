
export interface Product {
  id: string;
  uid: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  available: boolean;
  quantity: number;
}

export interface BookingPeriod {
  id: string;
  productId: string;
  startDate: Date;
  endDate: Date;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
  notes?: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  address?: string;
  startDate: Date;
  endDate: Date;
  productId: string;
  notes?: string;
}
