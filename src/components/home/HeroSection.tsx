
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookingCalendar } from '@/components/BookingCalendar';
import { BookingPeriod } from '@/types/product';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export const HeroSection = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleBookingChange = (bookingData: BookingPeriod) => {
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
  );
};
