
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProductById } from '@/services/supabaseService';
import { Button } from '@/components/ui/button';
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircleIcon,
  InfoIcon,
  ShieldIcon,
  ShoppingCartIcon,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { formatCurrency } from '@/utils/pricingUtils';
import { formatDateRange } from '@/utils/dateUtils';
import PricingCalculator from '@/components/PricingCalculator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/use-cart';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id || ''),
    enabled: !!id,
  });

  const addToCart = () => {
    if (!product) return;
    
    if (!dateRange.from || !dateRange.to) {
      toast({
        title: 'Выберите даты',
        description: 'Пожалуйста, выберите даты начала и окончания аренды',
        variant: 'destructive',
      });
      return;
    }
    
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
      startDate: dateRange.from,
      endDate: dateRange.to,
    });
    
    toast({
      title: 'Товар добавлен в корзину',
      description: `${product.title} добавлен в вашу корзину`,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen flex flex-col items-center justify-center">
        <InfoIcon className="h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Ошибка загрузки данных</h1>
        <p className="text-muted-foreground mb-6">
          Не удалось загрузить информацию о продукте
        </p>
        <Button asChild>
          <Link to="/catalog">Вернуться к каталогу</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center mb-8">
        <Link
          to="/catalog"
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Вернуться к каталогу
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          <div className="rounded-lg overflow-hidden subtle-ring mb-6">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="outline">{product.category}</Badge>
            {product.available ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircleIcon className="h-3 w-3 mr-1" /> Доступно
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Недоступно
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

          <div className="flex items-center gap-1 mb-6">
            <div className="text-2xl font-bold">{formatCurrency(product.price)}</div>
            <div className="text-muted-foreground">/ день</div>
          </div>

          <div className="prose dark:prose-invert mb-8 max-w-none">
            <p>{product.description}</p>
          </div>

          <Separator className="my-6" />

          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Выберите даты аренды</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DatePickerWithRange
                  date={dateRange}
                  setDate={setDateRange}
                  disabled={!product.available}
                  className="w-full"
                />
              </div>
              {dateRange.from && dateRange.to && (
                <div className="mt-2 text-sm flex items-center">
                  <CalendarIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                  <span>{formatDateRange(dateRange.from, dateRange.to)}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={addToCart}
                disabled={!product.available || !dateRange.from || !dateRange.to}
                className="flex-1"
              >
                <ShoppingCartIcon className="mr-2 h-4 w-4" />
                Добавить в корзину
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link to="/checkout">
                  Перейти к оформлению
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="pricing" className="w-full mb-12">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="pricing">Калькулятор стоимости</TabsTrigger>
          <TabsTrigger value="details">Детали</TabsTrigger>
        </TabsList>
        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>Калькулятор стоимости аренды</CardTitle>
              <CardDescription>
                Рассчитайте стоимость аренды на нужный вам период
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PricingCalculator price={product.price} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Подробная информация</CardTitle>
              <CardDescription>
                Технические характеристики и комплектация
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Технические характеристики</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Производитель: Canon</li>
                  <li>Модель: EOS 5D Mark IV</li>
                  <li>Разрешение: 30.4 МП</li>
                  <li>Тип матрицы: CMOS</li>
                  <li>Год выпуска: 2021</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Комплектация</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Камера</li>
                  <li>Объектив 24-70mm f/2.8</li>
                  <li>Аккумулятор (2 шт)</li>
                  <li>Зарядное устройство</li>
                  <li>Карта памяти 64GB</li>
                  <li>Сумка для переноски</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-start gap-2 text-muted-foreground">
              <ShieldIcon className="h-4 w-4" />
              <span className="text-sm">
                Всё оборудование проходит проверку перед отправкой клиенту
              </span>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDetail;
