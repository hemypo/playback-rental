
import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { toast } from '@/hooks/use-toast';

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  imageUrl: string;
  startDate: Date;
  endDate: Date;
  quantity: number;
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Convert string dates back to Date objects
        const hydratedCart = parsedCart.map((item: any) => ({
          ...item,
          startDate: new Date(item.startDate),
          endDate: new Date(item.endDate)
        }));
        setCartItems(hydratedCart);
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  const addToCart = (product: Product, startDate?: Date, endDate?: Date) => {
    // Check if required dates are provided
    if (!startDate || !endDate) {
      toast({
        title: "Сначала выберите даты",
        description: "Пожалуйста, выберите даты аренды перед добавлением в корзину",
        variant: "destructive",
      });
      return false;
    }
    
    // Generate a unique cart item ID
    const cartItemId = `${product.id}_${Date.now()}`;
    
    // Add the item to the cart
    setCartItems(prevItems => [
      ...prevItems,
      {
        id: cartItemId,
        productId: product.id,
        title: product.title,
        price: product.price,
        imageUrl: product.imageUrl,
        startDate,
        endDate,
        quantity: 1
      }
    ]);
    
    toast({
      title: "Добавлено в корзину",
      description: `${product.title} добавлен в корзину.`,
    });
    
    return true;
  };
  
  const removeFromCart = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    
    toast({
      title: "Удалено из корзины",
      description: "Товар удален из корзины.",
    });
  };
  
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };
  
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const days = Math.ceil(
        (item.endDate.getTime() - item.startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return total + (item.price * days * item.quantity);
    }, 0);
  };
  
  return {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotal,
    cartCount: cartItems.length
  };
};

// Create a CartProvider for global state management
import React, { createContext, useContext } from 'react';

type CartContextType = ReturnType<typeof useCart>;

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cart = useCart();
  
  return (
    <CartContext.Provider value={cart}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};
