
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, startOfDay, isBefore } from 'date-fns';
import { ru } from 'date-fns/locale';
import { BookingPeriod } from '@/types/product';
import { Clock } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BookingCalendarProps {
  onBookingChange: (booking: BookingPeriod) => void;
  initialStartDate?: Date;
  initialEndDate?: Date;
  bookedPeriods?: BookingPeriod[];
  isCompact?: boolean;
  className?: string;
}

const BookingCalendar = ({
  onBookingChange,
  initialStartDate,
  initialEndDate,
  bookedPeriods,
  isCompact = false,
  className
}: BookingCalendarProps) => {
  const today = startOfDay(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(initialStartDate || today);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(initialStartDate && initialEndDate ? {
    from: initialStartDate,
    to: initialEndDate
  } : undefined);
  const [startHour, setStartHour] = useState<string>(initialStartDate?.getHours().toString() || "9");
  const [endHour, setEndHour] = useState<string>(initialEndDate?.getHours().toString() || "18");

  useEffect(() => {
    if (initialStartDate && initialEndDate) {
      setDateRange({
        from: initialStartDate,
        to: initialEndDate
      });
      setStartHour(initialStartDate.getHours().toString());
      setEndHour(initialEndDate.getHours().toString());
    }
  }, [initialStartDate, initialEndDate]);

  // Update booking when any date or time value changes
  useEffect(() => {
    if (dateRange?.from) {
      // Create dates with time
      const startWithTime = new Date(dateRange.from);
      startWithTime.setHours(parseInt(startHour), 0, 0);

      const endWithTime = new Date(dateRange.to || dateRange.from);
      endWithTime.setHours(parseInt(endHour), 0, 0);

      // Create booking object
      const newBooking: BookingPeriod = {
        id: 'temp-id',
        productId: 'temp-product',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        startDate: startWithTime,
        endDate: endWithTime,
        status: 'pending',
        totalPrice: 0,
        createdAt: new Date(),
        notes: ''
      };
      onBookingChange(newBooking);
    }
  }, [dateRange, startHour, endHour, onBookingChange]);

  const handleSelectDate = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  // Generate hour options (full hours only)
  const hours = Array.from({
    length: 24
  }, (_, i) => ({
    value: i.toString(),
    label: i < 10 ? `0${i}:00` : `${i}:00`
  }));

  // Stop event propagation to prevent calendar clicks from closing the popover
  const handleCalendarInteraction = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Custom day renderer to highlight the end date in red
  const modifiersStyles = {
    day_selected: {
      backgroundColor: 'hsl(var(--primary))',
      color: 'hsl(var(--primary-foreground))'
    },
    day_range_end: {
      backgroundColor: '#ea384c !important',
      color: 'white !important'
    }
  };

  return (
    <div 
      className={cn("border rounded-md p-2", isCompact ? "space-y-2" : "space-y-4", className)} 
      onClick={handleCalendarInteraction}
    >
      <Calendar 
        mode="range" 
        month={currentMonth} 
        onMonthChange={setCurrentMonth}
        selected={dateRange} 
        onSelect={handleSelectDate} 
        disabled={date => isBefore(date, today)} 
        modifiersStyles={modifiersStyles} 
        className={cn("border-0 p-0 pointer-events-auto w-full max-w-none", isCompact && "scale-[0.85] origin-top")} 
        locale={ru}
        formatters={{
          formatMonthCaption: (date) => format(date, 'LLLL yyyy', { locale: ru })
        }}
      />
      
      {/* Time selection */}
      <div className={cn("grid grid-cols-2 gap-4", isCompact && "mt-2 gap-2")}>
        <div>
          <h4 className={cn("font-medium mb-2", isCompact ? "text-xs mb-1" : "text-sm")}>Время начала</h4>
          <Select value={startHour} onValueChange={setStartHour}>
            <SelectTrigger className={cn("w-full", isCompact && "h-8 text-xs")}>
              <Clock className="mr-2 h-3 w-3" />
              <SelectValue placeholder="Час" />
            </SelectTrigger>
            <SelectContent className="select">
              {hours.map(hour => <SelectItem key={`start-hour-${hour.value}`} value={hour.value}>
                  {hour.label}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <h4 className={cn("font-medium mb-2", isCompact ? "text-xs mb-1" : "text-sm")}>Время окончания</h4>
          <Select value={endHour} onValueChange={setEndHour}>
            <SelectTrigger className={cn("w-full", isCompact && "h-8 text-xs")}>
              <Clock className="mr-2 h-3 w-3" />
              <SelectValue placeholder="Час" />
            </SelectTrigger>
            <SelectContent className="select">
              {hours.map(hour => <SelectItem key={`end-hour-${hour.value}`} value={hour.value}>
                  {hour.label}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {dateRange?.from && <div className={cn("mt-4 p-3 bg-muted/30 rounded-md", isCompact && "mt-2 p-2 text-xs")}>
          <h4 className={cn("font-medium mb-1", isCompact ? "text-xs" : "text-sm")}>Выбранное время</h4>
          <p className={cn("text-sm", isCompact && "text-xs")}>
            {dateRange.from ? format(dateRange.from, 'dd.MM.yyyy', {
          locale: ru
        }) : ''} {startHour}:00 - {dateRange.to ? format(dateRange.to, 'dd.MM.yyyy', {
          locale: ru
        }) : format(dateRange.from, 'dd.MM.yyyy', {
          locale: ru
        })} {endHour}:00
          </p>
        </div>}
    </div>
  );
};

export { BookingCalendar };
export default BookingCalendar;
