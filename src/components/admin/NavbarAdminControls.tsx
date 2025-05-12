
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isUserAdmin } from '@/services/userRoleService';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';
import AdminNotificationBadge from './AdminNotificationBadge';

const NavbarAdminControls = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const adminStatus = await isUserAdmin();
      setIsAdmin(adminStatus);
    };

    checkAdmin();
  }, []);

  if (!isAdmin) return null;

  return (
    <div className="flex items-center gap-2">
      <AdminNotificationBadge />
      
      <Link to="/admin/verification">
        <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" />
          <span>Admin Dashboard</span>
        </Button>
      </Link>
    </div>
  );
};

export default NavbarAdminControls;
