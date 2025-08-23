
import { useState, useEffect } from 'react';

import { fetchPendingDatasetCount } from '@/services/datasetVerificationService';

/**
 * Hook that provides the count of datasets pending verification
 * and allows refreshing the count
 */
export const useDatasetPendingCount = (
  autoRefreshInterval?: number
): { count: number; isLoading: boolean; refresh: () => Promise<void> } => {
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCount = async () => {
    setIsLoading(true);
    try {
      const pendingCount = await fetchPendingDatasetCount();
      setCount(pendingCount);
    } catch (error) {
      console.error('Error fetching pending dataset count:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCount();

    // Set up auto-refresh if interval is provided
    let intervalId: number | undefined;
    if (autoRefreshInterval && autoRefreshInterval > 0) {
      intervalId = window.setInterval(fetchCount, autoRefreshInterval);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [autoRefreshInterval]);

  return {
    count,
    isLoading,
    refresh: fetchCount
  };
};
