
import React from 'react';
import { Button } from '@/components/ui/button';
import { Map, PieChart, Activity, Layers } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  // Configuration for map visualization types
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
      description: 'Color-coded regions based on data values' 
    },
    { 
      id: 'heatmap', 
      label: 'Heatmap', 
      icon: Activity, 
      description: 'Heat intensity visualization of data density' 
    },
    { 
      id: 'cluster', 
      label: 'Cluster', 
      icon: Layers, 
      description: 'Group nearby points into clusters' 
    }
  ] as const;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-sm text-muted-foreground mr-2">Map view:</span>
      <TooltipProvider delayDuration={300}>
        <div className="flex flex-wrap gap-2">
          {visualizationTypes.map((type) => {
            const Icon = type.icon;
            const isActive = currentType === type.id;
            
            // Disable choropleth if no GeoJSON data
            const isDisabled = (type.id === 'choropleth' && !hasGeoJSON) || 
                               ((type.id === 'heatmap' || type.id === 'cluster') && !hasPoints);
            
            return (
              <Tooltip key={type.id}>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm" 
                    variant={isActive ? 'default' : 'outline'} 
                    onClick={() => setType(type.id)}
                    className={`transition-all ${isActive ? 'shadow-sm' : ''}`}
                    disabled={isDisabled}
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {type.label}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{isDisabled 
                    ? `${type.description} (requires ${type.id === 'choropleth' ? 'GeoJSON data' : 'point data'})` 
                    : type.description}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>
    </div>
  );
};

export default MapControls;
