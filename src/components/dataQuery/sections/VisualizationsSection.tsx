
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import IntelligentChart from '@/components/visualization/IntelligentChart';
import MapVisualization from '@/components/visualization/MapVisualization';
import { DataInsightResult } from '@/services/dataInsights/types';

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
        <h2 className="text-3xl font-bold mb-4">Intelligent Data Analysis</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Advanced visualizations with actionable insights, pattern recognition, and data-driven recommendations
        </p>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {visualizations.map((viz, index) => {
          // Handle map visualizations separately
          if (viz.type === 'map') {
            return (
              <Card key={index} className="border-border/50 shadow-xl xl:col-span-2">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-border/50">
                  <CardTitle className="text-2xl">{viz.title}</CardTitle>
                  <CardDescription className="text-base">
                    Geographic visualization showing spatial patterns and distributions
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div style={{ height: '600px' }} className="w-full">
                    <MapVisualization
                      data={viz.data || []}
                      isLoading={false}
                      category={viz.category || ""}
                      geoJSON={viz.geoJSON}
                      title={viz.title}
                      description="Explore geographic data patterns"
                    />
                  </div>
                </CardContent>
              </Card>
            );
          }
          
          // Convert to intelligent visualization format
          const intelligentViz = {
            id: viz.id || `viz-${index}`,
            title: viz.title,
            type: viz.type as 'line' | 'bar' | 'scatter' | 'heatmap' | 'distribution' | 'correlation_matrix',
            data: viz.data || [],
            insights: (viz.intelligentInsights || []).map((insight: any) => ({
              type: insight.type || 'trend',
              title: insight.title || 'Data Insight',
              description: insight.description || 'Analysis of data patterns',
              confidence: insight.confidence || 0.8,
              impact: insight.impact || 'medium',
              recommendations: insight.recommendations || []
            })),
            xAxis: viz.xAxisLabel || 'X Axis',
            yAxis: viz.yAxisLabel || 'Y Axis', 
            description: viz.description || `Analysis of ${viz.data?.length || 0} data points`,
            purpose: viz.purpose || 'Data pattern analysis'
          };
          
          return (
            <div key={index} className={intelligentViz.type === 'scatter' ? 'xl:col-span-2' : ''}>
              <IntelligentChart visualization={intelligentViz} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VisualizationsSection;
