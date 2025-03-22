
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import Bitrix24Service from '@/services/bitrix24Service';

interface BitrixIntegrationProps {
  showControls?: boolean;
}

const BitrixIntegration = ({ showControls = true }: BitrixIntegrationProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Получаем список товаров из Битрикс24
  const { data: products } = useQuery({
    queryKey: ['bitrix-products'],
    queryFn: () => Bitrix24Service.getProducts(),
  });

  // Имитация создания сделки в Битрикс24
  const handleCreateDeal = async () => {
    try {
      setIsLoading(true);
      
      // Создаем тестовый контакт
      const contact = await Bitrix24Service.createContact({
        name: 'Иван',
        lastName: 'Иванов',
        email: 'ivan@example.com',
        phone: '+7 (999) 123-45-67'
      });
      
      // Создаем тестовую сделку
      const deal = await Bitrix24Service.createDeal({
        title: 'Тестовая сделка из приложения',
        contactId: contact.id,
        products: products ? [products[0].id] : [],
        value: 199.99
      });
      
      toast({
        title: 'Сделка создана',
        description: `ID сделки: ${deal.id}`,
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать сделку в Битрикс24',
        variant: 'destructive',
      });
      console.error('Ошибка при создании сделки:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Интеграция с Битрикс24</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Подключенные товары</p>
              <p className="font-medium">{products ? products.length : 0} товаров</p>
            </div>
            {showControls && (
              <Button 
                onClick={handleCreateDeal} 
                disabled={isLoading}
                className="ml-4"
              >
                {isLoading ? 'Создание...' : 'Создать тестовую сделку'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BitrixIntegration;
