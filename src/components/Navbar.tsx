
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { hasUserRole } from '@/services/userRoleService';

// Import components
import NavLogo from './navbar/NavLogo';
import DesktopNav from './navbar/DesktopNav';
import UserMenu from './navbar/UserMenu';
import MobileNav from './navbar/MobileNav';

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <NavLogo />
          <DesktopNav isAdmin={isAdmin} />
          
          <div className="flex items-center space-x-2">
            <UserMenu 
              user={user}
              isAdmin={isAdmin}
              signOut={signOut}
              getInitial={getInitial}
            />
            
            <MobileNav 
              user={user}
              isAdmin={isAdmin}
              signOut={signOut}
              getInitial={getInitial}
              isActive={isActive}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
