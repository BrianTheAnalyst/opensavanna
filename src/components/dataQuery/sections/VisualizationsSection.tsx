
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
    <div className="space-y-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Data Visualizations</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Interactive charts and maps generated from your data analysis
        </p>
      </div>
      
      <div className="space-y-12">
        {visualizations.map((viz, index) => {
          const transformedData = transformDataForVisualization(viz.data || [], viz.category, '');
          
          if (viz.type === 'map') {
            const geoJSON = viz.geoJSON || prepareGeoJSONForMap(viz);
            
            if (!geoJSON && (!transformedData || !Array.isArray(transformedData))) return null;
            
            return (
              <Card key={index} className="border-border/50 shadow-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-border/50">
                  <CardTitle className="text-2xl">{viz.title}</CardTitle>
                  <CardDescription className="text-base">
                    Geographic visualization showing spatial patterns and distributions
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div style={{ height: '600px' }} className="w-full">
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
          
          const { xAxisLabel, yAxisLabel } = generateAxisLabels(
            transformedData, 
            viz.category, 
            viz.title, 
            viz.type
          );
          
          const tooltipFormatter = (value: any, name: any) => {
            const item = transformedData.find(d => d.value === value);
            const formattedValue = item?.formattedValue || value;
            return [formattedValue, yAxisLabel];
          };
          
          return (
            <Card key={index} className="border-border/50 shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-border/50">
                <CardTitle className="text-2xl">{viz.title}</CardTitle>
                <CardDescription className="text-base">
                  Analysis of {transformedData?.length || 0} data points
                  {transformedData?.length > 0 && ` • ${viz.type} visualization`}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div style={{ height: '500px' }} className="w-full">
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
