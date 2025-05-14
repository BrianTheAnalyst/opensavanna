
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Layers, Landmark, Building, Mountain } from 'lucide-react';

interface LayerControlsProps {
  layers: {
    id: string;
    label: string;
    enabled: boolean;
    icon?: React.ElementType;
  }[];
  onLayerToggle: (layerId: string, enabled: boolean) => void;
}

const LayerControls: React.FC<LayerControlsProps> = ({ layers, onLayerToggle }) => {
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
                onCheckedChange={(checked) => onLayerToggle(layer.id, checked)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LayerControls;
