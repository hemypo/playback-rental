import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  FileSpreadsheet,
  MoreHorizontal,
  Eye,
  Calendar,
  Phone,
  Mail,
  Clock3
} from 'lucide-react';
import { getBookings, getProducts, updateBookingStatus } from '@/services/apiService';
import { BookingPeriod, Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

const AdminBookings = () => {
  const [selectedBooking, setSelectedBooking] = useState<BookingPeriod | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [statusChange, setStatusChange] = useState<{
    booking: BookingPeriod | null;
    newStatus: BookingPeriod['status'] | null;
  }>({ booking: null, newStatus: null });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const queryClient = useQueryClient();

  // Fetch bookings and products
  const { data: bookings, isLoading: isLoadingBookings } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: () => getBookings()
  });

  const { data: products } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => getProducts()
  });

  // Status update mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingPeriod['status'] }) => 
      updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast({
        title: 'Статус обновлен',
        description: 'Статус заявки успешно изменен',
      });
    }
  });

  // Filter bookings based on search term
  const filteredBookings = bookings?.filter(booking => 
    booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.customerPhone.includes(searchQuery)
  );

  // Get product details by ID
  const getProductDetails = (productId: string): Product | undefined => {
    return products?.find(product => product.id === productId);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Подтверждено
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            В ожидании
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Отменено
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Check className="h-3 w-3 mr-1" />
            Завершено
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            {status}
          </Badge>
        );
    }
  };

  // View booking details
  const viewBookingDetails = (booking: BookingPeriod) => {
    setSelectedBooking(booking);
    setShowBookingDialog(true);
  };

  // Update booking status
  const handleStatusUpdate = (id: string, status: BookingPeriod['status']) => {
    updateStatusMutation.mutate({ id, status });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Заявки</h1>
          <p className="text-muted-foreground">
            Управление заявками на бронирование
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute left-0 top-0 h-9 w-9 border-0"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Поиск по имени, email, телефону..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-[300px]"
            />
          </div>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-bookings'] })}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {isLoadingBookings ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredBookings?.length === 0 ? (
        <div className="text-center p-8">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Заявки не найдены</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery 
              ? 'Попробуйте изменить поисковый запрос'
              : 'У вас пока нет заявок на бронирование'
            }
          </p>
        </div>
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Клиент</TableHead>
                <TableHead>Товар</TableHead>
                <TableHead>Даты</TableHead>
                <TableHead className="text-right">Сумма</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings?.map((booking) => {
                const product = getProductDetails(booking.productId);
                return (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.customerName}</div>
                        <div className="text-sm text-muted-foreground">{booking.customerPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {product ? (
                        <div className="flex items-center gap-2">
                          {product.imageUrl && (
                            <div 
                              className="w-8 h-8 rounded bg-center bg-cover"
                              style={{ backgroundImage: `url(${product.imageUrl})` }}
                            />
                          )}
                          <div className="font-medium truncate max-w-[150px]">{product.title}</div>
                        </div>
                      ) : (
                        <div className="text-muted-foreground">Товар не найден</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {format(new Date(booking.startDate), 'dd.MM.yyyy')} - {format(new Date(booking.endDate), 'dd.MM.yyyy')}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {booking.totalPrice.toLocaleString()} ₽
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(booking.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => viewBookingDetails(booking)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Детали
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                              disabled={booking.status === 'confirmed'}
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Подтвердить
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusUpdate(booking.id, 'completed')}
                              disabled={booking.status === 'completed'}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Завершить
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                              disabled={booking.status === 'cancelled'}
                              className="text-red-600"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Отменить
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Booking Details Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Детали заявки</DialogTitle>
            <DialogDescription>
              Подробная информация о заявке на бронирование
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Клиент</h3>
                  <p className="text-muted-foreground">{selectedBooking.customerName}</p>
                  <p className="text-muted-foreground">{selectedBooking.customerEmail}</p>
                  <p className="text-muted-foreground">{selectedBooking.customerPhone}</p>
                </div>
                <div>
                  {getStatusBadge(selectedBooking.status)}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium">Товар</h3>
                {(() => {
                  const product = getProductDetails(selectedBooking.productId);
                  return product ? (
                    <div className="flex items-center gap-3 mt-2">
                      {product.imageUrl && (
                        <div 
                          className="w-12 h-12 rounded bg-center bg-cover"
                          style={{ backgroundImage: `url(${product.imageUrl})` }}
                        />
                      )}
                      <div>
                        <p className="font-medium">{product.title}</p>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Товар не найден</p>
                  );
                })()}
              </div>
              
              <div>
                <h3 className="font-medium">Период аренды</h3>
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Начало</p>
                    <p>{format(new Date(selectedBooking.startDate), 'dd.MM.yyyy, HH:mm')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Окончание</p>
                    <p>{format(new Date(selectedBooking.endDate), 'dd.MM.yyyy, HH:mm')}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium">Стоимость</h3>
                <p className="text-xl font-semibold">{selectedBooking.totalPrice.toLocaleString()} ₽</p>
              </div>
              
              {selectedBooking.notes && (
                <div>
                  <h3 className="font-medium">Примечания</h3>
                  <p className="text-muted-foreground">{selectedBooking.notes}</p>
                </div>
              )}
              
              <div>
                <h3 className="font-medium">Информация о заявке</h3>
                <p className="text-sm text-muted-foreground">
                  Создано: {format(new Date(selectedBooking.createdAt), 'dd.MM.yyyy, HH:mm')}
                </p>
              </div>
              
              <DialogFooter className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      handleStatusUpdate(selectedBooking.id, 'confirmed');
                      setShowBookingDialog(false);
                    }}
                    disabled={selectedBooking.status === 'confirmed'}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Подтвердить
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleStatusUpdate(selectedBooking.id, 'cancelled');
                      setShowBookingDialog(false);
                    }}
                    disabled={selectedBooking.status === 'cancelled'}
                    className="text-red-600"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Отменить
                  </Button>
                </div>
                <Button 
                  variant="default"
                  size="sm"
                  onClick={() => setShowBookingDialog(false)}
                >
                  Закрыть
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBookings;
