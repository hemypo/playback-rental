
import { useState, useEffect } from 'react';
import { FilterIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterDrawerProps {
  category: string;
  setCategory: (category: string) => void;
  categories: any[] | undefined;
  activeFilters: string[];
  onClearFilters: () => void;
}

const FilterDrawer = ({
  category,
  setCategory,
  categories,
  activeFilters,
  onClearFilters
}: FilterDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempCategory, setTempCategory] = useState(category || 'all');

  useEffect(() => {
    setTempCategory(category || 'all');
  }, [category]);

  const handleCategoryChange = (value: string) => {
    setTempCategory(value);
  };

  const handleApplyFilters = () => {
    setCategory(tempCategory === 'all' ? '' : tempCategory);
    setIsOpen(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-white/10 text-white border-white/20 hover:bg-white/20 h-12"
        >
          <FilterIcon className="mr-2 h-5 w-5" />
          Фильтры
          {activeFilters.length > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
              {activeFilters.length}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh] overflow-y-auto">
        <DrawerHeader>
          <DrawerTitle>Фильтры</DrawerTitle>
        </DrawerHeader>
        
        <div className="px-4 py-6 space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Категории</h3>
            <Select value={tempCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Все категории" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DrawerFooter className="flex flex-row justify-between gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onClearFilters}
          >
            <XIcon className="mr-2 h-4 w-4" />
            Очистить
          </Button>
          <Button 
            className="flex-1"
            onClick={handleApplyFilters}
          >
            Применить
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="flex-1">Закрыть</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default FilterDrawer;
