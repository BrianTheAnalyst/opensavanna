
// Function to handle interaction with GeoJSON features
export const onEachFeature = (feature: any, layer: any) => {
  if (feature.properties) {
    const properties = feature.properties;
    
    // Create a popup content based on feature properties
    let popupContent = '<div class="p-2">';
    
    // Add title if available
    if (properties.name) {
      popupContent += `<div class="font-medium">${properties.name}</div>`;
    } else if (properties.title) {
      popupContent += `<div class="font-medium">${properties.title}</div>`;
    }
    
    // Add value if available
    if (properties.value !== undefined) {
      popupContent += `<div>Value: ${properties.value}</div>`;
    }
    
    // Add other interesting properties (skip internal ones)
    Object.entries(properties).forEach(([key, value]) => {
      if (!['name', 'title', 'value', '__id', 'id', 'type', 'properties'].includes(key) && 
          typeof value !== 'object' && value !== null && value !== undefined) {
        popupContent += `<div>${key}: ${value}</div>`;
      }
    });
    
    popupContent += '</div>';
    
    // Bind popup to layer
    layer.bindPopup(popupContent);
    
    // Add hover highlighting
    layer.on({
      mouseover: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          weight: 2,
          color: '#222',
          fillOpacity: 0.8
        });
        layer.bringToFront();
      },
      mouseout: (e: any) => {
        layer.setStyle({
          weight: 1,
          opacity: 0.8,
          color: '#555',
          fillOpacity: 0.6
        });
      }
    });
  }
};
