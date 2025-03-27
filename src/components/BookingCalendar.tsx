
import { useState, useEffect } from 'react';
import { addDays } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getBusinessHoursOptions } from '@/utils/dateUtils';
import { BookingPeriod } from '@/types/product';
import { toast } from '@/hooks/use-toast';

interface BookingCalendarProps {
  onBookingChange: (bookingPeriod: BookingPeriod) => void;
  bookedPeriods?: BookingPeriod[];
  initialStartDate?: Date;
  initialEndDate?: Date;
}

export const BookingCalendar = ({ 
  onBookingChange, 
  bookedPeriods = [],
  initialStartDate,
  initialEndDate
}: BookingCalendarProps) => {
  const [date, setDate] = useState<Date | undefined>(initialStartDate || undefined);
  const [startTime, setStartTime] = useState<string | undefined>(
    initialStartDate ? initialStartDate.getHours().toString() : undefined
  );
  const [endTime, setEndTime] = useState<string | undefined>(
    initialEndDate ? initialEndDate.getHours().toString() : undefined
  );
  
  // Business hours for time selection
  const businessHours = { open: 8, close: 22 };
  const hourOptions = getBusinessHoursOptions(businessHours);
  
  // Handle date selection
  const handleDateSelect = (selected: Date | undefined) => {
    setDate(selected);
    
    // Reset times if date is cleared
    if (!selected) {
      setStartTime(undefined);
      setEndTime(undefined);
      return;
    }
    
    // Set default start and end times
    if (!startTime) {
      setStartTime(businessHours.open.toString());
    }
    
    if (!endTime) {
      // Default to 4 hour rental
      const defaultEndHour = Math.min(businessHours.open + 4, businessHours.close);
      setEndTime(defaultEndHour.toString());
    }
  };
  
  // Handle time selection
  const handleStartTimeChange = (value: string) => {
    setStartTime(value);
    
    // If end time is earlier than start time, adjust it
    if (endTime && parseInt(value) >= parseInt(endTime)) {
      const newEndHour = Math.min(parseInt(value) + 4, businessHours.close);
      setEndTime(newEndHour.toString());
    }
  };
  
  const handleEndTimeChange = (value: string) => {
    setEndTime(value);
  };
  
  // Update parent component when booking changes
  useEffect(() => {
    if (date && startTime && endTime) {
      const startHour = parseInt(startTime);
      const endHour = parseInt(endTime);
      
      if (startHour >= endHour) {
        toast({
          variant: "destructive",
          title: "Ошибка выбора времени",
          description: "Время окончания должно быть позже времени начала",
        });
        return;
      }
      
      const start = new Date(date);
      start.setHours(startHour, 0, 0, 0);
      
      const end = new Date(date);
      end.setHours(endHour, 0, 0, 0);
      
      onBookingChange({ startDate: start, endDate: end });
    }
  }, [date, startTime, endTime, onBookingChange]);
  
  // Initialize with passed values
  useEffect(() => {
    if (initialStartDate && initialEndDate) {
      setDate(new Date(initialStartDate));
      setStartTime(initialStartDate.getHours().toString());
      setEndTime(initialEndDate.getHours().toString());
    }
  }, [initialStartDate, initialEndDate]);
  
  return (
    <div className="space-y-4 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Date selector */}
        <div className="md:col-span-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className={`w-full justify-start text-left ${!date && 'text-muted-foreground'}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? date.toLocaleDateString() : "Выберите дату"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date()}
                initialFocus
                className="rounded-md border bg-white pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Time selectors */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <div>
            <Select 
              value={startTime} 
              onValueChange={handleStartTimeChange}
              disabled={!date}
            >
              <SelectTrigger>
                <SelectValue placeholder="Начало" />
              </SelectTrigger>
              <SelectContent className="pointer-events-auto">
                {hourOptions.map((option) => (
                  <SelectItem key={`start-${option.value}`} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select 
              value={endTime} 
              onValueChange={handleEndTimeChange}
              disabled={!startTime}
            >
              <SelectTrigger>
                <SelectValue placeholder="Окончание" />
              </SelectTrigger>
              <SelectContent className="pointer-events-auto">
                {hourOptions
                  .filter(option => !startTime || parseInt(option.value) > parseInt(startTime))
                  .map((option) => (
                    <SelectItem key={`end-${option.value}`} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Selected booking info */}
      {date && startTime && endTime && (
        <div className="text-sm p-3 bg-secondary/20 rounded-md">
          <p>
            Выбрано: <span className="font-medium">{date.toLocaleDateString()}, {startTime}:00 - {endTime}:00</span>
          </p>
        </div>
      )}
    </div>
  );
};
