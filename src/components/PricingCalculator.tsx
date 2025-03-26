
import { useState, useEffect } from 'react';
import { differenceInHours } from 'date-fns';
import { calculateRentalDetails } from '@/utils/pricingUtils';
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
    if (startDate && endDate && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      const hours = differenceInHours(endDate, startDate);
      if (hours <= 0) return; // Avoid negative or zero hours
      
      const days = Math.ceil(hours / 24);
      
      const { total, subtotal, discount, hourlyRate, dayDiscount } = calculateRentalDetails(basePrice, hours);
      
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
          <h3 className="font-medium text-lg">Стоимость аренды</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Базовая цена:</span>
              <span>{basePrice.toLocaleString()} ₽/сутки</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Период аренды:</span>
              <span>
                {pricing.hours} ч. ({pricing.days} {pricing.days === 1 ? 'день' : 'дней'})
              </span>
            </div>
            
            {pricing.dayDiscount > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Скидка за объем:</span>
                <span>-{pricing.dayDiscount}%</span>
              </div>
            )}
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Подытог:</span>
              <span>{pricing.subtotal.toLocaleString()} ₽</span>
            </div>
            
            {pricing.discount > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Скидка:</span>
                <span>-{pricing.discount.toLocaleString()} ₽</span>
              </div>
            )}
            
            <div className="flex justify-between font-medium text-lg pt-2">
              <span>Итого:</span>
              <span>{pricing.total.toLocaleString()} ₽</span>
            </div>
          </div>
        </div>
      </Card>
    </AnimatedTransition>
  );
};

export default PricingCalculator;
