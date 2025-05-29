
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import InsightCard from '@/components/InsightCard';
import MapVisualization from '@/components/visualization/MapVisualization';
import { prepareGeoJSONForMap } from '../utils/geoJsonUtils';
import { DataInsightResult } from '@/services/dataInsights/types';
import { 
  transformDataForVisualization, 
  generateAxisLabels,
  determineVisualizationType 
} from '@/services/dataInsights/visualizationUtils';

interface VisualizationsSectionProps {
  visualizations: DataInsightResult['visualizations'];
}

const VisualizationsSection: React.FC<VisualizationsSectionProps> = ({ visualizations }) => {
  if (!visualizations || visualizations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">Data Visualizations</h3>
        <p className="text-muted-foreground">Interactive charts and maps based on your query</p>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        {visualizations.map((viz, index) => {
          // Transform and enhance the data
          const transformedData = transformDataForVisualization(viz.data || [], viz.category, '');
          
          if (viz.type === 'map') {
            // Create GeoJSON from points if not provided
            const geoJSON = viz.geoJSON || prepareGeoJSONForMap(viz);
            
            // Skip if no geoJSON and no data with coordinates
            if (!geoJSON && (!transformedData || !Array.isArray(transformedData))) return null;
            
            return (
              <Card key={index} className="border-border/50 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">{viz.title}</CardTitle>
                  <CardDescription>Geographic visualization of data patterns and distributions</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[500px] rounded-b-lg overflow-hidden">
                    <MapVisualization
                      data={transformedData || []}
                      isLoading={false}
                      category={viz.category || ""}
                      geoJSON={geoJSON}
                      title={viz.title}
                      description="Explore geographic data patterns"
                    />
                  </div>
                </CardContent>
              </Card>
            );
          }
          
          // Generate intelligent axis labels
          const { xAxisLabel, yAxisLabel } = generateAxisLabels(
            transformedData, 
            viz.category, 
            viz.title, 
            viz.type
          );
          
          // Determine appropriate tooltip formatter
          const tooltipFormatter = (value: any, name: any) => {
            const item = transformedData.find(d => d.value === value);
            const formattedValue = item?.formattedValue || value;
            return [formattedValue, yAxisLabel];
          };
          
          return (
            <Card key={index} className="border-border/50 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">{viz.title}</CardTitle>
                <CardDescription>
                  Analysis of {transformedData?.length || 0} data points
                  {transformedData?.length > 0 && ` • ${viz.type} visualization`}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="h-[400px]">
                  <InsightCard
                    title=""
                    data={transformedData || []}
                    type={viz.type}
                    dataKey="value"
                    nameKey="name"
                    xAxisLabel={xAxisLabel}
                    yAxisLabel={yAxisLabel}
                    tooltipFormatter={tooltipFormatter}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default VisualizationsSection;
