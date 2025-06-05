
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Zap, Activity } from 'lucide-react';
import { DataPattern } from './types';

interface SpatialAnalysisPanelProps {
  analysis: any;
  insights: string[];
  isAnalyzing: boolean;
  patterns: DataPattern;
}

const SpatialAnalysisPanel: React.FC<SpatialAnalysisPanelProps> = ({
  analysis,
  insights,
  isAnalyzing,
  patterns
}) => {
  if (isAnalyzing) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {analysis && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="font-semibold">Spatial Statistics</span>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Moran's I:</span>
              <Badge variant="outline">{analysis.moransI?.toFixed(3)}</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Clustering:</span>
              <Badge variant={analysis.clustering === 'clustered' ? 'default' : 'secondary'}>
                {analysis.clustering}
              </Badge>
            </div>
            
            {analysis.hotspots?.length > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Hotspots:</span>
                <Badge variant="destructive" className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  {analysis.hotspots.length}
                </Badge>
              </div>
            )}
            
            {analysis.outliers?.length > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Outliers:</span>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  {analysis.outliers.length}
                </Badge>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <span className="font-semibold">Data Insights</span>
        </div>
        
        <div className="space-y-2">
          {insights.map((insight, index) => (
            <p key={index} className="text-xs text-muted-foreground leading-relaxed">
              {insight}
            </p>
          ))}
        </div>
      </div>
      
      {patterns.clusters.length > 0 && (
        <div className="space-y-2">
          <span className="text-sm font-semibold">Pattern Summary</span>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• {patterns.clusters.length} spatial clusters detected</p>
            <p>• {patterns.outliers.length} anomalous points identified</p>
            {patterns.hasTemporalData && (
              <p>• Temporal data spans {patterns.timeRange?.max - patterns.timeRange?.min} periods</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpatialAnalysisPanel;
