
import { useState, useEffect } from 'react';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { formatDateRange } from '@/utils/dateUtils';
import { BookingCalendar } from '@/components/BookingCalendar';
import { BookingPeriod } from '@/types/product';

interface DateFilterPopoverProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onDateRangeChange: (start: Date | undefined, end: Date | undefined) => void;
}

const DateFilterPopover = ({
  startDate,
  endDate,
  onDateRangeChange,
}: DateFilterPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleBookingChange = (booking: BookingPeriod) => {
    onDateRangeChange(booking.startDate, booking.endDate);
  };
  
  const handleClear = () => {
    onDateRangeChange(undefined, undefined);
    setIsOpen(false);
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-white/10 text-white border-white/20 hover:bg-white/20 h-12"
        >
          <CalendarIcon className="mr-2 h-5 w-5" />
          {startDate && endDate ? formatDateRange(startDate, endDate) : "Выбрать время"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 space-y-4">
          <h3 className="font-medium">Выберите дату и время</h3>
          
          <BookingCalendar
            onBookingChange={handleBookingChange}
            initialStartDate={startDate}
            initialEndDate={endDate}
          />
          
          <div className="pt-2 flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleClear}
            >
              Очистить
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateFilterPopover;
