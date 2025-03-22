
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AlertTriangleIcon, ArrowLeftIcon, HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangleIcon className="h-10 w-10 text-primary" />
        </div>
        
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
        Упс! Страница, которую вы ищете, не существует или была перемещена.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="default">
            <Link to="/">
              <HomeIcon className="mr-2 h-4 w-4" />
              Вернуться на главную
            </Link>
          </Button>
          
          <Button asChild size="lg" variant="outline">
            <Link to="/catalog">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Смотреть каталог
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
