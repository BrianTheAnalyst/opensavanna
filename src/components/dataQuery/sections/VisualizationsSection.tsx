
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';
import InsightCard from '@/components/InsightCard';
import MapVisualization from '@/components/visualization/MapVisualization';
import ConfidenceIndicator from '@/components/ui/confidence-indicator';
import DataSourceBadge from '@/components/ui/data-source-badge';
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
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between">
                  <CardTitle>{viz.title}</CardTitle>
                  <Badge variant="secondary">{viz.category}</Badge>
                </div>
                
                {/* Data Source and Confidence Indicators */}
                <div className="flex flex-col gap-2">
                  <DataSourceBadge 
                    dataSource={viz.dataSource || 'empty'}
                    recordCount={viz.data?.length}
                  />
                  
                  {viz.validation && (
                    <ConfidenceIndicator
                      confidence={viz.confidence || 0}
                      dataSource={viz.dataSource || 'empty'}
                      showDetails={false}
                      issues={viz.validation.issues}
                      recommendations={viz.validation.recommendations}
                    />
                  )}
                </div>
                
                <CardDescription>Geographic visualization of data</CardDescription>
              </CardHeader>
              <CardContent>
                {viz.error && (
                  <Alert className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-semibold">Unable to display map</p>
                        <p className="text-sm">{viz.error}</p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
                
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
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between">
                <CardTitle>{viz.title}</CardTitle>
                <Badge variant="secondary">{viz.category}</Badge>
              </div>
              
              {/* Data Source and Confidence Indicators */}
              <div className="flex flex-col gap-2">
                <DataSourceBadge 
                  dataSource={viz.dataSource || 'empty'}
                  recordCount={viz.data?.length}
                />
                
                {viz.validation && (
                  <ConfidenceIndicator
                    confidence={viz.confidence || 0}
                    dataSource={viz.dataSource || 'empty'}
                    showDetails={false}
                    issues={viz.validation.issues}
                    recommendations={viz.validation.recommendations}
                  />
                )}
              </div>
              
              <CardDescription>
                Visualization based on {viz.data?.length || 0} data points
              </CardDescription>
            </CardHeader>
            <CardContent>
              {viz.error && (
                <Alert className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-semibold">Unable to display visualization</p>
                      <p className="text-sm">{viz.error}</p>
                      {viz.validation?.recommendations?.length > 0 && (
                        <div className="text-sm">
                          <p className="font-medium">Suggestions:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {viz.validation.recommendations.map((rec, index) => (
                              <li key={index}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {viz.data === null || (Array.isArray(viz.data) && viz.data.length === 0) ? (
                <Alert className="mb-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-semibold">No data available</p>
                      <p className="text-sm">
                        {viz.error 
                          ? 'There was an error loading the dataset. Please try again.' 
                          : 'Try refining your search or check if the dataset contains relevant data'}
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
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
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default VisualizationsSection;
