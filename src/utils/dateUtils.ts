import { addDays, addHours, format, isSameDay, isWithinInterval } from 'date-fns';

export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Formats a date range for display
 */
export const formatDateRange = (start: Date, end: Date): string => {
  if (isSameDay(start, end)) {
    return `${format(start, 'dd.MM.yyyy')} ${format(start, 'HH:00')} - ${format(end, 'HH:00')}`;
  }
  return `${format(start, 'dd.MM.yyyy HH:00')} - ${format(end, 'dd.MM.yyyy HH:00')}`;
};

/**
 * Checks if a date range overlaps with any of the provided booked ranges
 */
export const isDateRangeAvailable = (
  start: Date,
  end: Date,
  bookedRanges: DateRange[]
): boolean => {
  // Check if the requested period overlaps with any booked period
  return !bookedRanges.some(
    (bookedRange) =>
      isWithinInterval(start, { start: bookedRange.start, end: bookedRange.end }) ||
      isWithinInterval(end, { start: bookedRange.start, end: bookedRange.end }) ||
      (start < bookedRange.start && end > bookedRange.end)
  );
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
