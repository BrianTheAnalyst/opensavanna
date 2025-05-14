
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { isUserAdmin } from '@/services/userRoleService';
import { useDatasetPendingCount } from '@/hooks/useDatasetPendingCount';

const AdminNotificationBadge = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const { count: pendingCount, isLoading } = useDatasetPendingCount(30000); // Check every 30 seconds

  useEffect(() => {
    const checkAdminStatus = async () => {
      const adminStatus = await isUserAdmin();
      setIsAdmin(adminStatus);
    };

    checkAdminStatus();
  }, []);

  if (!isAdmin || (pendingCount === 0 && !isLoading)) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to="/admin/verification">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <Badge 
                className="absolute -top-1 -right-1 px-1.5 min-w-5 h-5 flex items-center justify-center bg-red-500" 
                variant="destructive"
              >
                {isLoading ? "..." : pendingCount}
              </Badge>
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>{pendingCount} dataset{pendingCount !== 1 ? 's' : ''} pending review</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AdminNotificationBadge;
