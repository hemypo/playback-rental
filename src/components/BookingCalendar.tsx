
import { useState, useCallback } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BookingPeriod } from '@/types/product';
import DateRangePickerRu from './booking/DateRangePickerRu';
import { useIsMobile } from '@/hooks/use-mobile';

interface BookingCalendarProps {
  onBookingChange: (booking: BookingPeriod) => void;
  initialStartDate?: Date;
  initialEndDate?: Date;
  bookedPeriods?: BookingPeriod[];
  isCompact?: boolean;
  className?: string;
  onClose?: () => void;
}

const BookingCalendar = ({
  onBookingChange,
  initialStartDate,
  initialEndDate,
  bookedPeriods,
  isCompact = false,
  className,
  onClose
}: BookingCalendarProps) => {
  const isMobile = useIsMobile();
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: initialStartDate || null,
    end: initialEndDate || null
  });

  // Use useCallback to avoid unnecessary re-renders
  const handleDateRangeChange = useCallback((newRange: {
    start: Date | null;
    end: Date | null;
  }) => {
    setDateRange(newRange);
    if (newRange.start && newRange.end) {
      onBookingChange({
        id: 'temp-id',
        productId: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        startDate: newRange.start,
        endDate: newRange.end,
        status: 'pending',
        totalPrice: 0,
        quantity: 1, // Added missing quantity field
        createdAt: new Date(),
        notes: ''
      });

      // Scroll to top and close popover
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

      // Call onClose with a slight delay to ensure calendar selection completes
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 100);
      }
    }
  }, [onBookingChange, onClose]);

  const handleClose = useCallback(() => {
    if (onClose) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      onClose();
    }
  }, [onClose]);

  return <div className={cn("border rounded-lg shadow-sm bg-card flex flex-col h-full w-full", className)}>
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Выберите даты аренды</h3>
        </div>
      </div>
      <div className={cn("p-4 flex-1 overflow-auto w-full py-[6px]", isMobile ? "max-h-[550px]" : "")}>
        <DateRangePickerRu 
          onChange={handleDateRangeChange} 
          initialStartDate={initialStartDate} 
          initialEndDate={initialEndDate} 
          className={cn(isCompact && "scale-[0.95] origin-top")} 
          onClose={handleClose} 
        />
      </div>
    </div>;
};

export default BookingCalendar;
