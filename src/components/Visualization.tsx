
import React, { useState, useEffect } from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { ChartHeader } from './visualization/ChartHeader';
import { ChartFooter } from './visualization/ChartFooter';
import ChartContainer from './visualization/chart/ChartContainer';
import { downloadChartData, getSampleData, chartColors } from './visualization/chart/ChartUtils';

interface VisualizationProps {
  data: any;
  title?: string;
  description?: string;
}

const Visualization = ({ data, title, description }: VisualizationProps) => {
  const [activeTab, setActiveTab] = useState('bar');
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    // Process data for visualization
    const timer = setTimeout(() => {
      if (data && Array.isArray(data) && data.length > 0) {
        console.log("Visualization data:", data);
        setChartData(data);
      } else {
        console.log("Using sample data for visualization");
        setChartData(getSampleData());
      }
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [data]);
  
  const handleDownload = () => {
    downloadChartData(chartData);
  };
  
  if (isLoading) {
    return (
      <div className="glass border border-border/50 rounded-xl p-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-muted rounded w-2/3 mb-6"></div>
        <div className="h-64 bg-muted rounded"></div>
      </div>
    );
  }
  
  return (
    <div className="glass border border-border/50 rounded-xl overflow-hidden">
      <ChartHeader 
        title={title} 
        description={description} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDownload={handleDownload}
      />
      
      <div className="p-6 pt-0">
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
