import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { addMonths, subMonths } from 'date-fns';
import { Button } from '@/components/ui/button';
import { BookingPeriod } from '@/types/product';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

interface BookingCalendarProps {
  onBookingChange: (booking: BookingPeriod) => void;
  initialStartDate?: Date;
  initialEndDate?: Date;
}

const BookingCalendar = ({
  onBookingChange,
  initialStartDate,
  initialEndDate,
}: BookingCalendarProps) => {
  const [date, setDate] = useState<Date | undefined>(initialStartDate);
  const [startDate, setStartDate] = useState<Date | undefined>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | undefined>(initialEndDate);
  const [isSelectingRange, setIsSelectingRange] = useState(false);
  
  useEffect(() => {
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
  }, [initialStartDate, initialEndDate]);
  
  const handleDayClick = (day: Date) => {
    if (!isSelectingRange) {
      // Start selecting the range
      setStartDate(day);
      setEndDate(undefined);
      setIsSelectingRange(true);
    } else {
      // Finish selecting the range
      if (day < startDate!) {
        setStartDate(day);
        setEndDate(startDate);
      } else {
        setEndDate(day);
      }
      setIsSelectingRange(false);
    }
  };
  
  const handleSelectEnd = (endDate: Date | undefined) => {
    if (!startDate || !endDate) return;
    if (endDate < startDate) {
      setEndDate(undefined);
      return;
    }
    
    setEndDate(endDate);
    
    // Create a proper BookingPeriod object with all required properties
    const newBooking: BookingPeriod = {
      id: 'temp-id', // Temporary ID
      productId: 'temp-product', // Temporary product ID
      customerName: '', // Will be filled later
      customerEmail: '', // Will be filled later
      customerPhone: '', // Will be filled later
      startDate: startDate,
      endDate: endDate,
      status: 'pending', // Default status
      totalPrice: 0, // Will be calculated later
      createdAt: new Date(),
      notes: ''
    };
    
    onBookingChange(newBooking);
  };
  
  return (
    <div className="border rounded-md p-2">
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDate(subMonths(date || new Date(), 1))}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Предыдущий
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDate(addMonths(date || new Date(), 1))}
          >
            Следующий
            <CalendarIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm font-medium">
          {format(date || new Date(), 'MMMM yyyy')}
        </span>
      </div>
      <Calendar
        mode="range"
        defaultMonth={date}
        selected={{
          from: startDate,
          to: endDate,
        }}
        onSelect={handleSelectEnd}
        className={cn("border-0 p-0")}
      />
    </div>
  );
};

export default BookingCalendar;
