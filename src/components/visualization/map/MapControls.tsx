
import React from 'react';
import { Button } from '@/components/ui/button';
import { Map, PieChart, Activity, Layers } from 'lucide-react';

interface MapControlsProps {
  currentType: 'standard' | 'choropleth' | 'heatmap' | 'cluster';
  setType: (type: 'standard' | 'choropleth' | 'heatmap' | 'cluster') => void;
  hasGeoJSON: boolean;
  hasPoints: boolean;
}

const MapControls: React.FC<MapControlsProps> = ({ 
  currentType, 
  setType,
  hasGeoJSON,
  hasPoints
}) => {
  const visualizationTypes = [
    { 
      id: 'standard', 
      label: 'Standard', 
      icon: Map, 
      description: 'Default map display with markers' 
    },
    { 
      id: 'choropleth', 
      label: 'Choropleth', 
      icon: PieChart, 
      description: 'Color-coded regions based on data values',
      disabled: !hasGeoJSON
    },
    { 
      id: 'heatmap', 
      label: 'Heatmap', 
      icon: Activity, 
      description: 'Heat intensity visualization of data density',
      disabled: !hasPoints
    },
    { 
      id: 'cluster', 
      label: 'Cluster', 
      icon: Layers, 
      description: 'Group nearby points into clusters',
      disabled: !hasPoints
    }
  ] as const;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground mr-2">Visualization:</span>
      <div className="flex flex-wrap gap-2">
        {visualizationTypes.map((type) => {
          const Icon = type.icon;
          const isActive = currentType === type.id;
          const isDisabled = type.disabled;
          
          return (
            <Button 
              key={type.id}
              size="sm" 
              variant={isActive ? 'default' : 'outline'} 
              onClick={() => !isDisabled && setType(type.id)}
              className={`transition-all ${isActive ? 'shadow-sm' : ''}`}
              disabled={isDisabled}
              title={isDisabled 
                ? `${type.description} (requires ${type.id === 'choropleth' ? 'GeoJSON data' : 'point data'})` 
                : type.description}
            >
              <Icon className="h-4 w-4 mr-1" />
              {type.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default MapControls;
