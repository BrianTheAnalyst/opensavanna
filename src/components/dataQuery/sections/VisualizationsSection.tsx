
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import InsightCard from '@/components/InsightCard';
import MapVisualization from '@/components/visualization/MapVisualization';
import { prepareGeoJSONForMap } from '../utils/geoJsonUtils';
import { DataInsightResult } from '@/services/dataInsights/types';

interface VisualizationsSectionProps {
  visualizations: DataInsightResult['visualizations'];
}

const VisualizationsSection: React.FC<VisualizationsSectionProps> = ({ visualizations }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {visualizations.map((viz, index) => {
        if (viz.type === 'map') {
          // Create GeoJSON from points if not provided
          const geoJSON = viz.geoJSON || prepareGeoJSONForMap(viz);
          
          // Skip if no geoJSON and no data with coordinates
          if (!geoJSON && (!viz.data || !Array.isArray(viz.data))) return null;
          
          return (
            <Card key={index} className="md:col-span-2">
              <CardHeader>
                <CardTitle>{viz.title}</CardTitle>
                <CardDescription>Geographic visualization of data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <MapVisualization
                    data={viz.data || []}
                    isLoading={false}
                    category={viz.category || ""}
                    geoJSON={geoJSON}
                  />
                </div>
              </CardContent>
            </Card>
          );
        }
        
        // Determine appropriate axis labels based on visualization type and category
        const getAxisLabels = () => {
          let xAxisLabel = 'Category';
          let yAxisLabel = 'Value';
          
          if (viz.type === 'line') {
            xAxisLabel = viz.timeAxis || 'Time Period';
            yAxisLabel = viz.valueLabel || 'Value';
          } else if (viz.category?.toLowerCase().includes('economic')) {
            xAxisLabel = 'Economic Indicator';
            yAxisLabel = 'Economic Value';
          } else if (viz.category?.toLowerCase().includes('health')) {
            xAxisLabel = 'Health Metric';
            yAxisLabel = 'Health Value';
          } else if (viz.category?.toLowerCase().includes('education')) {
            xAxisLabel = 'Education Metric';
            yAxisLabel = 'Education Value';
          }
          
          return { xAxisLabel, yAxisLabel };
        };
        
        const { xAxisLabel, yAxisLabel } = getAxisLabels();
        
        return (
          <Card key={index} className={viz.type === 'line' ? "md:col-span-2" : ""}>
            <CardHeader>
              <CardTitle>{viz.title}</CardTitle>
              <CardDescription>
                Visualization based on {viz.data?.length || 0} data points
              </CardDescription>
            </CardHeader>
            <CardContent>
              {viz.data === null || (Array.isArray(viz.data) && viz.data.length === 0) ? (
                <div className="h-48 flex items-center justify-center bg-muted/30 rounded-lg">
                  <div className="text-center space-y-2">
                    <p className="text-muted-foreground">
                      {viz.error ? 'Failed to load data' : 'No data found for this query'}
                    </p>
                    <p className="text-sm text-muted-foreground/70">
                      {viz.error 
                        ? 'There was an error loading the dataset. Please try again.' 
                        : 'Try refining your search or check if the dataset contains relevant data'}
                    </p>
                  </div>
                </div>
              ) : (
                <InsightCard
                  title=""
                  data={viz.data || []}
                  type={viz.type}
                  dataKey="value"
                  nameKey="name"
                  xAxisLabel={xAxisLabel}
                  yAxisLabel={yAxisLabel}
                  tooltipFormatter={(value, name) => [`${value}`, viz.valueLabel || 'Value']}
                />
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default VisualizationsSection;
