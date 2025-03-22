import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import BitrixService from '@/services/bitrixService';
import { useToast } from "@/hooks/use-toast";
import AnimatedTransition from '@/components/AnimatedTransition';

const Index = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', search, category],
    queryFn: () => BitrixService.getProducts({ search, category }),
    meta: {
      onError: (err: Error) => {
        console.error("Error fetching products:", err);
        toast({
          title: "Error",
          description: "Failed to load products. Please try again later.",
          variant: "destructive",
        });
      }
    }
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: BitrixService.getCategories,
    meta: {
      onError: (err: Error) => {
        console.error("Error fetching categories:", err);
        toast({
          title: "Error",
          description: "Failed to load categories. Please try again later.",
          variant: "destructive",
        });
      }
    }
  });

  useEffect(() => {
    if (error) {
      console.error('Error fetching products:', error);
    }
  }, [error]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Equipment Rental</h1>

      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <Input
            type="text"
            placeholder="Search for equipment..."
            value={search}
            onChange={handleSearch}
            className="mr-2"
          />
          <select
            value={category}
            onChange={handleCategoryChange}
            className="border rounded px-4 py-2"
          >
            <option value="">All Categories</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
        <Button onClick={() => navigate('/admin')}>Admin Dashboard</Button>
      </div>

      {isLoading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <AnimatedTransition show={true} type="fade">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products?.map(item => (
              <div key={item.id} onClick={() => handleProductClick(item.id)}>
                <ProductCard product={item} />
              </div>
            ))}
          </div>
        </AnimatedTransition>
      )}
    </div>
  );
};

export default Index;
