
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  CalendarIcon, 
  CheckIcon, 
  ClockIcon, 
  Edit2Icon, 
  ListIcon, 
  PackageIcon, 
  SearchIcon, 
  ShieldIcon, 
  UsersIcon 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import BitrixService, { BookingPeriod } from '@/services/bitrixService';
import { Product } from '@/components/ProductCard';
import { formatDateRange } from '@/utils/dateUtils';

// Mock data for bookings
const MOCK_BOOKINGS: (BookingPeriod & { 
  id: string;
  customerName: string;
  productName: string;
})[] = [
  {
    id: 'b1',
    productId: '1',
    productName: 'Professional DSLR Camera',
    customerId: 'user1',
    customerName: 'John Doe',
    startDate: new Date(2023, 10, 15, 10, 0),
    endDate: new Date(2023, 10, 17, 18, 0),
    status: 'confirmed',
  },
  {
    id: 'b2',
    productId: '3',
    productName: 'Professional Video Lighting Kit',
    customerId: 'user2',
    customerName: 'Jane Smith',
    startDate: new Date(2023, 10, 20, 9, 0),
    endDate: new Date(2023, 10, 21, 17, 0),
    status: 'pending',
  },
  {
    id: 'b3',
    productId: '2',
    productName: 'Drone with 4K Camera',
    customerId: 'user3',
    customerName: 'Mike Johnson',
    startDate: new Date(2023, 10, 12, 14, 0),
    endDate: new Date(2023, 10, 14, 10, 0),
    status: 'completed',
  },
];

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Fetch all products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: () => BitrixService.getProducts(),
  });
  
  // Filter bookings based on search term and status
  const filteredBookings = MOCK_BOOKINGS.filter(booking => {
    const matchesSearch = 
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.productName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Confirmed</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="heading-2 mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard 
          title="Total Equipment" 
          value={products?.length.toString() || '...'}
          icon={<PackageIcon className="h-6 w-6 text-primary" />}
          trend="+3 this month"
        />
        <DashboardCard 
          title="Active Bookings" 
          value="8"
          icon={<CalendarIcon className="h-6 w-6 text-green-500" />}
          trend="+5% vs last month"
        />
        <DashboardCard 
          title="Customers" 
          value="42"
          icon={<UsersIcon className="h-6 w-6 text-blue-500" />}
          trend="+2 this week"
        />
        <DashboardCard 
          title="Revenue" 
          value="$2,458"
          icon={<ShieldIcon className="h-6 w-6 text-purple-500" />}
          trend="+12% vs last month"
        />
      </div>
      
      <Tabs defaultValue="bookings" className="w-full">
        <TabsList className="grid grid-cols-3 max-w-md mb-8">
          <TabsTrigger value="bookings">
            <ListIcon className="h-4 w-4 mr-2" />
            Bookings
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <PackageIcon className="h-4 w-4 mr-2" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Calendar
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Manage Bookings</CardTitle>
              <CardDescription>
                View and manage all equipment bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Search bookings..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Equipment</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No bookings found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.id}</TableCell>
                          <TableCell>{booking.customerName}</TableCell>
                          <TableCell>{booking.productName}</TableCell>
                          <TableCell className="text-sm">
                            {formatDateRange(booking.startDate, booking.endDate)}
                          </TableCell>
                          <TableCell>{getStatusBadge(booking.status)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit2Icon className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Equipment Inventory</CardTitle>
              <CardDescription>
                Manage your equipment catalog
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-6">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search equipment..." className="pl-10" />
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productsLoading ? (
                      Array(5).fill(0).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={6}>
                            <div className="h-8 bg-muted rounded animate-pulse"></div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      products?.map((product: Product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.id}</TableCell>
                          <TableCell>{product.title}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>${product.price.toFixed(2)}</TableCell>
                          <TableCell>
                            {product.available ? (
                              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">In Stock</Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Unavailable</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit2Icon className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Booking Calendar</CardTitle>
              <CardDescription>
                Visualize equipment availability and bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16">
                <CalendarIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Calendar View Coming Soon</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  We're working on a comprehensive calendar view to help you manage your equipment bookings more efficiently.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, trend }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-semibold">{value}</h3>
            {trend && (
              <p className="text-xs text-green-600 mt-1">
                <span className="inline-block mr-1">
                  <CheckIcon className="h-3 w-3" />
                </span>
                {trend}
              </p>
            )}
          </div>
          <div className="p-3 rounded-full bg-primary/10">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Admin;
