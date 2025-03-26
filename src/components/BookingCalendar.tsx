
import React, { useState, useEffect } from 'react';
import { format, addDays, isSameDay, isAfter, isBefore, addHours, parse } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { CalendarIcon, ClockIcon } from 'lucide-react';
import { BookingPeriod } from '@/types/product';

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
  const todayISO = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>("10");
  const [endTime, setEndTime] = useState<string>("18");
  
  // For HTML date inputs
  const [startDateISO, setStartDateISO] = useState<string>('');
  const [endDateISO, setEndDateISO] = useState<string>('');

  // Update ISO dates when Date objects change
  useEffect(() => {
    if (startDate) {
      setStartDateISO(startDate.toISOString().split('T')[0]);
    }
  }, [startDate]);

  useEffect(() => {
    if (endDate) {
      setEndDateISO(endDate.toISOString().split('T')[0]);
    }
  }, [endDate]);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartDateISO(value);
    
    if (value) {
      try {
        // Parse the date from ISO format (YYYY-MM-DD)
        const parsedDate = new Date(value);
        parsedDate.setHours(parseInt(startTime), 0, 0, 0);
        
        if (!isNaN(parsedDate.getTime())) {
          setStartDate(parsedDate);
          
          // Adjust end date if needed
          if (endDate && isBefore(endDate, addHours(parsedDate, MIN_RENTAL_HOURS))) {
            const newEndDate = addHours(parsedDate, MIN_RENTAL_HOURS);
            setEndDate(newEndDate);
            setEndDateISO(newEndDate.toISOString().split('T')[0]);
          } else if (!endDate) {
            const newEndDate = addHours(parsedDate, MIN_RENTAL_HOURS);
            setEndDate(newEndDate);
            setEndDateISO(newEndDate.toISOString().split('T')[0]);
          }
        }
      } catch (error) {
        console.log("Invalid date format", error);
      }
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEndDateISO(value);
    
    if (value && startDate) {
      try {
        // Parse the date from ISO format (YYYY-MM-DD)
        const parsedDate = new Date(value);
        parsedDate.setHours(parseInt(endTime), 0, 0, 0);
        
        if (!isNaN(parsedDate.getTime()) && !isBefore(parsedDate, startDate)) {
          setEndDate(parsedDate);
        }
      } catch (error) {
        console.log("Invalid date format", error);
      }
    }
  };

  const handleStartTimeChange = (value: string) => {
    setStartTime(value);
    if (startDate) {
      const newStartDate = new Date(startDate);
      newStartDate.setHours(parseInt(value), 0, 0, 0);
      setStartDate(newStartDate);
      
      // Adjust end date if needed
      if (endDate && isBefore(endDate, addHours(newStartDate, MIN_RENTAL_HOURS))) {
        const newEndDate = addHours(newStartDate, MIN_RENTAL_HOURS);
        setEndDate(newEndDate);
      }
    }
  };

  const handleEndTimeChange = (value: string) => {
    setEndTime(value);
    if (endDate) {
      const newEndDate = new Date(endDate);
      newEndDate.setHours(parseInt(value), 0, 0, 0);
      
      if (startDate && !isBefore(newEndDate, addHours(startDate, MIN_RENTAL_HOURS))) {
        setEndDate(newEndDate);
      } else if (startDate) {
        // If invalid end time, set to minimum booking period
        setEndDate(addHours(startDate, MIN_RENTAL_HOURS));
      }
    }
  };

  // Update parent component when booking changes
  useEffect(() => {
    if (startDate && endDate && onBookingChange) {
      onBookingChange({ 
        startDate, 
        endDate, 
        id: '',
        productId: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        status: 'pending',
        totalPrice: 0,
        createdAt: new Date()
      });
    }
  }, [startDate, endDate, onBookingChange]);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Дата и время начала</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="date"
                value={startDateISO}
                onChange={handleStartDateChange}
                min={todayISO}
                className="h-10"
              />
            </div>
            
            <Select value={startTime} onValueChange={handleStartTimeChange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Время" />
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
          <label className="text-sm font-medium">Дата и время окончания</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="date"
                value={endDateISO}
                onChange={handleEndDateChange}
                min={startDateISO || todayISO}
                disabled={!startDate}
                className="h-10"
              />
            </div>
            
            <Select 
              value={endTime} 
              onValueChange={handleEndTimeChange}
              disabled={!startDate}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Время" />
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
              Период аренды: <span className="font-medium">{format(startDate, "dd.MM, HH:mm")} - {format(endDate, "dd.MM, HH:mm")}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
