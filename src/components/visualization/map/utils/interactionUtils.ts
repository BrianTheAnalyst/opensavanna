
import L from 'leaflet';
import { formatPropertiesForDisplay } from './formatUtils';

// Function to handle interaction with GeoJSON features
export const onEachFeature = (feature: any, layer: any) => {
  if (feature.properties) {
    // Store reference to the feature collection for min/max calculations
    if (feature && layer._source && layer._source.features) {
      feature.parent = layer._source;
    }
    
    // Create a popup with formatted properties
    const popupContent = formatPropertiesForDisplay(feature.properties);
    layer.bindPopup(popupContent, {
      maxWidth: 300,
      className: 'feature-popup'
    });
    
    // Add hover highlighting with professional styling
    layer.on({
      mouseover: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          weight: 2,
          color: '#ffffff',
          dashArray: '',
          fillOpacity: 0.8
        });
        
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
          layer.bringToFront();
        }
      },
      mouseout: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          weight: 1,
          opacity: 0.8,
          color: '#555',
          fillOpacity: 0.6
        });
      },
      click: (e: any) => {
        // Could add additional click behavior here
      }
    });
  }
};

// Helper function to determine if a feature should be highlighted
export const shouldHighlightFeature = (feature: any, highlightedProperty?: string, highlightedValue?: any): boolean => {
  if (!feature.properties || !highlightedProperty || highlightedValue === undefined) {
    return false;
  }
  
  return feature.properties[highlightedProperty] === highlightedValue;
};

// Removed duplicate exports at the end to fix the TypeScript errors
