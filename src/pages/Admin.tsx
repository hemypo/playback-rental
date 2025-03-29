
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Calendar, 
  ClipboardList, 
  Users, 
  LogOut
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { logout, getCurrentUser, getBookings, getProducts } from '@/services/apiService';
import { useQuery } from '@tanstack/react-query';
import AdminDashboard from './AdminDashboard';
import AdminCalendar from './admin/AdminCalendar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { BookingPeriod, Product } from '@/types/product';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const user = getCurrentUser();

  // Fetch bookings and products data
  const { data: bookings, isLoading: isLoadingBookings } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: getBookings
  });

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['admin-products'],
    queryFn: getProducts
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Function to get product title by ID
  const getProductTitle = (productId: string): string => {
    const product = products?.find((p: Product) => p.id === productId);
    return product ? product.title : 'Неизвестный товар';
  };

  // Function to format booking status
  const formatStatus = (status: string): { label: string; variant: "default" | "destructive" | "outline" | "secondary" | "success" | "warning" | null | undefined } => {
    switch (status) {
      case 'confirmed':
        return { label: 'Подтверждено', variant: 'success' };
      case 'pending':
        return { label: 'В ожидании', variant: 'warning' };
      case 'cancelled':
        return { label: 'Отменено', variant: 'destructive' };
      case 'completed':
        return { label: 'Завершено', variant: 'secondary' };
      default:
        return { label: status, variant: 'outline' };
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border hidden md:block fixed h-full top-16 left-0 overflow-y-auto z-30">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-1">Админ-панель</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Управление сайтом проката
          </p>
          
          <nav className="space-y-1">
            <NavLink 
              to="#dashboard" 
              icon={<LayoutDashboard className="h-5 w-5" />}
              active={activeTab === 'dashboard'}
              onClick={() => setActiveTab('dashboard')}
            >
              Дашборд
            </NavLink>
            <NavLink 
              to="#products" 
              icon={<Package className="h-5 w-5" />}
              active={activeTab === 'products'}
              onClick={() => setActiveTab('products')}
            >
              Товары
            </NavLink>
            <NavLink 
              to="#bookings" 
              icon={<ClipboardList className="h-5 w-5" />}
              active={activeTab === 'bookings'}
              onClick={() => setActiveTab('bookings')}
            >
              Заявки
            </NavLink>
            <NavLink 
              to="#calendar" 
              icon={<Calendar className="h-5 w-5" />}
              active={activeTab === 'calendar'}
              onClick={() => setActiveTab('calendar')}
            >
              Календарь
            </NavLink>
          </nav>
        </div>
        
        <div className="absolute bottom-0 w-64 p-6 border-t border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{user?.username || 'Администратор'}</p>
              <p className="text-xs text-muted-foreground">Админ</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Выйти
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 bg-background md:ml-64">
        <div className="p-6">
          <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
            <div className="md:hidden mb-6">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="dashboard">
                  <LayoutDashboard className="h-5 w-5" />
                </TabsTrigger>
                <TabsTrigger value="products">
                  <Package className="h-5 w-5" />
                </TabsTrigger>
                <TabsTrigger value="bookings">
                  <ClipboardList className="h-5 w-5" />
                </TabsTrigger>
                <TabsTrigger value="calendar">
                  <Calendar className="h-5 w-5" />
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="dashboard">
              <AdminDashboard />
            </TabsContent>
            
            <TabsContent value="products">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">Управление товарами</h1>
                    <p className="text-muted-foreground">
                      Просмотр и редактирование товаров
                    </p>
                  </div>
                  <Button>Добавить товар</Button>
                </div>

                {isLoadingProducts ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : products && products.length > 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Список товаров</CardTitle>
                      <CardDescription>Всего товаров: {products.length}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Фото</TableHead>
                            <TableHead>Название</TableHead>
                            <TableHead>Категория</TableHead>
                            <TableHead>Цена</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead>Действия</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {products.map((product: Product) => (
                            <TableRow key={product.id}>
                              <TableCell>
                                {product.imageUrl && (
                                  <div 
                                    className="w-12 h-12 rounded bg-center bg-cover"
                                    style={{ backgroundImage: `url(${product.imageUrl})` }}
                                  />
                                )}
                              </TableCell>
                              <TableCell className="font-medium">{product.title}</TableCell>
                              <TableCell>{product.category}</TableCell>
                              <TableCell>{product.price.toLocaleString()} ₽</TableCell>
                              <TableCell>
                                <Badge variant={product.available ? "success" : "destructive"}>
                                  {product.available ? 'Доступен' : 'Недоступен'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm">Редактировать</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-center py-12 bg-muted/30 rounded-md">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-1">Нет товаров</h3>
                    <p className="text-muted-foreground mb-4">Добавьте первый товар в систему</p>
                    <Button>Добавить товар</Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="bookings">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">Управление заявками</h1>
                    <p className="text-muted-foreground">
                      Просмотр и редактирование заявок на бронирование
                    </p>
                  </div>
                  <Button>Создать заявку</Button>
                </div>

                {isLoadingBookings ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : bookings && bookings.length > 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Список заявок</CardTitle>
                      <CardDescription>Всего заявок: {bookings.length}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Клиент</TableHead>
                            <TableHead>Товар</TableHead>
                            <TableHead>Период</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead>Сумма</TableHead>
                            <TableHead>Действия</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bookings.map((booking: BookingPeriod) => (
                            <TableRow key={booking.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{booking.customerName}</div>
                                  <div className="text-sm text-muted-foreground">{booking.customerPhone}</div>
                                </div>
                              </TableCell>
                              <TableCell>{getProductTitle(booking.productId)}</TableCell>
                              <TableCell>
                                <div>
                                  {format(new Date(booking.startDate), 'dd MMM', { locale: ru })} {format(new Date(booking.startDate), 'HH:mm')}
                                </div>
                                <div>
                                  {format(new Date(booking.endDate), 'dd MMM', { locale: ru })} {format(new Date(booking.endDate), 'HH:mm')}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={formatStatus(booking.status).variant}>
                                  {formatStatus(booking.status).label}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium">{booking.totalPrice.toLocaleString()} ₽</TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  <Button variant="outline" size="sm">Изменить</Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-center py-12 bg-muted/30 rounded-md">
                    <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-1">Нет заявок</h3>
                    <p className="text-muted-foreground mb-4">Заявки на бронирование будут отображаться здесь</p>
                    <Button>Создать заявку</Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="calendar">
              <AdminCalendar />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

// Navigation link component
interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const NavLink = ({ to, icon, active, onClick, children }: NavLinkProps) => {
  return (
    <button
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm transition-colors ${
        active 
          ? 'bg-primary text-primary-foreground' 
          : 'text-foreground hover:bg-secondary'
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
};

export default Admin;
