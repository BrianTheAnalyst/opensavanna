
import React from 'react';
import { Dataset } from '@/types/dataset';
import InsightCard from './InsightCard';
import ChartInsight from './ChartInsight';

interface InsightDashboardProps {
  dataset: Dataset;
  visualizationData: any[];
  insights: string[];
}

const InsightDashboard = ({ dataset, visualizationData, insights }: InsightDashboardProps) => {
  // Generate meaningful metrics based on dataset category and visualization data
  const generateMetrics = () => {
    if (dataset.title.toLowerCase().includes('transaction') || dataset.category.toLowerCase() === 'economics') {
      const totalSpending = visualizationData.reduce((sum, item) => sum + item.value, 0);
      const highestCategory = [...visualizationData].sort((a, b) => b.value - a.value)[0];
      const lowestCategory = [...visualizationData].sort((a, b) => a.value - b.value)[0];
      const avgSpending = totalSpending / visualizationData.length;
      
      return [
        {
          type: 'highlight',
          title: 'Total',
          value: totalSpending.toLocaleString(),
          description: 'Total across all categories',
          color: 'info'
        },
        {
          type: 'increase',
          title: 'Highest',
          value: highestCategory.name,
          description: `${highestCategory.value.toLocaleString()} (${Math.round(highestCategory.value/totalSpending*100)}%)`,
          percentage: Math.round(highestCategory.value/totalSpending*100),
          color: 'success'
        },
        {
          type: 'decrease',
          title: 'Lowest',
          value: lowestCategory.name,
          description: `${lowestCategory.value.toLocaleString()} (${Math.round(lowestCategory.value/totalSpending*100)}%)`,
          percentage: Math.round(lowestCategory.value/totalSpending*100),
          color: 'warning'
        },
        {
          type: 'trend',
          title: 'Average',
          value: Math.round(avgSpending).toLocaleString(),
          description: 'Average per category',
          color: 'default'
        }
      ];
    }
    
    // Default metrics for other dataset types
    return [
      {
        type: 'highlight',
        title: 'Key Points',
        value: visualizationData.length,
        description: 'Number of data points analyzed',
        color: 'info'
      },
      {
        type: 'trend',
        title: 'Insights',
        value: insights.length,
        description: 'Automated insights detected',
        color: 'success'
      }
    ];
  };

  // Determine the most appropriate additional visualizations based on dataset type
  const getAdditionalCharts = () => {
    // For transaction or financial data
    if (dataset.title.toLowerCase().includes('transaction') || dataset.category.toLowerCase() === 'economics') {
      return (
        <>
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
        </>
      );
    }
    
    // For health data
    if (dataset.category.toLowerCase() === 'health') {
      return (
        <>
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
        </>
      );
    }
    
    // For education data
    if (dataset.category.toLowerCase() === 'education') {
      return (
        <>
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
        </>
      );
    }
    
    // Default visualization for other dataset types
    return (
      <>
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
      </>
    );
  };

  // Get metrics for the dataset
  const metrics = generateMetrics();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <ChartInsight key={index} {...metric} />
        ))}
      </div>
      
      {insights.length > 0 && (
        <div className="glass border border-border/50 rounded-xl p-6 mt-6">
          <h3 className="text-lg font-medium mb-4">AI-Generated Insights</h3>
          <ul className="space-y-3">
            {insights.map((insight, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mr-2 text-xs font-medium">
                  {index + 1}
                </span>
                <span className="text-foreground/80">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {getAdditionalCharts()}
      </div>
    </div>
  );
};

export default InsightDashboard;
