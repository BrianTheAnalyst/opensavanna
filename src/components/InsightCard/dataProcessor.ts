
import { useMemo } from 'react';

export const useProcessedData = (data: any[], dataKey: string, nameKey: string = 'name') => {
  return useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.map(item => ({
      name: item[nameKey] || 'Unknown',
      value: typeof item[dataKey] === 'number' ? item[dataKey] : 0,
      ...item // Keep other properties
    }));
  }, [data, dataKey, nameKey]);
};
