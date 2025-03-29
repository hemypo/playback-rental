
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { addMonths, subMonths, format, setHours, startOfDay, isBefore } from 'date-fns';
import { Button } from '@/components/ui/button';
import { BookingPeriod } from '@/types/product';
import { CalendarIcon, Clock } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BookingCalendarProps {
  onBookingChange: (booking: BookingPeriod) => void;
  initialStartDate?: Date;
  initialEndDate?: Date;
  bookedPeriods?: BookingPeriod[];
  isCompact?: boolean; // New prop to control compact view
  className?: string; // Add className prop
}

const BookingCalendar = ({
  onBookingChange,
  initialStartDate,
  initialEndDate,
  bookedPeriods,
  isCompact = false, // Default to full view
  className,
}: BookingCalendarProps) => {
  const today = startOfDay(new Date());
  const [date, setDate] = useState<Date | undefined>(initialStartDate || today);
  const [startDate, setStartDate] = useState<Date | undefined>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | undefined>(initialEndDate);
  const [startHour, setStartHour] = useState<string>("9");
  const [endHour, setEndHour] = useState<string>("18");
  
  useEffect(() => {
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
    
    // Set default time values if dates are provided
    if (initialStartDate) {
      setStartHour(initialStartDate.getHours().toString());
    }
    
    if (initialEndDate) {
      setEndHour(initialEndDate.getHours().toString());
    }
  }, [initialStartDate, initialEndDate]);
  
  // Update booking when any date or time value changes
  useEffect(() => {
    if (startDate && endDate) {
      // Create dates with time
      const startWithTime = new Date(startDate);
      startWithTime.setHours(parseInt(startHour), 0, 0); // Set minutes to 00
      
      const endWithTime = new Date(endDate);
      endWithTime.setHours(parseInt(endHour), 0, 0); // Set minutes to 00
      
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
  }, [startDate, endDate, startHour, endHour]);
  
  const handleSelectEnd = (range: DateRange | undefined) => {
    if (!range) return;
    
    const { from, to } = range;
    
    if (!from) return;
    
    setStartDate(from);
    setEndDate(to || from);
  };
  
  // Generate hour options (full hours only)
  const hours = Array.from({ length: 24 }, (_, i) => ({
    value: i.toString(),
    label: i < 10 ? `0${i}:00` : `${i}:00`
  }));
  
  // Stop event propagation to prevent calendar clicks from closing the popover
  const handleCalendarInteraction = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  return (
    <div className={cn(
      "border rounded-md p-2", 
      isCompact ? "space-y-2" : "space-y-4",
      className
    )} onClick={handleCalendarInteraction}>
      <div className={cn(
        "flex items-center justify-between", 
        isCompact ? "py-1" : "py-2"
      )}>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size={isCompact ? "xs" : "sm"}
            onClick={(e) => {
              e.stopPropagation();
              setDate(subMonths(date || today, 1));
            }}
          >
            <CalendarIcon className={cn(
              "mr-1 h-3 w-3", 
              !isCompact && "mr-2 h-4 w-4"
            )} />
            Предыдущий
          </Button>
          <Button
            variant="outline"
            size={isCompact ? "xs" : "sm"}
            onClick={(e) => {
              e.stopPropagation();
              setDate(addMonths(date || today, 1));
            }}
          >
            Следующий
            <CalendarIcon className={cn(
              "ml-1 h-3 w-3", 
              !isCompact && "ml-2 h-4 w-4"
            )} />
          </Button>
        </div>
        <span className={cn(
          "font-medium",
          isCompact ? "text-xs" : "text-sm"
        )}>
          {format(date || today, 'MMMM yyyy')}
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
        disabled={(date) => isBefore(date, today)}
        className={cn(
          "border-0 p-0 pointer-events-auto w-full max-w-none",
          isCompact && "scale-[0.85] origin-top"
        )}
      />
      
      {/* Time selection */}
      <div className={cn(
        "grid grid-cols-2 gap-4",
        isCompact && "mt-2 gap-2"
      )}>
        <div>
          <h4 className={cn(
            "font-medium mb-2",
            isCompact ? "text-xs mb-1" : "text-sm"
          )}>Время начала</h4>
          <Select value={startHour} onValueChange={setStartHour}>
            <SelectTrigger className={cn(
              "w-full",
              isCompact && "h-8 text-xs"
            )}>
              <Clock className="mr-2 h-3 w-3" />
              <SelectValue placeholder="Час" />
            </SelectTrigger>
            <SelectContent className="select">
              {hours.map(hour => (
                <SelectItem key={`start-hour-${hour.value}`} value={hour.value}>
                  {hour.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <h4 className={cn(
            "font-medium mb-2",
            isCompact ? "text-xs mb-1" : "text-sm"
          )}>Время окончания</h4>
          <Select value={endHour} onValueChange={setEndHour}>
            <SelectTrigger className={cn(
              "w-full",
              isCompact && "h-8 text-xs"
            )}>
              <Clock className="mr-2 h-3 w-3" />
              <SelectValue placeholder="Час" />
            </SelectTrigger>
            <SelectContent className="select">
              {hours.map(hour => (
                <SelectItem key={`end-hour-${hour.value}`} value={hour.value}>
                  {hour.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {startDate && endDate && (
        <div className={cn(
          "mt-4 p-3 bg-muted/30 rounded-md",
          isCompact && "mt-2 p-2 text-xs"
        )}>
          <h4 className={cn(
            "font-medium mb-1",
            isCompact ? "text-xs" : "text-sm"
          )}>Выбранное время</h4>
          <p className={cn(
            "text-sm",
            isCompact && "text-xs"
          )}>
            {startDate ? format(startDate, 'dd.MM.yyyy') : ''} {startHour}:00 - {endDate ? format(endDate, 'dd.MM.yyyy') : ''} {endHour}:00
          </p>
        </div>
      )}
    </div>
  );
};

export { BookingCalendar };
export default BookingCalendar;
