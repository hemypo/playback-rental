
import React, { useState } from 'react';
import { format, addDays, isSameDay, isAfter, isBefore, addHours } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { CalendarIcon, ClockIcon } from 'lucide-react';

interface BookingPeriod {
  startDate: Date;
  endDate: Date;
}

interface BookingCalendarProps {
  availabilityPeriods?: BookingPeriod[];
  bookedPeriods?: BookingPeriod[];
  onBookingChange?: (booking: BookingPeriod) => void;
  className?: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MIN_RENTAL_HOURS = 4;

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  availabilityPeriods = [],
  bookedPeriods = [],
  onBookingChange,
  className
}) => {
  const today = new Date();
  
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>("10");
  const [endTime, setEndTime] = useState<string>("18");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarView, setCalendarView] = useState<'start' | 'end'>('start');

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    
    if (calendarView === 'start') {
      // When selecting start date, also reset end date if it's before new start date
      const newStartDate = setHoursToDate(date, parseInt(startTime));
      setStartDate(newStartDate);
      
      if (endDate && isBefore(endDate, newStartDate)) {
        // Default to minimum booking period if end date is invalid
        setEndDate(addHours(newStartDate, MIN_RENTAL_HOURS));
      } else if (!endDate) {
        // Default end date to minimum booking period
        setEndDate(addHours(newStartDate, MIN_RENTAL_HOURS));
      }
      
      setCalendarView('end');
    } else {
      if (startDate && !isBefore(date, startDate)) {
        setEndDate(setHoursToDate(date, parseInt(endTime)));
        setCalendarOpen(false);
      }
    }
  };

  const setHoursToDate = (date: Date, hours: number): Date => {
    const newDate = new Date(date);
    newDate.setHours(hours, 0, 0, 0);
    return newDate;
  };

  const handleStartTimeChange = (value: string) => {
    setStartTime(value);
    if (startDate) {
      const newStartDate = setHoursToDate(startDate, parseInt(value));
      setStartDate(newStartDate);
      
      // Adjust end date if needed
      if (endDate && isBefore(endDate, addHours(newStartDate, MIN_RENTAL_HOURS))) {
        setEndDate(addHours(newStartDate, MIN_RENTAL_HOURS));
      }
    }
  };

  const handleEndTimeChange = (value: string) => {
    setEndTime(value);
    if (endDate) {
      const newEndDate = setHoursToDate(endDate, parseInt(value));
      if (startDate && !isBefore(newEndDate, addHours(startDate, MIN_RENTAL_HOURS))) {
        setEndDate(newEndDate);
      } else if (startDate) {
        // If invalid end time, set to minimum booking period
        setEndDate(addHours(startDate, MIN_RENTAL_HOURS));
      }
    }
  };

  const handleCalendarToggle = (open: boolean) => {
    setCalendarOpen(open);
    if (open && !startDate) {
      setCalendarView('start');
    }
  };

  const isDateUnavailable = (date: Date) => {
    // Disable dates in the past
    if (isBefore(date, today) && !isSameDay(date, today)) {
      return true;
    }
    
    // Check if date falls within any availability period
    if (availabilityPeriods.length > 0) {
      const isAvailable = availabilityPeriods.some(period => 
        (isSameDay(date, period.startDate) || isAfter(date, period.startDate)) &&
        (isSameDay(date, period.endDate) || isBefore(date, period.endDate))
      );
      if (!isAvailable) return true;
    }
    
    // Check if date is fully booked
    if (bookedPeriods.length > 0) {
      const isFullyBooked = bookedPeriods.some(period => 
        isSameDay(date, period.startDate) && isSameDay(date, period.endDate)
      );
      if (isFullyBooked) return true;
    }
    
    return false;
  };

  // Update parent component when booking changes
  React.useEffect(() => {
    if (startDate && endDate && onBookingChange) {
      onBookingChange({ startDate, endDate });
    }
  }, [startDate, endDate, onBookingChange]);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Pickup Date & Time</label>
          <div className="flex gap-2">
            <Popover open={calendarOpen} onOpenChange={handleCalendarToggle}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 glass-panel" align="start">
                <div className="p-3 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">
                      {calendarView === 'start' ? "Select pickup date" : "Select return date"}
                    </h4>
                    {startDate && calendarView === 'end' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setCalendarView('start')}
                      >
                        Back
                      </Button>
                    )}
                  </div>
                  <Calendar
                    mode="single"
                    selected={calendarView === 'start' ? startDate : endDate}
                    onSelect={handleSelectDate}
                    disabled={isDateUnavailable}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </div>
              </PopoverContent>
            </Popover>
            
            <Select value={startTime} onValueChange={handleStartTimeChange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Time" />
              </SelectTrigger>
              <SelectContent>
                {HOURS.map((hour) => (
                  <SelectItem key={`start-${hour}`} value={hour.toString()}>
                    {hour.toString().padStart(2, '0')}:00
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Return Date & Time</label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !endDate && "text-muted-foreground"
              )}
              onClick={() => {
                setCalendarView('end');
                setCalendarOpen(true);
              }}
              disabled={!startDate}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "PPP") : "Select date"}
            </Button>
            
            <Select 
              value={endTime} 
              onValueChange={handleEndTimeChange}
              disabled={!startDate}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Time" />
              </SelectTrigger>
              <SelectContent>
                {HOURS.map((hour) => (
                  <SelectItem key={`end-${hour}`} value={hour.toString()}>
                    {hour.toString().padStart(2, '0')}:00
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {startDate && endDate && (
        <div className="bg-secondary p-4 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
            <span>
              Booking period: <span className="font-medium">{format(startDate, "MMM d, HH:mm")} - {format(endDate, "MMM d, HH:mm")}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
