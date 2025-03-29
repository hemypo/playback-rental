
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRightIcon, CameraIcon, MonitorIcon, PackageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { getProducts, getCategories } from '@/services/apiService';
import { BookingCalendar } from '@/components/BookingCalendar';
import { BookingPeriod } from '@/types/product';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const Index = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [booking, setBooking] = useState<BookingPeriod>();

  const { data: featuredProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: () => getProducts(),
    select: (data) => data.slice(0, 4),
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  });

  const handleBookingChange = (bookingData: BookingPeriod) => {
    setBooking(bookingData);
    setStartDate(bookingData.startDate);
    setEndDate(bookingData.endDate);
  };

  const handleSearchClick = () => {
    if (startDate && endDate) {
      navigate('/catalog', { 
        state: { 
          startDate, 
          endDate 
        } 
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen max-h-[800px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/70 to-black/40"></div>
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('public/BG.svg')" 
          }}
        ></div>
        
        <div className="container relative z-10 px-4 py-16 mx-auto">
          <div className="max-w-xl">
            <h1 className="heading-1 text-white mb-6">Playback Rental</h1>
            <p className="text-xl text-white/90 mb-8">
              Современная и профессиональная фото- и видеотехника, включая новейшие модели и классические решения, доступные для аренды на гибких и выгодных условиях.
            </p>
            
            <div className="w-full glass-panel p-4 rounded-xl">
              <h2 className="text-lg font-medium mb-3">Найдите доступное оборудование</h2>
              
              <div className="flex flex-wrap items-center gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="flex-grow md:flex-grow-0 bg-white/90 text-foreground min-w-[240px] justify-between h-10"
                    >
                      {startDate && endDate 
                        ? `${format(startDate, 'dd.MM.yyyy HH:00')} - ${format(endDate, 'dd.MM.yyyy HH:00')}`
                        : "Выберите дату и время"}
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2" align="start" sideOffset={5}>
                    <BookingCalendar
                      onBookingChange={handleBookingChange}
                      initialStartDate={startDate}
                      initialEndDate={endDate}
                      isCompact={true}
                    />
                  </PopoverContent>
                </Popover>
                
                {startDate && endDate && (
                  <Button 
                    className="flex-grow md:flex-grow-0 bg-primary text-primary-foreground hover:bg-primary/90" 
                    onClick={handleSearchClick}
                  >
                    Перейти в каталог
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center text-center mb-12">
            <span className="chip mb-3">Категории</span>
            <h2 className="heading-2 mb-4">Оборудование для любых нужд</h2>
            <p className="body-text max-w-2xl">
              Ознакомьтесь с нашим широким ассортиментом профессионального оборудования. Мы предлагаем новейшие технологии для фотосъемки, производства видео, аудиозаписи и многого другого.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="chip mb-3">Тщательно подобранный выбор</span>
              <h2 className="heading-2">Рекомендуемое оборудование</h2>
            </div>
            <Link to="/catalog">
              <Button variant="outline" className="group">
                Посмотреть все
                <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productsLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse h-72 rounded-xl bg-white"></div>
              ))
            ) : (
              featuredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center text-center mb-12">
            <span className="chip mb-3">Простой процесс</span>
            <h2 className="heading-2 mb-4">Как работает аренда</h2>
            <p className="body-text max-w-2xl">
              Аренда оборудования у нас - это простой и беспроблемный процесс. Выполните следующие действия, чтобы приобрести оборудование, необходимое для вашего следующего проекта.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Выберите оборудование",
                description: "Просмотрите наш обширный каталог и выберите оборудование, необходимое для вашего проекта.",
                icon: <PackageIcon className="h-8 w-8 text-primary" />,
              },
              {
                title: "Забронируйте даты",
                description: "Выберите предпочтительные даты получения и возврата в нашем календаре доступности.",
                icon: <CalendarIconComponent />,
              },
              {
                title: "Получите и создавайте",
                description: "Заберите оборудование в нашем пункте выдачи и приступайте к реализации своего проекта.",
                icon: <CameraIcon className="h-8 w-8 text-primary" />,
              },
            ].map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6 rounded-xl glass-card">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/90 to-primary text-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-2 mb-6">Готовы арендовать высококачественное оборудование?</h2>
            <p className="text-xl text-white/90 mb-8">
              Начните просматривать наш каталог прямо сейчас, чтобы найти идеальное оборудование для вашего проекта.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="default" asChild className="bg-white text-primary hover:bg-white/90">
                <Link to="/catalog">Каталог</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
                <Link to="/contact">Контакты</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Calendar icon component
const CalendarIconComponent = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="h-8 w-8 text-primary"
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

export default Index;
