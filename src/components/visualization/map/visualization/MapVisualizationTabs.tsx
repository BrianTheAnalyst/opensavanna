
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MapIcon, Layers, Thermometer, Crosshair } from 'lucide-react';
import MapContainerComponent from '../MapContainer';
import TimeControls from '../TimeControls';

interface MapVisualizationTabsProps {
  visualizationType: 'standard' | 'choropleth' | 'heatmap' | 'cluster';
  handleVisualizationTypeChange: (type: 'standard' | 'choropleth' | 'heatmap' | 'cluster') => void;
  defaultCenter: [number, number];
  defaultZoom: number;
  geoJSON: any;
  points: any[];
  category: string;
  timeIndex: number;
  activeLayers: string[];
  anomalyDetection: boolean;
  anomalyThreshold: number;
  handleTimeIndexChange: (index: number) => void;
}

const MapVisualizationTabs: React.FC<MapVisualizationTabsProps> = ({
  visualizationType,
  handleVisualizationTypeChange,
  defaultCenter,
  defaultZoom,
  geoJSON,
  points,
  category,
  timeIndex,
  activeLayers,
  anomalyDetection,
  anomalyThreshold,
  handleTimeIndexChange
}) => {
  return (
    <Tabs defaultValue={visualizationType} className="h-full flex flex-col">
      <TabsList className="mx-4 mt-4 bg-muted/60 grid w-full grid-cols-4">
        <TabsTrigger 
          value="standard" 
          onClick={() => handleVisualizationTypeChange('standard')}
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
        >
          <MapIcon className="h-4 w-4 mr-2" /> Standard
        </TabsTrigger>
        <TabsTrigger 
          value="choropleth" 
          onClick={() => handleVisualizationTypeChange('choropleth')}
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
        >
          <Layers className="h-4 w-4 mr-2" /> Choropleth
        </TabsTrigger>
        <TabsTrigger 
          value="heatmap" 
          onClick={() => handleVisualizationTypeChange('heatmap')}
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
        >
          <Thermometer className="h-4 w-4 mr-2" /> Heatmap
        </TabsTrigger>
        <TabsTrigger 
          value="cluster" 
          onClick={() => handleVisualizationTypeChange('cluster')}
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
        >
          <Crosshair className="h-4 w-4 mr-2" /> Clusters
        </TabsTrigger>
      </TabsList>
      
      {/* Map Visualization Area */}
      <TabsContent value={visualizationType} className="flex-1 m-0 p-4">
        <div className="h-full relative rounded-md overflow-hidden">
          <MapContainerComponent 
            defaultCenter={defaultCenter}
            defaultZoom={defaultZoom}
            geoJSON={geoJSON}
            points={points}
            visualizationType={visualizationType}
            category={category}
            currentTimeIndex={timeIndex}
            activeLayers={activeLayers}
            anomalyDetection={anomalyDetection}
            anomalyThreshold={anomalyThreshold}
          />
          
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm rounded-t-md border-t">
            <TimeControls 
              currentIndex={timeIndex}
              setCurrentIndex={handleTimeIndexChange}
              maxIndex={10}
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default MapVisualizationTabs;
