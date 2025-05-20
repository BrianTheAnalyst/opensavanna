
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
        
        return (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{viz.title}</CardTitle>
              <CardDescription>
                Visualization based on {viz.data?.length || 0} data points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InsightCard
                title=""
                data={viz.data || []}
                type={viz.type}
                dataKey="value"
                nameKey="name"
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default VisualizationsSection;
