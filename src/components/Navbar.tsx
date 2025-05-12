
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import NavbarAdminControls from './admin/NavbarAdminControls';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoggedIn, user, signOut } = useAuth();
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const AuthButton = () => {
    if (isLoggedIn) {
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email || "User Avatar"} />
            <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <Button variant="outline" size="sm" onClick={signOut}>Sign Out</Button>
        </div>
      );
    } else {
      return <Link to="/auth"><Button variant="outline" size="sm">Sign In</Button></Link>;
    }
  };
  
  return (
    <header className="w-full fixed top-0 z-50 backdrop-blur-lg border-b border-border/40 bg-background/80">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Logo />
          <span className="font-bold text-xl">OpenSavanna</span>
        </Link>
        
        <nav className="hidden lg:flex gap-6 mx-6">
          <Link to="/datasets" className="hover:text-primary transition-colors">Datasets</Link>
          <Link to="/api" className="hover:text-primary transition-colors">API</Link>
          <Link to="/about" className="hover:text-primary transition-colors">About</Link>
          <Link to="/upload" className="hover:text-primary transition-colors">Upload</Link>
        </nav>
        
        <div className="flex items-center gap-4 ml-auto">
          <NavbarAdminControls />
          <AuthButton />
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-2/3 md:w-1/3">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Explore the platform.
                </SheetDescription>
              </SheetHeader>
              <nav className="grid gap-4 text-lg font-medium">
                <Link to="/datasets" className="hover:text-primary transition-colors">Datasets</Link>
                <Link to="/api" className="hover:text-primary transition-colors">API</Link>
                <Link to="/about" className="hover:text-primary transition-colors">About</Link>
                <Link to="/upload" className="hover:text-primary transition-colors">Upload</Link>
                <Link to="/auth" className="hover:text-primary transition-colors">Auth</Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-background border-b border-border/40 shadow-md">
          <nav className="container mx-auto px-4 py-2 flex flex-col gap-4">
            <Link to="/datasets" className="hover:text-primary transition-colors">Datasets</Link>
            <Link to="/api" className="hover:text-primary transition-colors">API</Link>
            <Link to="/about" className="hover:text-primary transition-colors">About</Link>
            <Link to="/upload" className="hover:text-primary transition-colors">Upload</Link>
            <Link to="/auth" className="hover:text-primary transition-colors">Auth</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
