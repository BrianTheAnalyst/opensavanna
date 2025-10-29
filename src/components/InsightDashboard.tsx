
import React from 'react';
import { Dataset } from '@/types/dataset';
import { generateDatasetMetrics } from './insights/metrics';
import { MetricsDisplay } from './insights/MetricsDisplay';
import { InsightsDisplay } from './insights/InsightsDisplay';
import { DatasetCharts } from './insights/DatasetCharts';
import { DataSourceBadge } from '@/components/ui/data-source-badge';
import { ConfidenceIndicator } from '@/components/ui/confidence-indicator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface InsightDashboardProps {
  dataset: Dataset;
  visualizationData: any[];
  insights: string[];
}

const InsightDashboard = ({ dataset, visualizationData, insights }: InsightDashboardProps) => {
  // Always generate metrics, even if data is empty (will use meaningful defaults)
  const metrics = generateDatasetMetrics(dataset, visualizationData);
  
  // Check if we have valid data
  const hasValidData = Array.isArray(visualizationData) && visualizationData.length > 0;
  
  // Calculate data quality and confidence
  const dataSource: 'real' | 'empty' = hasValidData ? 'real' : 'empty';
  const recordCount = hasValidData ? visualizationData.length : 0;
  const confidence = hasValidData ? Math.min(95, 70 + Math.min(recordCount / 10, 25)) : 0;
  
  // Identify data quality issues
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  if (!hasValidData) {
    issues.push('No visualization data available');
    recommendations.push('Upload a file with valid data to enable visualizations');
  } else if (recordCount < 10) {
    issues.push('Limited data points may affect visualization quality');
    recommendations.push('Add more data records for better insights');
  }

  return (
    <div className="space-y-6">
      {/* Quality Indicators - Prominent at the top */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/30 rounded-lg border border-border">
        <DataSourceBadge 
          dataSource={dataSource}
          recordCount={recordCount}
          className="flex-shrink-0"
        />
        {hasValidData && (
          <ConfidenceIndicator 
            confidence={confidence}
            dataSource={dataSource}
            showDetails={false}
          />
        )}
      </div>
      
      {/* Show warning for questionable data quality */}
      {!hasValidData && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>No Data Available:</strong> This dataset does not have visualization data. 
            Upload a file with valid data to see real insights and visualizations.
          </AlertDescription>
        </Alert>
      )}
      
      {hasValidData && recordCount < 10 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Limited Data:</strong> This dataset has only {recordCount} records. 
            Visualizations may not fully represent the data patterns.
          </AlertDescription>
        </Alert>
      )}
      
      <MetricsDisplay metrics={metrics} />
      
      {insights.length > 0 && (
        <InsightsDisplay insights={insights} />
      )}
      
      {/* Only show charts if we have real data */}
      {hasValidData ? (
        <DatasetCharts 
          dataset={dataset}
          visualizationData={visualizationData}
        />
      ) : (
        <div className="glass border border-border/50 rounded-xl p-8 text-center">
          <p className="text-muted-foreground text-lg">
            No visualization data available. Upload a dataset file to see charts and insights.
          </p>
        </div>
      )}
    </div>
  );
};

export default InsightDashboard;
