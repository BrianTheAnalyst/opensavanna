
import { useEffect } from 'react';

// Hook to fix Leaflet marker icons in production builds
export function useLeafletIconFix() {
  useEffect(() => {
    // This is needed to properly display markers in Leaflet when using webpack/vite
    delete (window as any)._leaflet_id;
    
    const L = require('leaflet');
    
    delete L.Icon.Default.prototype._getIconUrl;
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);
}
