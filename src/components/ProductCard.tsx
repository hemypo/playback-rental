
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarIcon, PlusIcon, CheckIcon } from 'lucide-react';
import AnimatedTransition from './AnimatedTransition';
import { Product } from '@/types/product';
import { useCartContext } from '@/hooks/useCart';

interface ProductCardProps {
  product: Product;
  className?: string;
  selectedStartDate?: Date;
  selectedEndDate?: Date;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  className,
  selectedStartDate,
  selectedEndDate
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCartContext();

  const handleCalendarClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product detail page
    e.stopPropagation(); // Stop event propagation
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (selectedStartDate && selectedEndDate) {
      const success = addToCart(product, selectedStartDate, selectedEndDate);
      if (success) {
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
      }
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <Link to={`/product/${product.id}`}>
      <Card 
        className={cn(
          "overflow-hidden border-0 rounded-xl transition-all duration-300 subtle-ring",
          isHovered ? "shadow-medium translate-y-[-4px]" : "shadow-soft",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <div className={cn(
            "absolute inset-0 bg-cover bg-center transition-transform duration-500",
            isHovered ? "scale-105" : "scale-100"
          )} 
          style={{ backgroundImage: `url(${product.imageUrl})` }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
          
          <Badge 
            variant="secondary" 
            className="absolute top-3 left-3 bg-white/90 text-black font-medium"
          >
            {product.category}
          </Badge>
          
          {!product.available && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <Badge variant="destructive" className="px-3 py-1.5">Недоступен для бронирования</Badge>
            </div>
          )}
        </div>
        
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-lg line-clamp-1">{product.title}</h3>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">{product.price.toLocaleString()} ₽/сутки</p>
              <p className="text-xs text-muted-foreground">от {(product.price * 0.7).toLocaleString()} ₽/4 часа</p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full bg-background/50 backdrop-blur-xs"
                onClick={handleCalendarClick}
              >
                <CalendarIcon className="h-4 w-4" />
              </Button>
              
              {selectedStartDate && selectedEndDate && (
                <Button
                  variant={isAdded ? "secondary" : "default"}
                  size="sm"
                  className="rounded-full"
                  onClick={handleAddToCart}
                >
                  {isAdded ? (
                    <><CheckIcon className="h-4 w-4 mr-1" /> Добавлено</>
                  ) : (
                    <><PlusIcon className="h-4 w-4 mr-1" /> В корзину</>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;
