import { format, differenceInDays, isWithinInterval } from 'date-fns';
import { ru } from 'date-fns/locale';

export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Format a date range as a string
 */
export const formatDateRange = (start: Date, end: Date, showTime: boolean = false): string => {
  const sameDay = start.getDate() === end.getDate() && 
                  start.getMonth() === end.getMonth() && 
                  start.getFullYear() === end.getFullYear();
  
  if (showTime) {
    // Format with times
    if (sameDay) {
      return `${format(start, 'dd.MM.yyyy')} ${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`;
    } else {
      return `${format(start, 'dd.MM.yyyy HH:mm')} - ${format(end, 'dd.MM.yyyy HH:mm')}`;
    }
  } else {
    // Format dates only
    if (sameDay) {
      return format(start, 'dd MMMM yyyy', { locale: ru });
    } else {
      const sameMonth = start.getMonth() === end.getMonth() && 
                         start.getFullYear() === end.getFullYear();
      
      if (sameMonth) {
        return `${format(start, 'dd')} - ${format(end, 'dd MMMM yyyy', { locale: ru })}`;
      } else {
        return `${format(start, 'dd.MM.yyyy')} - ${format(end, 'dd.MM.yyyy')}`;
      }
    }
  }
};

/**
 * Calculate the number of days between two dates
 */
export const calculateDaysDifference = (start: Date, end: Date): number => {
  return differenceInDays(end, start) + 1; // Include both start and end days
};

/**
 * Check if a date range is available (not conflicting with booked periods)
 */
export const isDateRangeAvailable = (
  start: Date, 
  end: Date, 
  bookedPeriods: { start: Date; end: Date }[]
): boolean => {
  // Check if the selected date range overlaps with any booked period
  return !bookedPeriods.some(period => 
    isWithinInterval(start, { start: period.start, end: period.end }) ||
    isWithinInterval(end, { start: period.start, end: period.end }) ||
    (start <= period.start && end >= period.end)
  );
};

/**
 * Formats a date in Russian locale
 */
export const formatDateRu = (date: Date, formatStr: string): string => {
  return format(date, formatStr, { locale: ru });
};

/**
 * Generates available time slots for a given day and booked ranges
 */
export const getAvailableTimeSlots = (
  day: Date,
  bookedRanges: DateRange[],
  slotDurationHours: number = 1,
  businessHours: { open: number; close: number } = { open: 8, close: 22 }
): DateRange[] => {
  const slots: DateRange[] = [];
  const { open, close } = businessHours;
  
  // Create slots from opening to closing time
  for (let hour = open; hour < close; hour += slotDurationHours) {
    const start = new Date(day);
    start.setHours(hour, 0, 0, 0);
    
    const end = new Date(day);
    end.setHours(hour + slotDurationHours, 0, 0, 0);
    
    // Check if this slot is available
    if (isDateRangeAvailable(start, end, bookedRanges)) {
      slots.push({ start, end });
    }
  }
  
  return slots;
};

/**
 * Generates an array of dates for a date range
 */
export const getDatesInRange = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }
  
  return dates;
};

/**
 * Generate business hours options for dropdowns
 */
export const getBusinessHoursOptions = (
  businessHours: { open: number; close: number } = { open: 8, close: 22 }
): { value: string; label: string }[] => {
  const options = [];
  const { open, close } = businessHours;
  
  for (let hour = open; hour <= close; hour++) {
    options.push({
      value: hour.toString(),
      label: `${hour}:00`
    });
  }
  
  return options;
};
