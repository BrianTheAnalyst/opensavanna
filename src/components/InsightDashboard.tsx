
import React from 'react';
import { Dataset } from '@/types/dataset';
import { generateDatasetMetrics } from './insights/metrics';
import { MetricsDisplay } from './insights/MetricsDisplay';
import { InsightsDisplay } from './insights/InsightsDisplay';
import { DatasetCharts } from './insights/DatasetCharts';

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

  return (
    <div className="space-y-6">
      <MetricsDisplay metrics={metrics} />
      
      {insights.length > 0 && (
        <InsightsDisplay insights={insights} />
      )}
      
      {/* Always show charts - DatasetCharts will handle empty data with meaningful samples */}
      <DatasetCharts 
        dataset={dataset}
        visualizationData={visualizationData}
      />
      
      {!hasValidData && (
        <div className="bg-muted/20 border border-border rounded-xl p-4 text-center">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Sample data is being displayed for demonstration purposes. 
            Upload a file with this dataset to see actual data visualizations.
          </p>
        </div>
      )}
    </div>
  );
};

export default InsightDashboard;
