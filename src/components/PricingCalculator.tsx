
import { useState, useEffect } from 'react';
import { differenceInHours, differenceInDays } from 'date-fns';
import { calculateRentalPrice } from '@/utils/pricingUtils';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AnimatedTransition from './AnimatedTransition';

interface PricingCalculatorProps {
  basePrice: number;
  startDate?: Date;
  endDate?: Date;
  className?: string;
}

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({
  basePrice,
  startDate,
  endDate,
  className,
}) => {
  const [pricing, setPricing] = useState<{
    hours: number;
    days: number;
    subtotal: number;
    discount: number;
    total: number;
    hourlyRate: number;
    dayDiscount: number; 
  }>({
    hours: 0,
    days: 0,
    subtotal: 0,
    discount: 0,
    total: 0,
    hourlyRate: 0,
    dayDiscount: 0,
  });

  useEffect(() => {
    if (startDate && endDate) {
      const hours = differenceInHours(endDate, startDate);
      const days = Math.ceil(hours / 24);
      
      const { total, subtotal, discount, hourlyRate, dayDiscount } = calculateRentalPrice(basePrice, hours);
      
      setPricing({
        hours,
        days,
        subtotal,
        discount,
        total,
        hourlyRate,
        dayDiscount,
      });
    }
  }, [startDate, endDate, basePrice]);

  if (!startDate || !endDate) {
    return null;
  }

  return (
    <AnimatedTransition show={true} type="slide-up">
      <Card className={className}>
        <div className="p-4 space-y-4">
          <h3 className="font-medium text-lg">Price Summary</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base price:</span>
              <span>${basePrice.toFixed(2)}/day</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rental period:</span>
              <span>
                {pricing.hours} hours ({pricing.days} {pricing.days === 1 ? 'day' : 'days'})
              </span>
            </div>
            
            {pricing.dayDiscount > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Volume discount:</span>
                <span>-{pricing.dayDiscount}%</span>
              </div>
            )}
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>${pricing.subtotal.toFixed(2)}</span>
            </div>
            
            {pricing.discount > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Discount:</span>
                <span>-${pricing.discount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between font-medium text-lg pt-2">
              <span>Total:</span>
              <span>${pricing.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </Card>
    </AnimatedTransition>
  );
};

export default PricingCalculator;
