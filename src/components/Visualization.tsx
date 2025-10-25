
import React, { useState, useEffect } from 'react';
import { ChartHeader } from './visualization/ChartHeader';
import { ChartFooter } from './visualization/ChartFooter';
import ChartContainer from './visualization/chart/ChartContainer';
import EmptyChartState from './insights/charts/EmptyChartState';
import { downloadChartData, chartColors } from './visualization/chart/ChartUtils';

interface VisualizationProps {
  data: any;
  title?: string;
  description?: string;
}

// REMOVED: All sample data generation functions
// Strict validation - only real data allowed

const Visualization = ({ data, title, description }: VisualizationProps) => {
  const [activeTab, setActiveTab] = useState('bar');
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (data && Array.isArray(data) && data.length > 0) {
        // STRICT: Validate that the data has the required structure
        const validData = data.filter(item => 
          item && 
          typeof item === 'object' && 
          (item.name || item.category || item.label) &&
          (typeof item.value === 'number' || !isNaN(Number(item.value)))
        );
        
        if (validData.length > 0) {
          console.log("Using provided visualization data:", validData);
          setChartData(validData);
        } else {
          console.warn("Data exists but invalid structure - no visualization possible");
          setChartData([]);
        }
      } else {
        console.warn("No valid data provided for visualization");
        setChartData([]);
      }
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [data, title, description]);
  
  const handleDownload = () => {
    downloadChartData(chartData);
  };
  
  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 animate-pulse shadow-sm">
        <div className="space-y-4">
          <div className="h-6 bg-muted rounded-md w-1/3"></div>
          <div className="h-4 bg-muted rounded-md w-2/3"></div>
          <div className="h-80 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }
  
  if (chartData.length === 0) {
    return <EmptyChartState message="No visualization data available. Please provide valid data." />;
  }

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <ChartHeader 
        title={title} 
        description={description} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDownload={handleDownload}
      />
      
      <div className="p-6 pt-0 bg-gradient-to-b from-background/50 to-background">
        <ChartContainer 
          data={chartData}
          colors={chartColors}
          activeTab={activeTab}
        />
      </div>
      
      <ChartFooter />
    </div>
  );
};

export default Visualization;
