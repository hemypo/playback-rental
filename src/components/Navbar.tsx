
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SearchIcon, MenuIcon, ShoppingCartIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import AnimatedTransition from './AnimatedTransition';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 py-4 px-4 md:px-8 transition-all duration-300 backdrop-blur-md',
        isScrolled ? 'bg-white/70 dark:bg-black/70 shadow-soft' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link 
            to="/" 
            className="text-xl font-semibold tracking-tight hover:opacity-80 transition-opacity"
          >
            RentalHub
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" active={isActive('/')}>Home</NavLink>
            <NavLink to="/catalog" active={isActive('/catalog')}>Catalog</NavLink>
            <NavLink to="/how-it-works" active={isActive('/how-it-works')}>How It Works</NavLink>
            <NavLink to="/contact" active={isActive('/contact')}>Contact</NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <AnimatedTransition
            show={isSearchOpen}
            type="slide-down"
            className="hidden md:flex items-center relative"
          >
            <Input 
              placeholder="Search equipment..." 
              className="w-60 bg-white/80 dark:bg-black/60 rounded-full pr-10"
              autoFocus={isSearchOpen}
            />
            <XIcon 
              className="absolute right-3 h-4 w-4 text-muted-foreground cursor-pointer" 
              onClick={() => setIsSearchOpen(false)}
            />
          </AnimatedTransition>

          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <SearchIcon className="h-5 w-5" />
          </Button>
          
          <Link to="/checkout">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 relative"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                0
              </span>
            </Button>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 md:hidden"
              >
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="glass-panel w-full max-w-xs">
              <div className="flex flex-col gap-8 mt-8">
                <Link to="/" className="text-xl font-semibold tracking-tight">RentalHub</Link>
                <nav className="flex flex-col space-y-6">
                  <Link to="/" className="text-foreground hover:text-primary transition-colors">Home</Link>
                  <Link to="/catalog" className="text-foreground hover:text-primary transition-colors">Catalog</Link>
                  <Link to="/how-it-works" className="text-foreground hover:text-primary transition-colors">How It Works</Link>
                  <Link to="/contact" className="text-foreground hover:text-primary transition-colors">Contact</Link>
                  <Link to="/admin" className="text-foreground hover:text-primary transition-colors">Admin</Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, active, children }) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "relative py-1 font-medium transition-colors", 
        active ? "text-foreground" : "text-foreground/70 hover:text-foreground"
      )}
    >
      {children}
      {active && (
        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full animate-in-up" />
      )}
    </Link>
  );
};

export default Navbar;
