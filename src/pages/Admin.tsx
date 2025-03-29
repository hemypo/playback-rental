
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Calendar, 
  ClipboardList, 
  Users, 
  LogOut,
  FileUp,
  FileDown,
  Plus
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
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import * as supabaseService from '@/services/supabaseService';
import { Switch } from '@/components/ui/switch';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const user = getCurrentUser();
  const { toast } = useToast();

  // Product state
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productValues, setProductValues] = useState({
    title: '',
    description: '',
    price: 0,
    category: '',
    imageUrl: '',
    available: true,
    quantity: 1
  });

  // CSV state
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);
  const [csvContent, setCsvContent] = useState('');

  // Booking state
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingPeriod | null>(null);

  // Fetch bookings and products data
  const { data: bookings, isLoading: isLoadingBookings, refetch: refetchBookings } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: getBookings
  });

  const { data: products, isLoading: isLoadingProducts, refetch: refetchProducts } = useQuery({
    queryKey: ['admin-products'],
    queryFn: getProducts
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: supabaseService.getCategories
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
  const formatStatus = (status: string): { label: string; variant: "default" | "destructive" | "outline" | "secondary" } => {
    switch (status) {
      case 'confirmed':
        return { label: 'Подтверждено', variant: 'default' };
      case 'pending':
        return { label: 'В ожидании', variant: 'secondary' };
      case 'cancelled':
        return { label: 'Отменено', variant: 'destructive' };
      case 'completed':
        return { label: 'Завершено', variant: 'outline' };
      default:
        return { label: status, variant: 'outline' };
    }
  };

  // Product dialog handlers
  const openProductDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductValues({
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl,
        available: product.available,
        quantity: product.quantity
      });
    } else {
      setEditingProduct(null);
      setProductValues({
        title: '',
        description: '',
        price: 0,
        category: '',
        imageUrl: '',
        available: true,
        quantity: 1
      });
    }
    setProductDialogOpen(true);
  };

  const handleProductChange = (field: string, value: any) => {
    setProductValues((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProductSubmit = async () => {
    try {
      if (editingProduct) {
        // Update existing product
        await supabaseService.updateProduct(editingProduct.id, {
          title: productValues.title,
          description: productValues.description,
          price: productValues.price,
          category: productValues.category,
          imageUrl: productValues.imageUrl,
          available: productValues.available,
          quantity: productValues.quantity
        });
        toast({
          title: "Товар обновлен",
          description: "Товар успешно обновлен"
        });
      } else {
        // Create new product
        await supabaseService.createProduct({
          title: productValues.title,
          description: productValues.description,
          price: productValues.price,
          category: productValues.category,
          imageUrl: productValues.imageUrl,
          available: productValues.available,
          quantity: productValues.quantity
        });
        toast({
          title: "Товар добавлен",
          description: "Новый товар успешно добавлен"
        });
      }
      
      // Close dialog and refresh data
      setProductDialogOpen(false);
      refetchProducts();
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Произошла ошибка при сохранении товара",
        variant: "destructive"
      });
    }
  };

  // CSV handlers
  const handleExportCsv = async () => {
    try {
      const csvData = await supabaseService.exportProductsToCSV();
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      
      // Create and click a download link
      const a = document.createElement('a');
      a.href = url;
      a.download = 'products.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Экспорт выполнен",
        description: "Данные успешно экспортированы в CSV"
      });
    } catch (error: any) {
      toast({
        title: "Ошибка экспорта",
        description: error.message || "Произошла ошибка при экспорте данных",
        variant: "destructive"
      });
    }
  };

  const handleImportCsv = async () => {
    try {
      await supabaseService.importProductsFromCSV(csvContent);
      
      setCsvDialogOpen(false);
      setCsvContent('');
      refetchProducts();
      
      toast({
        title: "Импорт выполнен",
        description: "Данные успешно импортированы из CSV"
      });
    } catch (error: any) {
      toast({
        title: "Ошибка импорта",
        description: error.message || "Произошла ошибка при импорте данных",
        variant: "destructive"
      });
    }
  };

  // Booking handlers
  const openBookingDialog = (booking: BookingPeriod) => {
    setSelectedBooking(booking);
    setBookingDialogOpen(true);
  };

  const handleUpdateBookingStatus = async (id: string, status: string) => {
    try {
      await supabaseService.updateBookingStatus(id, status);
      refetchBookings();
      setBookingDialogOpen(false);
      
      toast({
        title: "Статус обновлен",
        description: "Статус заявки успешно обновлен"
      });
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Произошла ошибка при обновлении статуса",
        variant: "destructive"
      });
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
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setCsvDialogOpen(true)}>
                      <FileUp className="h-4 w-4 mr-2" />
                      Импорт CSV
                    </Button>
                    <Button variant="outline" onClick={handleExportCsv}>
                      <FileDown className="h-4 w-4 mr-2" />
                      Экспорт CSV
                    </Button>
                    <Button onClick={() => openProductDialog()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить товар
                    </Button>
                  </div>
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
                                <Badge variant={product.available ? "default" : "destructive"}>
                                  {product.available ? 'Доступен' : 'Недоступен'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm" onClick={() => openProductDialog(product)}>Редактировать</Button>
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
                    <Button onClick={() => openProductDialog()}>Добавить товар</Button>
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
                                  <Button variant="outline" size="sm" onClick={() => openBookingDialog(booking)}>Изменить</Button>
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

      {/* Product Dialog */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Редактировать товар' : 'Добавить новый товар'}</DialogTitle>
            <DialogDescription>
              Заполните все поля формы и нажмите Сохранить
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Название
              </Label>
              <Input
                id="title"
                value={productValues.title}
                onChange={(e) => handleProductChange('title', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Цена
              </Label>
              <Input
                id="price"
                type="number"
                value={productValues.price}
                onChange={(e) => handleProductChange('price', Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Категория
              </Label>
              <Select
                value={productValues.category}
                onValueChange={(value) => handleProductChange('category', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category: any) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-right">
                URL изображения
              </Label>
              <Input
                id="imageUrl"
                value={productValues.imageUrl}
                onChange={(e) => handleProductChange('imageUrl', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Количество
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={productValues.quantity}
                onChange={(e) => handleProductChange('quantity', Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="available" className="text-right">
                Доступен
              </Label>
              <div className="col-span-3 flex items-center">
                <Switch
                  id="available"
                  checked={productValues.available}
                  onCheckedChange={(checked) => handleProductChange('available', checked)}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right">
                Описание
              </Label>
              <Textarea
                id="description"
                value={productValues.description}
                onChange={(e) => handleProductChange('description', e.target.value)}
                className="col-span-3"
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductDialogOpen(false)}>Отмена</Button>
            <Button onClick={handleProductSubmit}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CSV Dialog */}
      <Dialog open={csvDialogOpen} onOpenChange={setCsvDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Импорт товаров из CSV</DialogTitle>
            <DialogDescription>
              Вставьте данные в формате CSV: id,title,description,price,category,imageurl,quantity,available
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              className="min-h-[300px]"
              placeholder="id,title,description,price,category,imageurl,quantity,available"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCsvDialogOpen(false)}>Отмена</Button>
            <Button onClick={handleImportCsv}>Импортировать</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Информация о бронировании</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-2">
                <h3 className="font-medium">Клиент</h3>
                <div className="bg-muted/30 p-3 rounded-md">
                  <p><strong>Имя:</strong> {selectedBooking.customerName}</p>
                  <p><strong>Телефон:</strong> {selectedBooking.customerPhone}</p>
                  <p><strong>Email:</strong> {selectedBooking.customerEmail}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <h3 className="font-medium">Товар</h3>
                <div className="bg-muted/30 p-3 rounded-md">
                  <p><strong>Название:</strong> {getProductTitle(selectedBooking.productId)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <h3 className="font-medium">Даты</h3>
                <div className="bg-muted/30 p-3 rounded-md">
                  <p><strong>Начало:</strong> {format(new Date(selectedBooking.startDate), 'dd.MM.yyyy HH:mm')}</p>
                  <p><strong>Конец:</strong> {format(new Date(selectedBooking.endDate), 'dd.MM.yyyy HH:mm')}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <h3 className="font-medium">Дополнительная информация</h3>
                <div className="bg-muted/30 p-3 rounded-md">
                  <p><strong>Статус:</strong> {formatStatus(selectedBooking.status).label}</p>
                  <p><strong>Сумма:</strong> {selectedBooking.totalPrice.toLocaleString()} ₽</p>
                  {selectedBooking.notes && <p><strong>Примечания:</strong> {selectedBooking.notes}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <h3 className="font-medium">Изменить статус</h3>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                    onClick={() => handleUpdateBookingStatus(selectedBooking.id, 'confirmed')}
                    disabled={selectedBooking.status === 'confirmed'}
                  >
                    Подтвердить
                  </Button>
                  <Button 
                    variant="outline"
                    className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200"
                    onClick={() => handleUpdateBookingStatus(selectedBooking.id, 'pending')}
                    disabled={selectedBooking.status === 'pending'}
                  >
                    Ожидание
                  </Button>
                  <Button 
                    variant="outline"
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                    onClick={() => handleUpdateBookingStatus(selectedBooking.id, 'completed')}
                    disabled={selectedBooking.status === 'completed'}
                  >
                    Завершить
                  </Button>
                  <Button 
                    variant="outline"
                    className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                    onClick={() => handleUpdateBookingStatus(selectedBooking.id, 'cancelled')}
                    disabled={selectedBooking.status === 'cancelled'}
                  >
                    Отменить
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setBookingDialogOpen(false)}>Закрыть</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
