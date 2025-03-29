
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Calendar, 
  ClipboardList, 
  Users, 
  LogOut
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { logout, getCurrentUser } from '@/services/apiService';

// Create local tab content components instead of importing the full pages
const DashboardTab = () => (
  <div>
    <h2 className="text-2xl font-semibold mb-6">Дашборд</h2>
    <p className="text-muted-foreground mb-4">
      Для просмотра полной статистики перейдите на страницу дашборда.
    </p>
    <Button asChild>
      <Link to="/admin/dashboard">Открыть полный дашборд</Link>
    </Button>
  </div>
);

const ProductsTab = () => (
  <div>
    <h2 className="text-2xl font-semibold mb-6">Товары</h2>
    <p className="text-muted-foreground mb-4">
      Для полного управления товарами перейдите на страницу товаров.
    </p>
    <Button asChild>
      <Link to="/admin/products">Управление товарами</Link>
    </Button>
  </div>
);

const BookingsTab = () => (
  <div>
    <h2 className="text-2xl font-semibold mb-6">Заявки</h2>
    <p className="text-muted-foreground mb-4">
      Для полного управления заявками перейдите на страницу заявок.
    </p>
    <Button asChild>
      <Link to="/admin/bookings">Управление заявками</Link>
    </Button>
  </div>
);

const CalendarTab = () => (
  <div>
    <h2 className="text-2xl font-semibold mb-6">Календарь</h2>
    <p className="text-muted-foreground mb-4">
      Для полного управления календарем перейдите на страницу календаря.
    </p>
    <Button asChild>
      <Link to="/admin/calendar">Открыть календарь</Link>
    </Button>
  </div>
);

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border hidden md:block fixed h-full top-16 left-0 overflow-y-auto z-30">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-1">Админ-панель</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Управление сайтом проката
          </p>
          
          <nav className="space-y-1">
            <NavLink 
              to="/admin/dashboard" 
              icon={<LayoutDashboard className="h-5 w-5" />}
              active={activeTab === 'dashboard'}
              onClick={() => setActiveTab('dashboard')}
            >
              Дашборд
            </NavLink>
            <NavLink 
              to="/admin/products" 
              icon={<Package className="h-5 w-5" />}
              active={activeTab === 'products'}
              onClick={() => setActiveTab('products')}
            >
              Товары
            </NavLink>
            <NavLink 
              to="/admin/bookings" 
              icon={<ClipboardList className="h-5 w-5" />}
              active={activeTab === 'bookings'}
              onClick={() => setActiveTab('bookings')}
            >
              Заявки
            </NavLink>
            <NavLink 
              to="/admin/calendar" 
              icon={<Calendar className="h-5 w-5" />}
              active={activeTab === 'calendar'}
              onClick={() => setActiveTab('calendar')}
            >
              Календарь
            </NavLink>
          </nav>
        </div>
        
        <div className="absolute bottom-0 w-64 p-6 border-t border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{user?.username || 'Администратор'}</p>
              <p className="text-xs text-muted-foreground">Админ</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Выйти
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 bg-background md:ml-64">
        <div className="p-6">
          <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
            <div className="md:hidden mb-6">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="dashboard">
                  <LayoutDashboard className="h-5 w-5" />
                </TabsTrigger>
                <TabsTrigger value="products">
                  <Package className="h-5 w-5" />
                </TabsTrigger>
                <TabsTrigger value="bookings">
                  <ClipboardList className="h-5 w-5" />
                </TabsTrigger>
                <TabsTrigger value="calendar">
                  <Calendar className="h-5 w-5" />
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="dashboard">
              <DashboardTab />
            </TabsContent>
            
            <TabsContent value="products">
              <ProductsTab />
            </TabsContent>
            
            <TabsContent value="bookings">
              <BookingsTab />
            </TabsContent>
            
            <TabsContent value="calendar">
              <CalendarTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

// Navigation link component
interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const NavLink = ({ to, icon, active, onClick, children }: NavLinkProps) => {
  return (
    <button
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm transition-colors ${
        active 
          ? 'bg-primary text-primary-foreground' 
          : 'text-foreground hover:bg-secondary'
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
};

export default Admin;
