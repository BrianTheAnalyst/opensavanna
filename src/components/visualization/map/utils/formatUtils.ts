
import { formatPropertyKey, formatPropertyValue } from './colorUtils';

// Function for handling GeoJSON feature interactions
export const onEachFeature = (feature: any, layer: any) => {
  if (feature.properties) {
    // Store reference to the feature collection for min/max calculations
    if (feature && layer._source && layer._source.features) {
      feature.parent = layer._source;
    }
    
    // Format properties for popup
    const popupContent = formatPropertiesForDisplay(feature.properties);
    layer.bindPopup(popupContent);
    
    // Add hover effect
    layer.on({
      mouseover: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          weight: 2,
          color: '#fff',
          dashArray: '',
          fillOpacity: 0.7
        });
        layer.bringToFront();
      },
      mouseout: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          weight: 1,
          color: '#fff',
          dashArray: '',
          fillOpacity: 0.5
        });
      }
    });
  }
};

// Format properties for display in popup
export const formatPropertiesForDisplay = (properties: Record<string, any>): string => {
  if (!properties) return 'No data available';
  
  // Skip internal properties and prioritize important ones
  const skipProperties = ['id', 'gid', 'fid', 'objectid', 'shape_area', 'shape_length'];
  const priorityProperties = ['name', 'country', 'region', 'state', 'electricity', 'power', 'consumption', 'energy', 'value'];
  
  let html = '<div class="map-popup">';
  
  // First add the name/title if it exists
  if (properties.name) {
    html += `<h4 class="text-sm font-medium mb-1">${properties.name}</h4>`;
  } else if (properties.title) {
    html += `<h4 class="text-sm font-medium mb-1">${properties.title}</h4>`;
  }
  
  // Add priority properties first
  for (const key of priorityProperties) {
    if (properties[key] !== undefined && !skipProperties.includes(key.toLowerCase())) {
      const formattedValue = formatPropertyValue(properties[key]);
      const formattedKey = formatPropertyKey(key);
      html += `<div class="flex text-xs"><span class="font-medium mr-1">${formattedKey}:</span> ${formattedValue}</div>`;
    }
  }
  
  // Add other properties
  for (const key in properties) {
    if (!priorityProperties.includes(key) && !skipProperties.includes(key.toLowerCase()) && properties[key] !== undefined) {
      const formattedValue = formatPropertyValue(properties[key]);
      const formattedKey = formatPropertyKey(key);
      html += `<div class="flex text-xs"><span class="font-medium mr-1">${formattedKey}:</span> ${formattedValue}</div>`;
    }
  }
  
  html += '</div>';
  return html;
};
