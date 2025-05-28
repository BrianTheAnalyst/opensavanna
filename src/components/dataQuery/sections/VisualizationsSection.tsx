
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {visualizations.map((viz, index) => {
        // Transform and enhance the data
        const transformedData = transformDataForVisualization(viz.data || [], viz.category, '');
        
        if (viz.type === 'map') {
          // Create GeoJSON from points if not provided
          const geoJSON = viz.geoJSON || prepareGeoJSONForMap(viz);
          
          // Skip if no geoJSON and no data with coordinates
          if (!geoJSON && (!transformedData || !Array.isArray(transformedData))) return null;
          
          return (
            <Card key={index} className="md:col-span-2">
              <CardHeader>
                <CardTitle>{viz.title}</CardTitle>
                <CardDescription>Geographic visualization of data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <MapVisualization
                    data={transformedData || []}
                    isLoading={false}
                    category={viz.category || ""}
                    geoJSON={geoJSON}
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
          <Card key={index} className={viz.type === 'line' ? "md:col-span-2" : ""}>
            <CardHeader>
              <CardTitle>{viz.title}</CardTitle>
              <CardDescription>
                Analysis of {transformedData?.length || 0} data points
                {transformedData?.length > 0 && ` • Showing ${viz.type} visualization`}
              </CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default VisualizationsSection;
