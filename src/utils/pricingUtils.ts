
/**
 * Calculates the rental price based on the base price and rental duration.
 * 
 * Pricing rules:
 * - 4 hours: 0.7x daily rate
 * - 1 day: base rate
 * - 3+ days: 10% discount per day
 * - 5+ days: 30% discount per day
 */
export const calculateRentalPrice = (
  basePrice: number,
  hours: number
): {
  total: number;
  subtotal: number;
  discount: number;
  hourlyRate: number;
  dayDiscount: number;
} => {
  // Calculate the number of full days and remaining hours
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  let dayRate = basePrice;
  let dayDiscount = 0;
  
  // Apply discount based on the total number of days
  if (days >= 5) {
    dayDiscount = 30;
    dayRate = basePrice * 0.7; // 30% discount
  } else if (days >= 3) {
    dayDiscount = 10;
    dayRate = basePrice * 0.9; // 10% discount
  }
  
  // Calculate the cost for full days
  const daysTotal = days * dayRate;
  
  // Calculate the cost for remaining hours
  let hoursTotal = 0;
  
  if (remainingHours > 0) {
    if (remainingHours <= 4) {
      // 4 hours rate: 0.7x daily rate
      hoursTotal = basePrice * 0.7;
    } else {
      // More than 4 hours is charged as a full day
      hoursTotal = dayRate;
    }
  }
  
  const subtotal = days * basePrice + (remainingHours > 0 ? basePrice : 0);
  const total = daysTotal + hoursTotal;
  const discount = subtotal - total;
  
  // Calculate effective hourly rate for display purposes
  const hourlyRate = total / hours;
  
  return {
    total,
    subtotal,
    discount,
    hourlyRate,
    dayDiscount,
  };
};
