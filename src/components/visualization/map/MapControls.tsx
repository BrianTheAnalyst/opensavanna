
import React from 'react';
import { Map, HeatMap, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MapControlsProps {
  visualizationType: 'standard' | 'choropleth' | 'heatmap';
  onVisualizationTypeChange: (type: 'standard' | 'choropleth' | 'heatmap') => void;
}

const MapControls: React.FC<MapControlsProps> = ({ 
  visualizationType, 
  onVisualizationTypeChange 
}) => {
  return (
    <div className="flex justify-end mb-2">
      <TooltipProvider>
        <div className="flex items-center space-x-1 border border-border rounded-md p-1 bg-background">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant={visualizationType === 'standard' ? 'default' : 'ghost'}
                className="h-8 w-8"
                onClick={() => onVisualizationTypeChange('standard')}
              >
                <Map className="h-4 w-4" />
                <span className="sr-only">Standard Map</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Standard Map</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant={visualizationType === 'choropleth' ? 'default' : 'ghost'}
                className="h-8 w-8"
                onClick={() => onVisualizationTypeChange('choropleth')}
              >
                <BarChart className="h-4 w-4" />
                <span className="sr-only">Choropleth Map</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Choropleth Map</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant={visualizationType === 'heatmap' ? 'default' : 'ghost'}
                className="h-8 w-8"
                onClick={() => onVisualizationTypeChange('heatmap')}
              >
                <HeatMap className="h-4 w-4" />
                <span className="sr-only">Heat Map</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Heat Map</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default MapControls;
