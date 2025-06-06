
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { getAvailableProductsForBooking, addBookingItem } from '@/services/bookingItemService';
import { GroupedBooking } from './types';
import QuantitySelector from '@/components/QuantitySelector';
import { ProductCombobox } from './ProductCombobox';
import { Loader2 } from 'lucide-react';

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupedBooking: GroupedBooking;
  onSuccess: () => void;
}

export const AddProductDialog: React.FC<AddProductDialogProps> = ({
  open,
  onOpenChange,
  groupedBooking,
  onSuccess
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const { data: availableProducts, isLoading } = useQuery({
    queryKey: ['available-products-for-booking', groupedBooking.id, groupedBooking.startDate, groupedBooking.endDate],
    queryFn: () => getAvailableProductsForBooking(
      groupedBooking.id,
      groupedBooking.startDate,
      groupedBooking.endDate
    ),
    enabled: open
  });

  const selectedProduct = availableProducts?.find(p => p.id === selectedProductId);
  const totalPrice = selectedProduct ? selectedProduct.price * quantity : 0;
  const maxQuantity = selectedProduct?.quantity || 1;

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      setSelectedProductId('');
      setQuantity(1);
    }
  }, [open]);

  const handleAdd = async () => {
    if (!selectedProduct) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, выберите продукт',
        variant: 'destructive'
      });
      return;
    }

    if (quantity <= 0) {
      toast({
        title: 'Ошибка',
        description: 'Количество должно быть больше 0',
        variant: 'destructive'
      });
      return;
    }

    if (quantity > maxQuantity) {
      toast({
        title: 'Ошибка',
        description: `Максимальное количество: ${maxQuantity}`,
        variant: 'destructive'
      });
      return;
    }

    setIsAdding(true);
    try {
      await addBookingItem({
        bookingId: groupedBooking.id,
        productId: selectedProductId,
        quantity,
        price: selectedProduct.price
      });

      toast({
        title: 'Успех',
        description: `Продукт "${selectedProduct.title}" добавлен в заказ`
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error adding product to booking:', error);
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось добавить продукт в заказ',
        variant: 'destructive'
      });
    } finally {
      setIsAdding(false);
    }
  };

  const isFormValid = selectedProduct && quantity > 0 && quantity <= maxQuantity;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Добавить продукт в заказ</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Продукт</label>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Загрузка продуктов...</span>
              </div>
            ) : availableProducts?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  Нет доступных продуктов для добавления
                </p>
              </div>
            ) : (
              <ProductCombobox
                products={availableProducts || []}
                value={selectedProductId}
                onValueChange={setSelectedProductId}
                placeholder="Поиск и выбор продукта..."
                disabled={isLoading}
              />
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Количество</label>
            <QuantitySelector
              quantity={quantity}
              onQuantityChange={setQuantity}
              maxQuantity={maxQuantity}
              minQuantity={1}
              disabled={!selectedProduct}
            />
            {selectedProduct && quantity > maxQuantity && (
              <p className="text-sm text-destructive mt-1">
                Максимальное доступное количество: {maxQuantity}
              </p>
            )}
          </div>

          <div className="bg-muted/30 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Стоимость:</span>
              <span className="font-medium">
                {totalPrice.toLocaleString()} ₽
              </span>
            </div>
            {selectedProduct && (
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-muted-foreground">
                  {selectedProduct.price.toLocaleString()} ₽ × {quantity}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isAdding}
            >
              Отмена
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!isFormValid || isAdding}
              className="flex-1"
            >
              {isAdding ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Добавление...
                </>
              ) : (
                'Добавить'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
