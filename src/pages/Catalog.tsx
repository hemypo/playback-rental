import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { FilterIcon, SearchIcon, SlidersIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ProductCard from '@/components/ProductCard';
import { BookingCalendar } from '@/components/BookingCalendar';
import AnimatedTransition from '@/components/AnimatedTransition';
import * as supabaseService from '@/services/supabaseService';
import { BookingPeriod } from '@/types/product';
import { toast } from '@/hooks/use-toast';
import { formatDateRange } from '@/utils/dateUtils';

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [dateFilterActive, setDateFilterActive] = useState(false);
  
  // Get categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => supabaseService.getCategories(),
  });
  
  // Get products with filters
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', search, category, startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      if (startDate && endDate) {
        // If dates are selected, get available products for that period
        return supabaseService.getAvailableProducts(startDate, endDate);
      } else {
        // Otherwise, get all products with category/search filters
        return supabaseService.getProducts();
      }
    },
  });
  
  // Update search params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    setSearchParams(params, { replace: true });
    
    // Calculate active filters for display
    const filters = [];
    if (search) filters.push(`Search: ${search}`);
    if (category) filters.push(`Category: ${category}`);
    if (startDate && endDate) {
      filters.push(`Период: ${formatDateRange(startDate, endDate)}`);
      setDateFilterActive(true);
    } else {
      setDateFilterActive(false);
    }
    setActiveFilters(filters);
  }, [search, category, startDate, endDate, setSearchParams]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const searchInput = (document.getElementById('search-input') as HTMLInputElement)?.value;
    setSearch(searchInput || '');
    setFiltersOpen(false);
  };
  
  const handleCategoryChange = (value: string) => {
    setCategory(value === 'all' ? '' : value);
    setFiltersOpen(false);
  };
  
  const handleDateChange = (booking: BookingPeriod) => {
    setStartDate(booking.startDate);
    setEndDate(booking.endDate);
    setFiltersOpen(false);
    
    toast({
      title: "Период аренды выбран",
      description: `${formatDateRange(booking.startDate, booking.endDate)}`,
    });
  };
  
  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setStartDate(undefined);
    setEndDate(undefined);
    setSearchParams({});
  };
  
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-primary/90 to-primary py-20 px-4">
        <div className="container mx-auto">
          <h1 className="heading-1 text-white mb-6">Каталог техники</h1>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <form onSubmit={handleSubmit}>
                <Input
                  id="search-input"
                  placeholder="Search equipment..."
                  className="pl-10 bg-white/90 border-0 h-12"
                  defaultValue={search}
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Button type="submit" className="sr-only">Поиск</Button>
              </form>
            </div>
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 h-12">
                  <FilterIcon className="mr-2 h-5 w-5" />
                  Фильтры
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full max-w-md glass-panel">
                <SheetHeader>
                  <SheetTitle>Фильтр</SheetTitle>
                </SheetHeader>
                <div className="py-6 space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Категории</h3>
                    <Select value={category || 'all'} onValueChange={handleCategoryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все категории</SelectItem>
                        {categories?.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Диапазон дат</h3>
                    <BookingCalendar 
                      onBookingChange={handleDateChange}
                    />
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={clearFilters}
                  >
                    Очистить
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        {/* Active filters */}
        {activeFilters.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium">Фильтры:</span>
              {activeFilters.map((filter, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {filter}
                </Badge>
              ))}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2" 
                onClick={clearFilters}
              >
                <XIcon className="h-3 w-3 mr-1" />
                Очистить
              </Button>
            </div>
          </div>
        )}
        
        {/* Date selection info */}
        {dateFilterActive && (
          <div className="mb-8 p-4 bg-secondary/20 rounded-lg">
            <p className="text-sm">
              Showing equipment available from <span className="font-medium">{startDate?.toLocaleDateString()}, {startDate?.getHours()}:00</span> to <span className="font-medium">{endDate?.toLocaleDateString()}, {endDate?.getHours()}:00</span>
            </p>
          </div>
        )}
        
        {/* Products grid */}
        <AnimatedTransition show={true} type="fade">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse h-80 rounded-xl bg-muted"></div>
              ))}
            </div>
          ) : products?.length === 0 ? (
            <div className="text-center py-16">
              <SlidersIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-2xl font-medium mb-2">Ничего не найдено</h3>
              <p className="text-muted-foreground mb-6">
                Попробуйте настроить свой поиск или фильтры, чтобы найти то, что вы ищете.  
              </p>
              <Button onClick={clearFilters}>Очистить</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products?.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  selectedStartDate={startDate}
                  selectedEndDate={endDate}
                />
              ))}
            </div>
          )}
        </AnimatedTransition>
      </div>
    </div>
  );
};

export default Catalog;
