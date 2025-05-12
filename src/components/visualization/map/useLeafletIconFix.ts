
import { useEffect } from 'react';
import L from 'leaflet';

/**
 * This hook fixes the issue with Leaflet marker icons when using webpack
 * and adds required plugins like the heatmap layer
 */
export const useLeafletIconFix = () => {
  useEffect(() => {
    // Fix marker icons
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
    });
    
    // Load the heat layer plugin if it doesn't exist
    if (!L.heatLayer) {
      console.log('Loading heatmap plugin for Leaflet...');
      
      // Simple implementation of heatmap layer if the plugin is not loaded
      // This is a fallback and should be replaced with a proper import of leaflet.heat
      (L as any).heatLayer = function(latlngs: any[], options: any) {
        const opts = options || {};
        
        // Create a simple rendering using circle markers
        const layer = L.featureGroup();
        
        latlngs.forEach(point => {
          const lat = point[0];
          const lng = point[1];
          const intensity = point.length >= 3 ? point[2] : 0.5;
          
          // Determine color based on intensity
          let color;
          if (opts.gradient) {
            const keys = Object.keys(opts.gradient).map(Number).sort((a, b) => a - b);
            for (let i = 0; i < keys.length; i++) {
              if (intensity <= keys[i]) {
                color = opts.gradient[keys[i]];
                break;
              }
            }
            if (!color) {
              color = opts.gradient[keys[keys.length - 1]];
            }
          } else {
            // Default color gradient
            if (intensity < 0.33) color = 'blue';
            else if (intensity < 0.66) color = 'yellow';
            else color = 'red';
          }
          
          // Create circle with size and opacity proportional to intensity
          const radius = opts.radius || 25;
          const circle = L.circleMarker([lat, lng], {
            radius: radius * Math.sqrt(intensity),
            fillColor: color,
            color: 'none',
            fillOpacity: 0.6,
            className: 'heat-point'
          });
          
          layer.addLayer(circle);
        });
        
        return layer;
      };
    }
    
  }, []);
};
