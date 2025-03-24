
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  startDate?: Date;
  endDate?: Date;
  quantity?: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        
        // Convert string dates back to Date objects
        const itemsWithDates = parsedCart.map((item: any) => ({
          ...item,
          startDate: item.startDate ? new Date(item.startDate) : undefined,
          endDate: item.endDate ? new Date(item.endDate) : undefined,
        }));
        
        setItems(itemsWithDates);
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);
  
  const addItem = (newItem: CartItem) => {
    // Check if the item already exists in the cart
    const existingItemIndex = items.findIndex(item => item.id === newItem.id);
    
    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...items];
      const existingItem = updatedItems[existingItemIndex];
      
      updatedItems[existingItemIndex] = {
        ...existingItem,
        ...newItem,
        quantity: (existingItem.quantity || 1) + 1,
      };
      
      setItems(updatedItems);
    } else {
      // Add new item
      setItems(prev => [...prev, { ...newItem, quantity: 1 }]);
    }
  };
  
  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };
  
  const clearCart = () => {
    setItems([]);
  };
  
  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      clearCart,
      itemCount: items.length 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
