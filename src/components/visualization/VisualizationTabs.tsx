
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dataset } from "@/types/dataset";
import Visualization from "@/components/Visualization";
import InsightDashboard from "@/components/InsightDashboard";
import MapVisualization from "./MapVisualization";
import { AreaChart, BarChart3, LineChart, Map, PieChart } from 'lucide-react';

interface VisualizationTabsProps {
  dataset: Dataset;
  visualizationData: any[];
  insights: string[];
  analysisMode: 'overview' | 'detailed' | 'advanced';
  setAnalysisMode: (mode: 'overview' | 'detailed' | 'advanced') => void;
  isLoading?: boolean;
  geoJSON?: any | null;
}

const VisualizationTabs: React.FC<VisualizationTabsProps> = ({
  dataset,
  visualizationData,
  insights,
  analysisMode,
  setAnalysisMode,
  isLoading = false,
  geoJSON
}) => {
  // Determine if the dataset likely contains or should display geographic data
  const hasGeoData = React.useMemo(() => {
    if (!visualizationData || visualizationData.length === 0) return false;
    
    // If we have explicit GeoJSON data, definitely show the map
    if (geoJSON) {
      return true;
    }
    
    // Check if dataset category suggests geographic data
    const geographicCategories = ['geo', 'map', 'location', 'region', 'country', 'spatial', 'geographic'];
    if (geographicCategories.some(term => dataset.category.toLowerCase().includes(term)) || 
        dataset.format.toLowerCase() === 'geojson') {
      return true;
    }
    
    // Electricity, energy and power data often benefits from geographic visualization
    const energyCategories = ['electricity', 'energy', 'power', 'consumption'];
    if (energyCategories.some(term => dataset.category.toLowerCase().includes(term))) {
      return true;
    }
    
    // Check if the data has lat/lng fields
    const firstItem = visualizationData[0];
    if (!firstItem) return false;
    
    const keys = Object.keys(firstItem);
    const geoFields = ['lat', 'latitude', 'lng', 'longitude', 'x', 'y', 'coordinates', 'geometry', 'country', 'region', 'location'];
    
    return geoFields.some(field => 
      keys.some(key => key.toLowerCase().includes(field.toLowerCase()))
    );
  }, [visualizationData, dataset, geoJSON]);

  return (
    <Tabs defaultValue={hasGeoData ? "map" : "chart"} className="w-full">
      <TabsList className="mb-4 grid grid-cols-4 gap-4 bg-transparent">
        <TabsTrigger value="chart" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          <BarChart3 className="h-4 w-4 mr-2" />
          Charts
        </TabsTrigger>
        {hasGeoData && (
          <TabsTrigger value="map" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Map className="h-4 w-4 mr-2" />
            Map
          </TabsTrigger>
        )}
        <TabsTrigger value="insights" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          <LineChart className="h-4 w-4 mr-2" />
          Insights
        </TabsTrigger>
        <TabsTrigger value="advanced" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          <AreaChart className="h-4 w-4 mr-2" />
          Advanced
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="chart" className="space-y-8">
        <Visualization 
          data={visualizationData}
          title={`${dataset.title} - Visualization`}
          description="Visual representation of key data points"
        />
      </TabsContent>
      
      {hasGeoData && (
        <TabsContent value="map" className="space-y-8">
          <MapVisualization
            data={visualizationData}
            title={`${dataset.title} - Geographic Visualization`}
            description="Spatial representation of geographic data"
            isLoading={isLoading}
            category={dataset.category}
            geoJSON={geoJSON}
          />
        </TabsContent>
      )}
      
      <TabsContent value="insights" className="space-y-8">
        <InsightDashboard 
          dataset={dataset}
          visualizationData={visualizationData}
          insights={insights}
        />
      </TabsContent>
      
      <TabsContent value="advanced" className="space-y-8">
        <Visualization 
          data={visualizationData}
          title={`${dataset.title} - Advanced Analysis`}
          description="In-depth statistical analysis and visualization"
        />
      </TabsContent>
    </Tabs>
  );
};

export default VisualizationTabs;
