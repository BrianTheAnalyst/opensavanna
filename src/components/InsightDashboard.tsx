
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
  // Get metrics for the dataset
  const metrics = generateDatasetMetrics(dataset, visualizationData);
  
  // Validate data before rendering
  const hasData = Array.isArray(visualizationData) && visualizationData.length > 0;

  return (
    <div className="space-y-6">
      {hasData ? (
        <>
          <MetricsDisplay metrics={metrics} />
          
          {insights.length > 0 && (
            <InsightsDisplay insights={insights} />
          )}
          
          <DatasetCharts 
            dataset={dataset}
            visualizationData={visualizationData}
          />
        </>
      ) : (
        <div className="glass border border-border/50 rounded-xl p-6 text-center">
          <h3 className="text-xl font-medium mb-2">No Data Available</h3>
          <p className="text-muted-foreground mb-4">
            This dataset doesn't have visualization data available. Try uploading a file with the dataset or checking the dataset format.
          </p>
        </div>
      )}
    </div>
  );
};

export default InsightDashboard;
