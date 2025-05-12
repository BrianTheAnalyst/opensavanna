
import React from 'react';
import { Button } from '@/components/ui/button';
import { Map, PieChart, Activity, Layers } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MapControlsProps {
  visualizationType: 'standard' | 'choropleth' | 'heatmap' | 'cluster';
  onVisualizationTypeChange: (type: 'standard' | 'choropleth' | 'heatmap' | 'cluster') => void;
}

const MapControls: React.FC<MapControlsProps> = ({ 
  visualizationType, 
  onVisualizationTypeChange 
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
            const isActive = visualizationType === type.id;
            
            return (
              <Tooltip key={type.id}>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm" 
                    variant={isActive ? 'default' : 'outline'} 
                    onClick={() => onVisualizationTypeChange(type.id)}
                    className={`transition-all ${isActive ? 'shadow-sm' : ''}`}
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {type.label}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{type.description}</p>
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
