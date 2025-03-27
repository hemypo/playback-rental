
import { XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ActiveFiltersProps {
  activeFilters: string[];
  onClearFilters: () => void;
}

const ActiveFilters = ({ activeFilters, onClearFilters }: ActiveFiltersProps) => {
  if (activeFilters.length === 0) {
    return null;
  }
  
  return (
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
          onClick={onClearFilters}
        >
          <XIcon className="h-3 w-3 mr-1" />
          Очистить
        </Button>
      </div>
    </div>
  );
};

export default ActiveFilters;
