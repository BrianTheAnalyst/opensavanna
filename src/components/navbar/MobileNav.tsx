
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut } from 'lucide-react';
import { UserType } from '@/types/user';

interface MobileNavProps {
  user: UserType | null;
  isAdmin: boolean;
  signOut: () => void;
  getInitial: () => string;
  isActive: (path: string) => boolean;
}

const MobileNav: React.FC<MobileNavProps> = ({ user, isAdmin, signOut, getInitial, isActive }) => {
  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Datasets', path: '/datasets' },
    { label: 'Entities', path: '/entities' },
    { label: 'Insights', path: '/insights' },
    { label: 'API', path: '/api' },
    { label: 'About', path: '/about' }
  ];

  return (
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
            {navItems.map(item => <Link key={item.path} to={item.path} className={`px-2 py-2 text-md rounded-md transition ${isActive(item.path) ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-primary/5'}`}>
                {item.label}
              </Link>)}
            <Link to="/upload" className="px-2 py-2 text-md rounded-md transition hover:bg-primary/5">
              Upload Dataset
            </Link>
            {isAdmin && <Link to="/admin/verification" className="px-2 py-2 text-md rounded-md transition hover:bg-primary/5 flex items-center">
                <span>Verify Datasets</span>
                <Badge variant="secondary" className="ml-2 text-xs">Admin</Badge>
              </Link>}
          </nav>
          
          <div className="mt-auto pb-8 pt-4">
            {user ? <div className="space-y-3">
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
              </div> : <Link to="/auth">
                <Button className="w-full">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
