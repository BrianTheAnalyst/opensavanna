import { formatPropertyKey, formatPropertyValue } from './colorUtils';

// Function for handling GeoJSON feature interactions
// Not exporting this function directly to avoid naming conflicts
const formatFeaturePopup = (feature: any, layer: any) => {
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
          color: '#555',
          dashArray: '',
          fillOpacity: 0.6
        });
      }
    });
  }
};

// Format properties for display in popup
export const formatPropertiesForDisplay = (properties: Record<string, any>): string => {
  if (!properties) return '<div class="p-3">No data available</div>';
  
  // Skip internal properties and prioritize important ones
  const skipProperties = ['id', 'gid', 'fid', 'objectid', 'shape_area', 'shape_length', 'geometry', 'parent'];
  const priorityProperties = ['name', 'title', 'country', 'region', 'state', 'province', 'city', 'electricity', 'power', 'consumption', 'energy', 'value'];
  
  // Start building the HTML
  let html = '<div class="p-3 max-w-xs">';
  
  // First add the name/title if it exists
  if (properties.name) {
    html += `<h4 class="text-sm font-bold pb-1 border-b border-gray-200 mb-2">${properties.name}</h4>`;
  } else if (properties.title) {
    html += `<h4 class="text-sm font-bold pb-1 border-b border-gray-200 mb-2">${properties.title}</h4>`;
  } else if (properties.country) {
    html += `<h4 class="text-sm font-bold pb-1 border-b border-gray-200 mb-2">${properties.country}</h4>`;
  }
  
  // Add priority properties first
  let hasAddedProperties = false;
  for (const key of priorityProperties) {
    if (properties[key] !== undefined && 
        !skipProperties.includes(key.toLowerCase()) && 
        !(properties.name === properties[key] || properties.title === properties[key])) {
      const formattedValue = formatPropertyValue(properties[key]);
      const formattedKey = formatPropertyKey(key);
      html += `<div class="flex justify-between text-xs py-1"><span class="font-medium mr-2">${formattedKey}:</span> <span class="text-right">${formattedValue}</span></div>`;
      hasAddedProperties = true;
    }
  }
  
  // Add other properties, but limit to avoid too many
  let otherPropsCount = 0;
  const maxOtherProps = 5;
  
  for (const key in properties) {
    if (!priorityProperties.includes(key) && 
        !skipProperties.includes(key.toLowerCase()) && 
        properties[key] !== undefined &&
        typeof properties[key] !== 'object' &&
        otherPropsCount < maxOtherProps) {
      const formattedValue = formatPropertyValue(properties[key]);
      const formattedKey = formatPropertyKey(key);
      html += `<div class="flex justify-between text-xs py-1"><span class="font-medium mr-2">${formattedKey}:</span> <span class="text-right">${formattedValue}</span></div>`;
      hasAddedProperties = true;
      otherPropsCount++;
    }
  }
  
  // If we have more properties, add an indicator
  const totalProps = Object.keys(properties).filter(key => !skipProperties.includes(key.toLowerCase())).length;
  const displayedProps = otherPropsCount + priorityProperties.filter(key => properties[key] !== undefined).length;
  
  if (totalProps > displayedProps) {
    html += `<div class="text-xs text-muted-foreground mt-1 text-center">+ ${totalProps - displayedProps} more fields</div>`;
  }
  
  // If no properties added, show a message
  if (!hasAddedProperties) {
    html += '<div class="text-xs text-muted-foreground">No additional data available</div>';
  }
  
  html += '</div>';
  return html;
};

// Format a GeoJSON's name for display
export const formatGeoJSONName = (geoJSON: any): string => {
  if (!geoJSON) return 'Map Data';
  
  // Check for a name in metadata
  if (geoJSON.metadata && geoJSON.metadata.name) {
    return geoJSON.metadata.name;
  }
  
  // Look for common name properties in features
  if (geoJSON.features && geoJSON.features.length > 0) {
    const firstFeature = geoJSON.features[0];
    if (firstFeature.properties) {
      // Common name properties
      const nameProps = ['country', 'region', 'state', 'name', 'title', 'area'];
      for (const prop of nameProps) {
        if (firstFeature.properties[prop]) {
          return `${firstFeature.properties[prop]} Data`;
        }
      }
    }
  }
  
  return 'Geographic Data';
};
