
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BookingPeriod } from '@/types/product';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { 
  Check, 
  CheckCircle, 
  FileText, 
  MoreVertical, 
  RefreshCw, 
  Search, 
  X 
} from 'lucide-react';
import * as supabaseService from '@/services/supabaseService';

const AdminBookings = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingPeriod['status'] | 'all'>('all');
  const [selectedBooking, setSelectedBooking] = useState<BookingPeriod | null>(null);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // Fetch bookings
  const { data: bookings, refetch, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: supabaseService.getBookings,
  });

  // Filtered bookings
  const filteredBookings = React.useMemo(() => {
    if (!bookings) return [];

    let filtered = [...bookings];

    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.customerName.toLowerCase().includes(lowerSearch) ||
          booking.customerEmail.toLowerCase().includes(lowerSearch) ||
          booking.customerPhone.toLowerCase().includes(lowerSearch)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    return filtered;
  }, [bookings, search, statusFilter]);

  // Handlers
  const handleStatusUpdate = async (id: string, status: BookingPeriod['status']) => {
    try {
      await supabaseService.updateBookingStatus(id, status);
      toast({
        title: 'Success',
        description: 'Booking status updated successfully.',
      });
      refetch(); // Refresh bookings
      setOpen(false); // Close the modal
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update booking status.',
        variant: 'destructive',
      });
    }
  };

  const handleOpenChange = (booking: BookingPeriod) => {
    setSelectedBooking(booking);
    setOpen(true);
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Manage Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search bookings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-gray-100 border-gray-300 focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label htmlFor="status-filter" className="text-sm font-medium">
                Filter by Status:
              </label>
              <select
                id="status-filter"
                className="bg-gray-100 border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-primary focus:border-primary"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as BookingPeriod['status'] | 'all'
                  )
                }
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    <div className="flex items-center justify-center">
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      <span>Loading bookings...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No bookings found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.customerName}</TableCell>
                    <TableCell>{booking.customerEmail}</TableCell>
                    <TableCell>{booking.customerPhone}</TableCell>
                    <TableCell>
                      {format(new Date(booking.startDate), 'PPP')}
                    </TableCell>
                    <TableCell>
                      {format(new Date(booking.endDate), 'PPP')}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          booking.status === 'pending'
                            ? 'secondary'
                            : booking.status === 'confirmed'
                            ? 'default'
                            : booking.status === 'cancelled'
                            ? 'destructive'
                            : 'outline'
                        }
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleOpenChange(booking)}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Booking Details Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking ? (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Customer Information</h3>
                <p>
                  <strong>Name:</strong> {selectedBooking.customerName}
                </p>
                <p>
                  <strong>Email:</strong> {selectedBooking.customerEmail}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedBooking.customerPhone}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Booking Information</h3>
                <p>
                  <strong>Start Date:</strong>{' '}
                  {format(new Date(selectedBooking.startDate), 'PPP')}
                </p>
                <p>
                  <strong>End Date:</strong>{' '}
                  {format(new Date(selectedBooking.endDate), 'PPP')}
                </p>
                <p>
                  <strong>Total Price:</strong> ${selectedBooking.totalPrice}
                </p>
                {selectedBooking.notes && (
                  <p>
                    <strong>Notes:</strong> {selectedBooking.notes}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Update Status</h3>
                <div className="flex space-x-2">
                  {selectedBooking.status !== 'confirmed' && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleStatusUpdate(selectedBooking.id, 'confirmed')
                      }
                    >
                      Confirm
                      <Check className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                  {selectedBooking.status !== 'cancelled' && (
                    <Button
                      variant="destructive"
                      onClick={() =>
                        handleStatusUpdate(selectedBooking.id, 'cancelled')
                      }
                    >
                      Cancel
                      <X className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                  {selectedBooking.status !== 'completed' && (
                    <Button
                      variant="secondary"
                      onClick={() =>
                        handleStatusUpdate(selectedBooking.id, 'completed')
                      }
                    >
                      Complete
                      <CheckCircle className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>Loading...</div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBookings;
