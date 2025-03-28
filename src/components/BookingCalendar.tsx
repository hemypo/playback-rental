
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { addMonths, subMonths } from 'date-fns';
import { Button } from '@/components/ui/button';
import { BookingPeriod } from '@/types/product';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

interface BookingCalendarProps {
  onBookingChange: (booking: BookingPeriod) => void;
  initialStartDate?: Date;
  initialEndDate?: Date;
  bookedPeriods?: BookingPeriod[];
}

const BookingCalendar = ({
  onBookingChange,
  initialStartDate,
  initialEndDate,
  bookedPeriods,
}: BookingCalendarProps) => {
  const [date, setDate] = useState<Date | undefined>(initialStartDate || new Date());
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
  
  const handleSelectEnd = (range: DateRange | undefined) => {
    if (!range) return;
    
    const { from, to } = range;
    
    if (!from) return;
    
    setStartDate(from);
    setEndDate(to);
    
    // Create a proper BookingPeriod object with all required properties
    const newBooking: BookingPeriod = {
      id: 'temp-id', // Temporary ID
      productId: 'temp-product', // Temporary product ID
      customerName: '', // Will be filled later
      customerEmail: '', // Will be filled later
      customerPhone: '', // Will be filled later
      startDate: from,
      endDate: to || from, // If 'to' is undefined, use 'from' as end date
      status: 'pending', // Default status
      totalPrice: 0, // Will be calculated later
      createdAt: new Date(),
      notes: ''
    };
    
    onBookingChange(newBooking);
  };
  
  // Stop event propagation to prevent calendar clicks from closing the popover
  const handleCalendarInteraction = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  return (
    <div className="border rounded-md p-2" onClick={handleCalendarInteraction}>
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setDate(subMonths(date || new Date(), 1));
            }}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Предыдущий
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setDate(addMonths(date || new Date(), 1));
            }}
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
        className={cn("border-0 p-0 pointer-events-auto")}
      />
    </div>
  );
};

// Export as both default and named export to support both import styles
export { BookingCalendar };
export default BookingCalendar;
