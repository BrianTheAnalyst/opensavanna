
import { useState, useEffect } from 'react';

import { isUserAdmin } from '@/services/userRoleService';

/**
 * Custom hook that checks if the current user has admin privileges
 * Result is cached to prevent unnecessary API calls
 */
export const useIsAdmin = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      setIsLoading(true);
      try {
        const adminStatus = await isUserAdmin();
        setIsAdmin(adminStatus);
        setError(null);
      } catch (err) {
        console.error('Error checking admin status:', err);
        setError(err instanceof Error ? err : new Error('Failed to check admin status'));
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  return { isAdmin, isLoading, error };
};
