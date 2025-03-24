
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { addDays, format, isWithinInterval, startOfDay, endOfDay, eachDayOfInterval } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { getBookings, getProducts, getCategories } from '@/services/apiService';
import { BookingPeriod, Product, Category } from '@/types/product';

// Interface for bookings with display name
interface ExtendedBooking extends BookingPeriod {
  productName: string;
  productCategory: string;
}

const AdminCalendar = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [daysToShow, setDaysToShow] = useState(14);
  const [filteredCategory, setFilteredCategory] = useState<string>('');
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Fetch data
  const { data: bookings } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: () => getBookings()
  });

  const { data: products } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => getProducts()
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories()
  });

  // Combine bookings with product names
  const [extendedBookings, setExtendedBookings] = useState<ExtendedBooking[]>([]);

  useEffect(() => {
    if (bookings && products) {
      const extended = bookings.map(booking => {
        const product = products.find(p => p.id === booking.productId);
        return {
          ...booking,
          productName: product?.title || 'Неизвестный товар',
          productCategory: product?.category || 'Неизвестная категория'
        };
      });
      setExtendedBookings(extended);
    }
  }, [bookings, products]);

  // Filter products by category
  const filteredProducts = products?.filter(product => 
    !filteredCategory || product.category === filteredCategory
  ) || [];

  // Generate days to display
  const days = Array.from({ length: daysToShow }, (_, i) => 
    addDays(startDate, i)
  );

  // Navigate to previous/next period
  const navigatePrevious = () => {
    setStartDate(addDays(startDate, -daysToShow));
  };

  const navigateNext = () => {
    setStartDate(addDays(startDate, daysToShow));
  };

  // Reset date to today
  const resetToToday = () => {
    setStartDate(new Date());
  };

  // Check if booking is active on a specific day
  const isBookingActiveOnDay = (booking: BookingPeriod, day: Date) => {
    const dayStart = startOfDay(day);
    const dayEnd = endOfDay(day);
    return isWithinInterval(dayStart, {
      start: startOfDay(new Date(booking.startDate)),
      end: endOfDay(new Date(booking.endDate))
    }) || isWithinInterval(dayEnd, {
      start: startOfDay(new Date(booking.startDate)),
      end: endOfDay(new Date(booking.endDate))
    });
  };

  // Get bookings for a product on a specific day
  const getBookingsForProductOnDay = (productId: string, day: Date) => {
    return extendedBookings.filter(booking => 
      booking.productId === productId && isBookingActiveOnDay(booking, day)
    );
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-400';
      case 'cancelled':
        return 'bg-red-500';
      case 'completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Календарь бронирований</h1>
          <p className="text-muted-foreground">
            Шахматка бронирований оборудования
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filteredCategory} onValueChange={setFilteredCategory}>
            <SelectTrigger className="w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Все категории" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все категории</SelectItem>
              {categories?.map((category: Category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={daysToShow.toString()} 
            onValueChange={(value) => setDaysToShow(parseInt(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Период" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 дней</SelectItem>
              <SelectItem value="14">14 дней</SelectItem>
              <SelectItem value="30">30 дней</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {format(startDate, 'dd.MM.yyyy')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  if (date) {
                    setStartDate(date);
                    setCalendarOpen(false);
                  }
                }}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={navigatePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={resetToToday}>
              Сегодня
            </Button>
            <Button variant="outline" size="icon" onClick={navigateNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="rounded-md border bg-card overflow-x-auto">
        <table className="w-full min-w-max">
          <thead>
            <tr className="bg-muted/50">
              <th className="sticky left-0 z-10 bg-muted/50 p-3 text-sm font-medium text-left min-w-[200px] border-r">
                Товар
              </th>
              {days.map((day, index) => (
                <th 
                  key={index} 
                  className={`p-2 text-center text-sm font-medium min-w-[100px] border-r ${
                    day.getDay() === 0 || day.getDay() === 6 ? 'bg-muted/70' : ''
                  }`}
                >
                  <div>{format(day, 'EEEEEE', { locale: ru })}</div>
                  <div>{format(day, 'dd.MM')}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-t hover:bg-muted/30">
                <td className="sticky left-0 z-10 bg-card p-3 font-medium border-r">
                  <div className="flex items-center gap-2">
                    {product.imageUrl && (
                      <div 
                        className="w-8 h-8 rounded bg-center bg-cover flex-shrink-0"
                        style={{ backgroundImage: `url(${product.imageUrl})` }}
                      />
                    )}
                    <div>
                      <div className="truncate max-w-[150px]">{product.title}</div>
                      <div className="text-xs text-muted-foreground">{product.category}</div>
                    </div>
                  </div>
                </td>
                
                {days.map((day, dayIndex) => {
                  const bookingsOnDay = getBookingsForProductOnDay(product.id, day);
                  return (
                    <td 
                      key={dayIndex} 
                      className={`p-2 border-r ${
                        day.getDay() === 0 || day.getDay() === 6 ? 'bg-muted/30' : ''
                      } ${bookingsOnDay.length > 0 ? 'relative' : ''}`}
                    >
                      {bookingsOnDay.length > 0 ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className={`h-full w-full flex items-center justify-center cursor-default`}>
                                <div className={`w-full h-6 ${getStatusColor(bookingsOnDay[0].status)} rounded-sm flex items-center justify-center text-white text-xs`}>
                                  {bookingsOnDay[0].customerName.split(' ')[0]}
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="p-0">
                              <div className="p-3 max-w-[250px]">
                                <div className="font-medium mb-1">{bookingsOnDay[0].customerName}</div>
                                <div className="text-xs mb-2">
                                  {format(new Date(bookingsOnDay[0].startDate), 'dd.MM.yyyy')} - {format(new Date(bookingsOnDay[0].endDate), 'dd.MM.yyyy')}
                                </div>
                                <div className="flex justify-between items-center">
                                  <div className="text-xs text-muted-foreground">{bookingsOnDay[0].customerPhone}</div>
                                  <Badge variant="outline">
                                    {bookingsOnDay[0].status === 'confirmed' 
                                      ? 'Подтверждено' 
                                      : bookingsOnDay[0].status === 'pending' 
                                      ? 'В ожидании'
                                      : bookingsOnDay[0].status === 'cancelled'
                                      ? 'Отменено'
                                      : 'Завершено'}
                                  </Badge>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <div className="h-6"></div> // Empty cell placeholder
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 flex items-center justify-end gap-4">
        <div className="text-sm text-muted-foreground">Статусы:</div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs">Подтверждено</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <span className="text-xs">В ожидании</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs">Отменено</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs">Завершено</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCalendar;
