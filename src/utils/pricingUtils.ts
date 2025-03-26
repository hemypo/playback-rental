
// Calculate rental price based on number of days
export const calculateRentalPrice = (
  basePrice: number,
  startDate: Date | undefined,
  endDate: Date | undefined
): number => {
  // Check if dates are valid before calculation
  if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return 0;
  }
  
  // Calculate days between dates
  const millisPerDay = 1000 * 60 * 60 * 24;
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / millisPerDay);
  
  // Apply discount based on duration
  let discount = 0;
  if (days >= 5) {
    discount = 0.3; // 30% off for 5+ days
  } else if (days >= 3) {
    discount = 0.1; // 10% off for 3+ days
  }
  
  // Calculate hourly rate if less than a day
  if (days < 1) {
    const hours = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));
    // 4 hours is 70% of the daily rate
    if (hours <= 4) {
      return basePrice * 0.7;
    }
  }
  
  const pricePerDay = basePrice * (1 - discount);
  return pricePerDay * days;
};

// Calculate rental price details (expanded version)
export const calculateRentalDetails = (
  basePrice: number,
  hours: number
): {
  total: number;
  subtotal: number;
  discount: number;
  hourlyRate: number;
  dayDiscount: number;
} => {
  const days = Math.ceil(hours / 24);
  
  // Calculate the discount percentage based on days
  let dayDiscount = 0;
  if (days >= 5) {
    dayDiscount = 30;
  } else if (days >= 3) {
    dayDiscount = 10;
  }
  
  // Calculate hourly rate for short rentals
  let hourlyRate = basePrice;
  if (hours <= 4) {
    hourlyRate = basePrice * 0.7 / 4; // Per hour for 4-hour rental
  } else if (hours <= 8) {
    hourlyRate = basePrice * 0.85 / 8; // Per hour for 8-hour rental
  } else {
    hourlyRate = basePrice / 24; // Per hour for full day rental
  }
  
  // Calculate subtotal (before discount)
  const subtotal = days * basePrice;
  
  // Calculate discount amount
  const discountAmount = subtotal * (dayDiscount / 100);
  
  // Calculate total (after discount)
  const total = subtotal - discountAmount;
  
  return {
    total,
    subtotal,
    discount: discountAmount,
    hourlyRate,
    dayDiscount
  };
};

// Alias for backward compatibility
export const calculatePrice = calculateRentalPrice;

// Format currency to locale string
export const formatCurrency = (amount: number, currency: string = 'RUB'): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Calculate hourly rates based on daily price
export const calculateHourlyRate = (dailyPrice: number, hours: number): number => {
  // For 4 hours, charge 70% of daily rate
  if (hours <= 4) {
    return dailyPrice * 0.7;
  }
  // For 8 hours, charge 85% of daily rate
  if (hours <= 8) {
    return dailyPrice * 0.85;
  }
  // Otherwise, charge full daily rate
  return dailyPrice;
};
