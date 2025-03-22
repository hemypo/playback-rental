
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  CheckIcon, 
  ClockIcon, 
  PackageIcon, 
  TagIcon 
} from 'lucide-react';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnimatedTransition from '@/components/AnimatedTransition';
import { BookingCalendar } from '@/components/BookingCalendar';
import PricingCalculator from '@/components/PricingCalculator';
import BitrixService, { BookingPeriod } from '@/services/bitrixService';
import { formatDateRange } from '@/utils/dateUtils';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<{ startDate?: Date; endDate?: Date }>({});
  const [addingToCart, setAddingToCart] = useState(false);

  // Fetch product details
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => BitrixService.getProductById(id || ''),
    onError: () => navigate('/catalog'),
  });

  // Fetch product bookings
  const { data: bookings } = useQuery({
    queryKey: ['bookings', id],
    queryFn: () => BitrixService.getProductBookings(id || ''),
    enabled: !!id,
  });

  const handleBookingChange = (bookingPeriod: { startDate: Date; endDate: Date }) => {
    setBooking(bookingPeriod);
  };

  const handleAddToCart = () => {
    if (!booking.startDate || !booking.endDate || !product) return;
    
    setAddingToCart(true);
    
    // Simulate adding to cart
    setTimeout(() => {
      setAddingToCart(false);
      // In a real app, this would add the item to the cart
      // and redirect to checkout or stay on page
      navigate('/checkout');
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="heading-2 mb-4">Product Not Found</h2>
        <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/catalog">Back to Catalog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/catalog">Catalog</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>{product.title}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <AnimatedTransition show={true} type="fade" className="relative aspect-[4/3] rounded-xl overflow-hidden subtle-ring">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${product.imageUrl})` }}
            ></div>
            
            <Badge 
              variant="secondary" 
              className="absolute top-4 left-4 bg-white/90 text-black font-medium"
            >
              {product.category}
            </Badge>
            
            {!product.available && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <Badge variant="destructive" className="px-4 py-2 text-base">Currently Unavailable</Badge>
              </div>
            )}
          </AnimatedTransition>

          {/* Product Details & Booking */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-3">
                <TagIcon className="h-3 w-3 mr-1" />
                {product.category}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-semibold mb-2">{product.title}</h1>
              <p className="text-xl mb-4">
                <span className="font-semibold">${product.price}</span>
                <span className="text-muted-foreground">/day</span>
              </p>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <Separator />

            <div className="space-y-6">
              <h3 className="text-lg font-medium">Book This Equipment</h3>
              
              <BookingCalendar
                onBookingChange={handleBookingChange}
                bookedPeriods={bookings?.map(b => ({ startDate: b.startDate, endDate: b.endDate }))}
              />

              {booking.startDate && booking.endDate && (
                <PricingCalculator
                  basePrice={product.price}
                  startDate={booking.startDate}
                  endDate={booking.endDate}
                />
              )}

              <Button 
                size="lg"
                className="w-full"
                disabled={!product.available || !booking.startDate || !booking.endDate || addingToCart}
                onClick={handleAddToCart}
              >
                {addingToCart ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {booking.startDate && booking.endDate ? 'Book Now' : 'Select Dates'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <Tabs defaultValue="details">
            <TabsList className="mb-8">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl glass-card">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10">
                      <PackageIcon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-medium">Rental Includes</h3>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                      <span>Carrying case</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                      <span>Basic accessories</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                      <span>User manual</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                      <span>Technical support</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-6 rounded-xl glass-card">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10">
                      <ClockIcon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-medium">Rental Pricing</h3>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="text-muted-foreground">4 hours:</span>
                      <span className="font-medium">${(product.price * 0.7).toFixed(2)}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-muted-foreground">1 day:</span>
                      <span className="font-medium">${product.price.toFixed(2)}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-muted-foreground">3+ days:</span>
                      <span className="font-medium">${(product.price * 0.9).toFixed(2)}/day</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-muted-foreground">5+ days:</span>
                      <span className="font-medium">${(product.price * 0.7).toFixed(2)}/day</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-6 rounded-xl glass-card">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-medium">Availability</h3>
                  </div>
                  {product.available ? (
                    <div className="text-green-600 font-medium flex items-center gap-2 mb-4">
                      <CheckIcon className="h-4 w-4" />
                      <span>Available for Rental</span>
                    </div>
                  ) : (
                    <div className="text-red-500 font-medium mb-4">Currently Unavailable</div>
                  )}
                  
                  <div className="text-sm text-muted-foreground">
                    {bookings && bookings.length > 0 ? (
                      <div>
                        <p className="mb-2">Upcoming bookings:</p>
                        <ul className="space-y-2">
                          {bookings.slice(0, 3).map((booking: BookingPeriod, index: number) => (
                            <li key={index} className="text-xs bg-secondary p-2 rounded">
                              {formatDateRange(booking.startDate, booking.endDate)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p>No upcoming bookings.</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-xl glass-card">
                <h3 className="font-medium mb-4">Description</h3>
                <p className="text-muted-foreground">
                  {product.description}
                </p>
                <p className="text-muted-foreground mt-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget felis fermentum, 
                  hendrerit metus ac, malesuada nisl. Nullam elementum venenatis massa, eget finibus tellus
                  cursus at. Donec aliquam enim id dui imperdiet, sed fringilla sapien condimentum.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="specifications">
              <div className="p-6 rounded-xl glass-card">
                <h3 className="font-medium mb-6">Technical Specifications</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-3">General</h4>
                    <ul className="space-y-3">
                      <li className="flex justify-between pb-2 border-b border-border">
                        <span className="text-muted-foreground">Brand</span>
                        <span className="font-medium">Premium Tech</span>
                      </li>
                      <li className="flex justify-between pb-2 border-b border-border">
                        <span className="text-muted-foreground">Model</span>
                        <span className="font-medium">X-2000</span>
                      </li>
                      <li className="flex justify-between pb-2 border-b border-border">
                        <span className="text-muted-foreground">Year</span>
                        <span className="font-medium">2023</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-3">Physical</h4>
                    <ul className="space-y-3">
                      <li className="flex justify-between pb-2 border-b border-border">
                        <span className="text-muted-foreground">Weight</span>
                        <span className="font-medium">1.2 kg</span>
                      </li>
                      <li className="flex justify-between pb-2 border-b border-border">
                        <span className="text-muted-foreground">Dimensions</span>
                        <span className="font-medium">15 x 10 x 8 cm</span>
                      </li>
                      <li className="flex justify-between pb-2 border-b border-border">
                        <span className="text-muted-foreground">Color</span>
                        <span className="font-medium">Black</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="availability">
              <div className="p-6 rounded-xl glass-card">
                <h3 className="font-medium mb-6">Availability Calendar</h3>
                
                {product.available ? (
                  <div className="space-y-6">
                    <p className="text-muted-foreground">
                      This equipment is currently available for rental. Check the calendar below to see
                      booked dates. Gray dates are unavailable.
                    </p>
                    
                    <div className="max-w-md mx-auto">
                      <BookingCalendar
                        onBookingChange={handleBookingChange}
                        bookedPeriods={bookings?.map(b => ({ startDate: b.startDate, endDate: b.endDate }))}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CalendarIcon className="h-8 w-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Currently Unavailable</h3>
                    <p className="text-muted-foreground mb-6">
                      This equipment is not available for rental at the moment.
                    </p>
                    <Button asChild>
                      <Link to="/catalog">Browse Alternative Options</Link>
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
