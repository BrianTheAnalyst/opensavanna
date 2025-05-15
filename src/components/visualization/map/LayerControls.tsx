
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Layers, Landmark, Building, Mountain } from 'lucide-react';
import { TileLayerConfig } from './types';

interface LayerControlsProps {
  onTileLayerChange: (layer: TileLayerConfig) => void;
}

const LayerControls: React.FC<LayerControlsProps> = ({ onTileLayerChange }) => {
  // Default icons for common layer types
  const getDefaultIcon = (id: string) => {
    switch (id) {
      case 'points':
        return Landmark;
      case 'buildings':
        return Building;
      case 'terrain':
        return Mountain;
      case 'roads':
        return Layers; // Changed from Road to Layers as per available icons
      default:
        return Layers; // Changed from MapLayers to Layers
    }
  };
  
  // Default layers configuration
  const defaultLayers = [
    { id: 'base', label: 'Base Map', enabled: true, icon: Layers },
    { id: 'points', label: 'Points', enabled: true, icon: Landmark },
    { id: 'buildings', label: 'Buildings', enabled: false, icon: Building },
    { id: 'terrain', label: 'Terrain', enabled: false, icon: Mountain },
  ];

  const [layers, setLayers] = React.useState(defaultLayers);
  
  const handleLayerToggle = (layerId: string, enabled: boolean) => {
    // Update local state
    setLayers(layers.map(layer => 
      layer.id === layerId ? { ...layer, enabled } : layer
    ));
    
    // For this example, we'll just pass a simple layer config based on selection
    if (layerId === 'base' && enabled) {
      onTileLayerChange({
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attributionControl: true,
        attribution: "© OpenStreetMap contributors"
      });
    } else if (layerId === 'terrain' && enabled) {
      onTileLayerChange({
        url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        attributionControl: true,
        attribution: "© OpenStreetMap contributors, © CARTO"
      });
    }
  };
  
  return (
    <div className="border rounded-md p-3 bg-background/90 shadow-sm">
      <div className="flex items-center mb-2">
        <Layers className="h-4 w-4 mr-2" />
        <h4 className="text-sm font-medium">Map Layers</h4>
      </div>
      <Separator className="my-2" />
      <div className="space-y-3">
        {layers.map((layer) => {
          const Icon = layer.icon || getDefaultIcon(layer.id);
          return (
            <div key={layer.id} className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor={`layer-${layer.id}`} className="text-xs">
                  {layer.label}
                </Label>
              </div>
              <Switch
                id={`layer-${layer.id}`}
                checked={layer.enabled}
                onCheckedChange={(checked) => handleLayerToggle(layer.id, checked)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LayerControls;
