
import React from 'react';
import { Dataset } from '@/types/dataset';
import InsightCard from '../InsightCard';

interface DatasetChartsProps {
  dataset: Dataset;
  visualizationData: any[];
}

export const DatasetCharts: React.FC<DatasetChartsProps> = ({ dataset, visualizationData }) => {
  // Determine the most appropriate additional visualizations based on dataset type
  if (dataset.title.toLowerCase().includes('transaction') || dataset.category.toLowerCase() === 'economics') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <InsightCard
          title="Spending Distribution"
          description="How your spending is distributed across categories"
          data={visualizationData}
          type="pie"
          dataKey="value"
          className="col-span-1 md:col-span-2"
        />
        <InsightCard
          title="Spending Comparison"
          description="Category by category comparison"
          data={visualizationData}
          type="bar"
          dataKey="value"
          className="col-span-1 md:col-span-2"
        />
      </div>
    );
  }
  
  // For health data
  if (dataset.category.toLowerCase() === 'health') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <InsightCard
          title="Health Indicators"
          description="Key health metrics analysis"
          data={visualizationData}
          type="bar"
          dataKey="value"
          className="col-span-1 md:col-span-2"
        />
        <InsightCard
          title="Comparative Analysis"
          description="Comparing different health metrics"
          data={visualizationData}
          type="line"
          dataKey="value"
          className="col-span-1 md:col-span-2"
        />
      </div>
    );
  }
  
  // For education data
  if (dataset.category.toLowerCase() === 'education') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <InsightCard
          title="Education Metrics"
          description="Key education performance indicators"
          data={visualizationData}
          type="bar"
          dataKey="value"
          className="col-span-1 md:col-span-2"
        />
        <InsightCard
          title="Distribution Analysis"
          description="Distribution of education metrics"
          data={visualizationData}
          type="pie"
          dataKey="value"
          className="col-span-1 md:col-span-2"
        />
      </div>
    );
  }
  
  // Default visualization for other dataset types
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <InsightCard
        title="Data Analysis"
        description="Overview of main data points"
        data={visualizationData}
        type="bar"
        dataKey="value"
        className="col-span-1 md:col-span-2"
      />
      <InsightCard
        title="Data Distribution"
        description="How values are distributed"
        data={visualizationData}
        type="pie"
        dataKey="value"
        className="col-span-1 md:col-span-2"
      />
    </div>
  );
};
