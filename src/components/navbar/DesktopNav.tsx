
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger,
  navigationMenuTriggerStyle 
} from "@/components/ui/navigation-menu";

interface DesktopNavProps {
  isAdmin: boolean;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ isAdmin }) => {
  const location = useLocation();
  
  // Is active link
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
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
            <NavigationMenuTrigger className={cn(location.pathname.includes('/datasets') ? 'text-primary' : '')}>
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
                {isAdmin && <li>
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
                  </li>}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <Link to="/entities">
              <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), isActive('/entities') ? 'text-primary' : '')}>
                Entities
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <Link to="/insights">
              <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), isActive('/insights') ? 'text-primary' : '')}>
                <BarChart2 className="h-4 w-4 mr-1" />
                Insights
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <Link to="/about">
              <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), isActive('/about') ? 'text-primary' : '')}>
                About
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <Link to="/api">
              <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), isActive('/api') ? 'text-primary' : '')}>
                API
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default DesktopNav;
