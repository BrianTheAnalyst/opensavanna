
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, LogIn, LogOut, User, BarChart2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { hasUserRole } from '@/services/userRoleService';
import { useEffect, useState } from 'react';
import { Badge } from './ui/badge';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check if current user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const admin = await hasUserRole('admin');
        setIsAdmin(admin);
      } else {
        setIsAdmin(false);
      }
    };
    
    checkAdmin();
  }, [user]);
  
  // Create initial for avatar
  const getInitial = () => {
    if (!user || !user.email) return '?';
    return user.email.charAt(0).toUpperCase();
  };
  
  // Is active link
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  // Navigation items
  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Datasets', path: '/datasets' },
    { label: 'Entities', path: '/entities' },
    { label: 'Insights', path: '/insights' },
    { label: 'API', path: '/api' },
    { label: 'About', path: '/about' },
  ];
  
  // Main content
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 mr-4">
            <div className="bg-gradient-to-r from-primary to-primary/80 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">A</div>
            <span className="font-medium text-lg hidden md:block">AfriData Commons</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()} active={isActive('/')}>
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger active={location.pathname.includes('/datasets')}>
                    Datasets
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4">
                      <li className="row-span-3">
                        <Link to="/datasets">
                          <NavigationMenuLink className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Dataset Library
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Explore our comprehensive collection of African datasets
                            </p>
                          </NavigationMenuLink>
                        </Link>
                      </li>
                      <li>
                        <Link to="/upload">
                          <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Upload Dataset</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Contribute your own data to the commons
                            </p>
                          </NavigationMenuLink>
                        </Link>
                      </li>
                      {isAdmin && (
                        <li>
                          <Link to="/admin/verification">
                            <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="flex items-center">
                                <span className="text-sm font-medium leading-none">Verify Datasets</span>
                                <Badge variant="secondary" className="ml-2 text-xs">Admin</Badge>
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Review and verify submitted datasets
                              </p>
                            </NavigationMenuLink>
                          </Link>
                        </li>
                      )}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/entities">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()} active={isActive('/entities')}>
                      Entities
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/insights">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()} active={isActive('/insights')}>
                      <BarChart2 className="h-4 w-4 mr-1" />
                      Insights
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/about">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()} active={isActive('/about')}>
                      About
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/api">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()} active={isActive('/api')}>
                      API
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          {/* Auth menu */}
          <div className="flex items-center space-x-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getInitial()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem disabled>
                    <User className="mr-2 h-4 w-4" />
                    <span>{user.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <Link to="/upload">
                    <DropdownMenuItem>
                      Upload Dataset
                    </DropdownMenuItem>
                  </Link>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <Link to="/admin/verification">
                        <DropdownMenuItem>
                          Dataset Verification
                        </DropdownMenuItem>
                      </Link>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
            
            {/* Mobile menu button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <div className="flex flex-col h-full">
                  <div className="py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2">
                      <div className="bg-gradient-to-r from-primary to-primary/80 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">A</div>
                      <span className="font-medium text-lg">AfriData</span>
                    </Link>
                  </div>
                  
                  <nav className="flex flex-col mt-4 space-y-3">
                    {navItems.map((item) => (
                      <Link 
                        key={item.path} 
                        to={item.path}
                        className={`px-2 py-2 text-md rounded-md transition ${
                          isActive(item.path) 
                            ? 'bg-primary/10 text-primary font-medium' 
                            : 'hover:bg-primary/5'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <Link 
                      to="/upload"
                      className="px-2 py-2 text-md rounded-md transition hover:bg-primary/5"
                    >
                      Upload Dataset
                    </Link>
                    {isAdmin && (
                      <Link 
                        to="/admin/verification"
                        className="px-2 py-2 text-md rounded-md transition hover:bg-primary/5 flex items-center"
                      >
                        <span>Verify Datasets</span>
                        <Badge variant="secondary" className="ml-2 text-xs">Admin</Badge>
                      </Link>
                    )}
                  </nav>
                  
                  <div className="mt-auto pb-8 pt-4">
                    {user ? (
                      <div className="space-y-3">
                        <div className="flex items-center px-2 py-1">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarFallback>{getInitial()}</AvatarFallback>
                          </Avatar>
                          <div className="text-sm truncate">{user.email}</div>
                        </div>
                        <Button variant="outline" className="w-full" onClick={signOut}>
                          <LogOut className="h-4 w-4 mr-2" />
                          Log out
                        </Button>
                      </div>
                    ) : (
                      <Link to="/auth">
                        <Button className="w-full">
                          <LogIn className="h-4 w-4 mr-2" />
                          Sign In
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
