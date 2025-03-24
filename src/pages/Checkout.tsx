
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  PackageIcon, 
  ShieldCheckIcon, 
  TrashIcon, 
  UserIcon 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useCart } from '@/hooks/use-cart';
import { formatDateRange } from '@/utils/dateUtils';
import { toast } from '@/hooks/use-toast';

const Checkout = () => {
  const { items, removeItem, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  
  // Calculate totals
  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const total = subtotal;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCheckout = () => {
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast({
        title: "Заполните все поля",
        description: "Пожалуйста, заполните все обязательные поля формы",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setOrderComplete(true);
      clearCart(); // Clear cart after successful checkout
    }, 2000);
  };
  
  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <ShieldCheckIcon className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-center">Бронирование подтверждено!</h1>
        <p className="text-xl text-center text-muted-foreground mb-8 max-w-md">
         Ваш прокат оборудования подтвержден. Вскоре вы получите электронное письмо с подтверждением бронирования.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link to="/catalog">Вернуться к каталогу</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center mb-8">
        <Link to="/catalog" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Вернуться к каталогу
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-8">Корзина</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Ваша корзина</CardTitle>
              <CardDescription>Проверьте ваш заказ перед оформлением</CardDescription>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="text-center py-10">
                  <PackageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">Ваша корзина пуста</h3>
                  <p className="text-muted-foreground mb-6">
                  Похоже, вы еще не добавили какое-либо оборудование в свою корзину.
                  </p>
                  <Button asChild>
                    <Link to="/catalog">Просмотр каталога</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 subtle-ring">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{item.title}</h3>
                        {item.startDate && item.endDate && (
                          <p className="text-sm text-muted-foreground mb-2">
                            <CalendarIcon className="inline-block h-3 w-3 mr-1" />
                            {formatDateRange(item.startDate, item.endDate)}
                          </p>
                        )}
                        <div className="flex justify-between items-center">
                          <p className="font-medium">${item.price.toFixed(2)}</p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Детали аренды</CardTitle>
              <CardDescription>Заполните информацию о вашем бронировании</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Имя</label>
                    <Input 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Фамилия</label>
                    <Input 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">E-mail</label>
                  <Input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Телефон</label>
                  <Input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Ваш заказ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-muted-foreground">{item.title}</span>
                  <span>${item.price.toFixed(2)}</span>
                </div>
              ))}
              
              <Separator />
              
              <div className="flex justify-between text-lg font-semibold">
                <span>Стоимость:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleCheckout}
                disabled={loading || items.length === 0}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Отправка...
                  </>
                ) : (
                  'Бронирование подтверждено'
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
