
import { useState, useEffect } from 'react';
import { CalendarIcon, ClockIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { formatDateRange, getBusinessHoursOptions } from '@/utils/dateUtils';
import { toast } from '@/hooks/use-toast';

interface DateFilterPopoverProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onDateRangeChange: (start: Date | undefined, end: Date | undefined) => void;
}

const DateFilterPopover = ({
  startDate,
  endDate,
  onDateRangeChange,
}: DateFilterPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(startDate ? new Date(startDate) : undefined);
  const [startTime, setStartTime] = useState<string | undefined>(startDate ? startDate.getHours().toString() : undefined);
  const [endTime, setEndTime] = useState<string | undefined>(endDate ? endDate.getHours().toString() : undefined);
  
  // Business hours for time selection
  const businessHours = { open: 8, close: 22 };
  const timeOptions = getBusinessHoursOptions(businessHours);
  
  // Reset local state when props change
  useEffect(() => {
    if (startDate) {
      setSelectedDate(new Date(startDate));
      setStartTime(startDate.getHours().toString());
    } else {
      setSelectedDate(undefined);
      setStartTime(undefined);
    }
    
    if (endDate) {
      setEndTime(endDate.getHours().toString());
    } else {
      setEndTime(undefined);
    }
  }, [startDate, endDate]);
  
  const handleApply = () => {
    if (!selectedDate || !startTime || !endTime) {
      return;
    }
    
    const startHour = parseInt(startTime);
    const endHour = parseInt(endTime);
    
    if (startHour >= endHour) {
      toast({
        variant: "destructive",
        title: "Ошибка выбора времени",
        description: "Время окончания должно быть позже времени начала",
      });
      return;
    }
    
    const start = new Date(selectedDate);
    start.setHours(startHour, 0, 0, 0);
    
    const end = new Date(selectedDate);
    end.setHours(endHour, 0, 0, 0);
    
    onDateRangeChange(start, end);
    setIsOpen(false);
  };
  
  const handleClear = () => {
    setSelectedDate(undefined);
    setStartTime(undefined);
    setEndTime(undefined);
    onDateRangeChange(undefined, undefined);
    setIsOpen(false);
  };
  
  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    
    // Reset times when date changes
    if (date) {
      setStartTime(businessHours.open.toString());
      setEndTime((businessHours.open + 4).toString()); // Default to 4 hour rental
    } else {
      setStartTime(undefined);
      setEndTime(undefined);
    }
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-white/10 text-white border-white/20 hover:bg-white/20 h-12"
        >
          <CalendarIcon className="mr-2 h-5 w-5" />
          {startDate && endDate ? formatDateRange(startDate, endDate) : "Выбрать время"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 space-y-4">
          <h3 className="font-medium">Выберите дату и время</h3>
          
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateChange}
            disabled={(date) => date < new Date()}
            className="rounded-md border"
          />
          
          {selectedDate && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Время аренды</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">С</label>
                  <select 
                    className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  >
                    <option value="">Выберите</option>
                    {timeOptions.map((option) => (
                      <option key={`start-${option.value}`} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-xs text-muted-foreground">До</label>
                  <select 
                    className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  >
                    <option value="">Выберите</option>
                    {timeOptions.map((option) => (
                      <option key={`end-${option.value}`} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="pt-2 flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleClear}
                >
                  Очистить
                </Button>
                <Button 
                  className="flex-1"
                  disabled={!startTime || !endTime}
                  onClick={handleApply}
                >
                  Применить
                </Button>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateFilterPopover;
