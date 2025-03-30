
import React from 'react';
import { Dataset } from '@/types/dataset';
import { generateDatasetMetrics } from './insights/MetricsGenerator';
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

  return (
    <div className="space-y-6">
      <MetricsDisplay metrics={metrics} />
      
      {insights.length > 0 && (
        <InsightsDisplay insights={insights} />
      )}
      
      <DatasetCharts 
        dataset={dataset}
        visualizationData={visualizationData}
      />
    </div>
  );
};

export default InsightDashboard;
