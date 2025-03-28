
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { addMonths, subMonths, format, setHours, setMinutes } from 'date-fns';
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
  const [startHour, setStartHour] = useState<string>("9");
  const [startMinute, setStartMinute] = useState<string>("0");
  const [endHour, setEndHour] = useState<string>("18");
  const [endMinute, setEndMinute] = useState<string>("0");
  const [isSelectingRange, setIsSelectingRange] = useState(false);
  
  useEffect(() => {
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
    
    // Set default time values if dates are provided
    if (initialStartDate) {
      setStartHour(initialStartDate.getHours().toString());
      setStartMinute(initialStartDate.getMinutes().toString());
    }
    
    if (initialEndDate) {
      setEndHour(initialEndDate.getHours().toString());
      setEndMinute(initialEndDate.getMinutes().toString());
    }
  }, [initialStartDate, initialEndDate]);
  
  // Update booking when any date or time value changes
  useEffect(() => {
    if (startDate && endDate) {
      // Create dates with time
      const startWithTime = new Date(startDate);
      startWithTime.setHours(parseInt(startHour), parseInt(startMinute), 0);
      
      const endWithTime = new Date(endDate);
      endWithTime.setHours(parseInt(endHour), parseInt(endMinute), 0);
      
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
  }, [startDate, endDate, startHour, startMinute, endHour, endMinute]);
  
  const handleSelectEnd = (range: DateRange | undefined) => {
    if (!range) return;
    
    const { from, to } = range;
    
    if (!from) return;
    
    setStartDate(from);
    setEndDate(to || from);
  };
  
  // Generate hour options
  const hours = Array.from({ length: 24 }, (_, i) => ({
    value: i.toString(),
    label: i < 10 ? `0${i}` : `${i}`
  }));
  
  // Generate minute options (every 15 minutes)
  const minutes = [0, 15, 30, 45].map(m => ({
    value: m.toString(),
    label: m < 10 ? `0${m}` : `${m}`
  }));
  
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
      
      {/* Time selection */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Время начала</h4>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground">Часы</label>
              <Select value={startHour} onValueChange={setStartHour}>
                <SelectTrigger className="w-full">
                  <Clock className="mr-2 h-3 w-3" />
                  <SelectValue placeholder="Час" />
                </SelectTrigger>
                <SelectContent>
                  {hours.map(hour => (
                    <SelectItem key={`start-hour-${hour.value}`} value={hour.value}>
                      {hour.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-xs text-muted-foreground">Минуты</label>
              <Select value={startMinute} onValueChange={setStartMinute}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Мин" />
                </SelectTrigger>
                <SelectContent>
                  {minutes.map(minute => (
                    <SelectItem key={`start-min-${minute.value}`} value={minute.value}>
                      {minute.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Время окончания</h4>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground">Часы</label>
              <Select value={endHour} onValueChange={setEndHour}>
                <SelectTrigger className="w-full">
                  <Clock className="mr-2 h-3 w-3" />
                  <SelectValue placeholder="Час" />
                </SelectTrigger>
                <SelectContent>
                  {hours.map(hour => (
                    <SelectItem key={`end-hour-${hour.value}`} value={hour.value}>
                      {hour.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-xs text-muted-foreground">Минуты</label>
              <Select value={endMinute} onValueChange={setEndMinute}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Мин" />
                </SelectTrigger>
                <SelectContent>
                  {minutes.map(minute => (
                    <SelectItem key={`end-min-${minute.value}`} value={minute.value}>
                      {minute.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      
      {startDate && endDate && (
        <div className="mt-4 p-3 bg-muted/30 rounded-md">
          <h4 className="text-sm font-medium mb-1">Выбранное время</h4>
          <p className="text-sm">
            {startDate ? format(startDate, 'dd.MM.yyyy') : ''} {startHour}:{startMinute === '0' ? '00' : startMinute} - {endDate ? format(endDate, 'dd.MM.yyyy') : ''} {endHour}:{endMinute === '0' ? '00' : endMinute}
          </p>
        </div>
      )}
    </div>
  );
};

export { BookingCalendar };
export default BookingCalendar;
