import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  ShieldCheckIcon, 
  TrashIcon,
  Clock,
  AlertTriangleIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { formatDateRange } from '@/utils/dateUtils';
import { useCartContext } from '@/hooks/useCart';
import { createBooking } from '@/services/bookingService';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import BookingCalendar from '@/components/BookingCalendar';
import { BookingPeriod } from '@/types/product';
import { calculateRentalPrice, calculateRentalDetails, formatCurrency } from '@/utils/pricingUtils';
import { isPhoneComplete } from '@/utils/phoneMask';
import CartList from '@/components/checkout/CartList';
import CartRentalPeriodEditor from '@/components/checkout/CartRentalPeriodEditor';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import CheckoutOrderSummary from '@/components/checkout/CheckoutOrderSummary';
import CheckoutSuccess from '@/components/checkout/CheckoutSuccess';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [selectedBookingTime, setSelectedBookingTime] = useState<BookingPeriod | null>(null);

  const { 
    cartItems, 
    removeFromCart, 
    getCartTotal, 
    clearCart,
    updateCartDates 
  } = useCartContext();
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBookingChange = (booking: BookingPeriod) => {
    setSelectedBookingTime(booking);
    if (booking && booking.startDate && booking.endDate) {
      updateCartDates(booking.startDate, booking.endDate);
    }
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!formData.name.trim()) {
      errors.push('Имя не должно быть пустым');
    }
    
    if (!/^[A-Za-zА-Яа-яЁё\s\-]+$/.test(formData.name.trim())) {
      errors.push('Имя может содержать только буквы');
    }
    
    if (!formData.email.trim()) {
      errors.push('Email не должен быть пустым');
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.push('Введите корректный email');
    }
    
    if (!isPhoneComplete(formData.phone)) {
      errors.push('Телефон должен содержать 10 цифр в формате +7 (XXX) XXX-XX-XX');
    }
    
    if (cartItems.length === 0) {
      errors.push('Корзина пуста');
    }
    
    setFormErrors(errors);
    return errors.length === 0;
  };
  
  const handleCheckout = async () => {
    if (!validateForm()) {
      toast.error('Пожалуйста, заполните все поля формы корректно');
      return;
    }
    
    setLoading(true);
    try {
      for (const item of cartItems) {
        await createBooking({
          productId: item.productId,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          startDate: item.startDate.toISOString(),
          endDate: item.endDate.toISOString(),
          status: 'pending',
          totalPrice: calculateRentalPrice(item.price, item.startDate, item.endDate),
          notes: `Бронирование из корзины: ${item.title}`
        });
      }
      
      clearCart();
      setOrderComplete(true);
      toast.success('Заказ оформлен успешно!');
      console.log('Booking completed successfully:', {
        items: cartItems.length,
        totalValue: getCartTotal()
      });
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error('Ошибка при оформлении заказа');
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return <CheckoutSuccess />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center mb-8">
        <Link to="/catalog" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Вернуться к каталогу
        </Link>
      </div>
      <h1 className="heading-2 mb-8">Корзина</h1>
      {formErrors.length > 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium">Пожалуйста, исправьте следующие ошибки:</div>
            <ul className="list-disc pl-5 mt-2">
              {formErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CartList />
          {cartItems.length > 0 && (
            <CartRentalPeriodEditor
              initialStartDate={cartItems[0]?.startDate}
              initialEndDate={cartItems[0]?.endDate}
              onBookingChange={handleBookingChange}
              selectedBookingTime={selectedBookingTime}
            />
          )}
        </div>
        <div>
          <CheckoutForm formData={formData} onInputChange={handleInputChange} />
          <div className="mt-6">
            <CheckoutOrderSummary onCheckout={handleCheckout} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
