import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  CheckIcon, 
  ClockIcon, 
  PackageIcon, 
  TagIcon 
} from 'lucide-react';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnimatedTransition from '@/components/AnimatedTransition';
import { BookingCalendar } from '@/components/BookingCalendar';
import PricingCalculator from '@/components/PricingCalculator';
import { getProductById, getProductBookings } from '@/services/apiService';
import { formatDateRange } from '@/utils/dateUtils';
import { BookingPeriod, Product } from '@/types/product';
import { useCartContext } from '@/hooks/useCart';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const locationState = location.state as { startDate?: Date; endDate?: Date } | null;
  
  const [bookingDates, setBookingDates] = useState<{startDate?: Date, endDate?: Date}>({
    startDate: locationState?.startDate,
    endDate: locationState?.endDate
  });
  
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart } = useCartContext();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id || ''),
    meta: {
      onError: () => navigate('/catalog')
    }
  });

  const { data: bookings } = useQuery({
    queryKey: ['bookings', id],
    queryFn: () => getProductBookings(id || ''),
    enabled: !!id,
  });

  const handleBookingChange = (bookingPeriod: BookingPeriod) => {
    setBookingDates({
      startDate: bookingPeriod.startDate,
      endDate: bookingPeriod.endDate
    });
  };

  const handleAddToCart = () => {
    if (!product || !bookingDates.startDate || !bookingDates.endDate) return;
    
    setAddingToCart(true);
    
    const success = addToCart(
      product, 
      bookingDates.startDate, 
      bookingDates.endDate
    );
    
    if (success) {
      setTimeout(() => {
        setAddingToCart(false);
        navigate('/checkout');
      }, 1000);
    } else {
      setAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="heading-2 mb-4">Товар не найден</h2>
        <p className="mb-6">Товар, который вы ищете, не существует или был удален.</p>
        <Button asChild>
          <Link to="/catalog">Вернуться в каталог</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Главная</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/catalog">Каталог</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>{product.title}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnimatedTransition show={true} type="fade" className="relative aspect-[4/3] rounded-xl overflow-hidden subtle-ring">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${product.imageUrl})` }}
            ></div>
            
            <Badge 
              variant="secondary" 
              className="absolute top-4 left-4 bg-white/90 text-black font-medium"
            >
              {product.category}
            </Badge>
            
            {!product.available && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <Badge variant="destructive" className="px-4 py-2 text-base">Забронирован</Badge>
              </div>
            )}
          </AnimatedTransition>

          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-3">
                <TagIcon className="h-3 w-3 mr-1" />
                {product.category}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-semibold mb-2">{product.title}</h1>
              <p className="text-xl mb-4">
                <span className="font-semibold">{product.price}</span>
                <span className="text-muted-foreground"> ₽/в сутки</span>
              </p>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <Separator />

            <div className="space-y-6">
              <h3 className="text-lg font-medium">Заказать оборудование</h3>
              
              <BookingCalendar
                onBookingChange={handleBookingChange}
                bookedPeriods={bookings}
                initialStartDate={bookingDates.startDate}
                initialEndDate={bookingDates.endDate}
              />

              {bookingDates.startDate && bookingDates.endDate && (
                <PricingCalculator
                  basePrice={product.price}
                  startDate={bookingDates.startDate}
                  endDate={bookingDates.endDate}
                />
              )}

              <Button 
                size="lg"
                className="w-full"
                disabled={!product.available || !bookingDates.startDate || !bookingDates.endDate || addingToCart}
                onClick={handleAddToCart}
              >
                {addingToCart ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    В процессе...
                  </>
                ) : (
                  <>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {bookingDates.startDate && bookingDates.endDate ? 'Добавить в корзину' : 'Выберите даты'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <Tabs defaultValue="details">
            <TabsList className="mb-8">
              <TabsTrigger value="details">Подробности</TabsTrigger>
              <TabsTrigger value="specifications">Характеристики</TabsTrigger>
              <TabsTrigger value="availability">Доступность</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl glass-card">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10">
                      <PackageIcon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-medium">Аренда включает в себя</h3>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                      <span>Чехол для переноски</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                      <span>Основные аксессуары</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                      <span>Руководство пользователя</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                      <span>Техническая поддержка</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-6 rounded-xl glass-card">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10">
                      <ClockIcon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-medium">Стоимость аренды</h3>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="text-muted-foreground">4 часа:</span>
                      <span className="font-medium">{(product.price * 0.7).toFixed(2)} ₽</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-muted-foreground">Сутки:</span>
                      <span className="font-medium">{product.price.toFixed(2)} ₽</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-muted-foreground">от 3-ех суток:</span>
                      <span className="font-medium">{(product.price * 0.9).toFixed(2)} ₽/день</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-muted-foreground">от 5 дней:</span>
                      <span className="font-medium">{(product.price * 0.7).toFixed(2)} ₽/день</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-6 rounded-xl glass-card">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-medium">Доступность</h3>
                  </div>
                  {product.available ? (
                    <div className="text-green-600 font-medium flex items-center gap-2 mb-4">
                      <CheckIcon className="h-4 w-4" />
                      <span>Доступно для аренды</span>
                    </div>
                  ) : (
                    <div className="text-red-500 font-medium mb-4">Забронирован</div>
                  )}
                  
                  <div className="text-sm text-muted-foreground">
                    {bookings && bookings.length > 0 ? (
                      <div>
                        <p className="mb-2">Предстоящее бронирование:</p>
                        <ul className="space-y-2">
                          {bookings.slice(0, 3).map((booking: BookingPeriod, index: number) => (
                            <li key={index} className="text-xs bg-secondary p-2 rounded">
                              {formatDateRange(booking.startDate, booking.endDate)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p>Нет предстоящего бронирования.</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-xl glass-card">
                <h3 className="font-medium mb-4">Описание</h3>
                <p className="text-muted-foreground">
                  {product.description}
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="availability">
              <div className="p-6 rounded-xl glass-card">
                <h3 className="font-medium mb-6">Календарь бронирования</h3>
                
                {product.available ? (
                  <div className="space-y-6">
                    <p className="text-muted-foreground">
                      Посмотрите календарь бронирования для выбора свободной даты.
                    </p>
                    
                    <div className="max-w-md mx-auto">
                      <BookingCalendar
                        onBookingChange={handleBookingChange}
                        bookedPeriods={bookings}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CalendarIcon className="h-8 w-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">В настоящее время недоступен</h3>
                    <p className="text-muted-foreground mb-6">
                    В данный момент это оборудование недоступно для проката.
                    </p>
                    <Button asChild>
                      <Link to="/catalog">Просмотрите альтернативные варианты</Link>
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
