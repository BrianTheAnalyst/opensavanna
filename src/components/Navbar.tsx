import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Search, Menu, X, Upload } from 'lucide-react';
import { AuthButton } from './AuthButton';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${
        isScrolled 
          ? 'glass border-b border-border/50 py-3 shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="container px-4 mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-primary font-medium">
          <svg 
            className="w-8 h-8" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M12 2L2 7L12 12L22 7L12 2Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M2 17L12 22L22 17" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M2 12L12 17L22 12" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-xl tracking-tight">OpenSavanna</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`text-sm font-medium hover:text-primary transition-colors ${
              location.pathname === '/' ? 'text-primary' : 'text-foreground/80'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/datasets" 
            className={`text-sm font-medium hover:text-primary transition-colors ${
              location.pathname.includes('/datasets') ? 'text-primary' : 'text-foreground/80'
            }`}
          >
            Datasets
          </Link>
          <Link 
            to="/api" 
            className={`text-sm font-medium hover:text-primary transition-colors ${
              location.pathname === '/api' ? 'text-primary' : 'text-foreground/80'
            }`}
          >
            API
          </Link>
          <Link 
            to="/about" 
            className={`text-sm font-medium hover:text-primary transition-colors ${
              location.pathname === '/about' ? 'text-primary' : 'text-foreground/80'
            }`}
          >
            About
          </Link>
          {/* Add link to entities in the navigation menu */}
          <Link to="/entities" className="text-foreground hover:text-foreground/80 transition-colors">
            Entities
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-foreground/80">
            <Search className="h-5 w-5" />
          </Button>
          <Link to="/upload">
            <Button variant="default" className="rounded-full px-4 py-2">
              <Upload className="mr-2 h-4 w-4" />
              Upload Data
            </Button>
          </Link>
          <AuthButton />
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-foreground/80 hover:text-primary"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 glass animate-fade-in z-40">
          <div className="flex flex-col p-4 pt-8">
            <Link 
              to="/" 
              className={`py-3 px-4 text-lg font-medium ${
                location.pathname === '/' ? 'text-primary' : 'text-foreground/80'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/datasets" 
              className={`py-3 px-4 text-lg font-medium ${
                location.pathname.includes('/datasets') ? 'text-primary' : 'text-foreground/80'
              }`}
            >
              Datasets
            </Link>
            <Link 
              to="/api" 
              className={`py-3 px-4 text-lg font-medium ${
                location.pathname === '/api' ? 'text-primary' : 'text-foreground/80'
              }`}
            >
              API
            </Link>
            <Link 
              to="/about" 
              className={`py-3 px-4 text-lg font-medium ${
                location.pathname === '/about' ? 'text-primary' : 'text-foreground/80'
              }`}
            >
              About
            </Link>
            <div className="mt-6 p-4 flex flex-col space-y-4">
              <Link to="/upload">
                <Button className="w-full rounded-full py-6">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Data
                </Button>
              </Link>
              <div className="w-full">
                <AuthButton />
              </div>
            </div>
            <div className="mt-2 p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search datasets..." 
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-background border border-border"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
