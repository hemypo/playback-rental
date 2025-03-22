
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarIcon, PlusIcon, CheckIcon } from 'lucide-react';
import AnimatedTransition from './AnimatedTransition';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  available: boolean;
}

interface ProductCardProps {
  product: Product;
  className?: string;
  onAddToCart?: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  className,
  onAddToCart
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    if (onAddToCart && !isAdded) {
      onAddToCart(product.id);
      setIsAdded(true);
      
      // Reset added state after animation
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    }
  };

  return (
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
            <Badge variant="destructive" className="px-3 py-1.5">Currently Unavailable</Badge>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/product/${product.id}`} className="hover:underline">
            <h3 className="font-medium text-lg line-clamp-1">{product.title}</h3>
          </Link>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold">${product.price}/day</p>
            <p className="text-xs text-muted-foreground">from ${(product.price * 0.7).toFixed(2)}/4h</p>
          </div>
          
          <div className="flex gap-2">
            <Link to={`/product/${product.id}`}>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full bg-background/50 backdrop-blur-xs"
              >
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </Link>
            
            <Button 
              variant="default" 
              size="icon" 
              className="rounded-full"
              disabled={!product.available || isAdded}
              onClick={handleAddToCart}
            >
              <AnimatedTransition show={!isAdded} unmountOnExit={false}>
                <PlusIcon className="h-4 w-4" />
              </AnimatedTransition>
              <AnimatedTransition show={isAdded} unmountOnExit={false}>
                <CheckIcon className="h-4 w-4" />
              </AnimatedTransition>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
