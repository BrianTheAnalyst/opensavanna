
import { useMemo } from 'react';

export interface RegionConfig {
  id: string;
  name: string;
}

export const useMapRegions = (data: any[]): RegionConfig[] => {
  return useMemo(() => {
    const regions = new Set<string>();
    data.forEach(item => {
      if (item.region) regions.add(item.region);
    });
    
    if (regions.size > 0) {
      return Array.from(regions).map(region => ({ 
        id: region.toLowerCase().replace(/\s+/g, '_'), 
        name: region 
      }));
    }
    
    return [
      { id: 'north', name: 'Northern Region' },
      { id: 'south', name: 'Southern Region' },
      { id: 'east', name: 'Eastern Region' },
      { id: 'west', name: 'Western Region' },
      { id: 'central', name: 'Central Area' }
    ];
  }, [data]);
};
