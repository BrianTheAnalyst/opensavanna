
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

// Enhanced sample data generator based on title/category
const generateEnhancedSampleData = (title?: string, description?: string) => {
  const defaultData = getSampleData();
  
  // If we have a title, try to generate more relevant sample data
  if (title) {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('economic') || titleLower.includes('gdp') || titleLower.includes('income')) {
      return [
        { name: 'Q1 2023', value: 2840 },
        { name: 'Q2 2023', value: 3200 },
        { name: 'Q3 2023', value: 2980 },
        { name: 'Q4 2023', value: 3450 }
      ];
    }
    
    if (titleLower.includes('health') || titleLower.includes('medical')) {
      return [
        { name: 'Hospitals', value: 45 },
        { name: 'Clinics', value: 120 },
        { name: 'Specialists', value: 78 },
        { name: 'General Practice', value: 200 }
      ];
    }
    
    if (titleLower.includes('education') || titleLower.includes('school')) {
      return [
        { name: 'Primary Schools', value: 150 },
        { name: 'Secondary Schools', value: 85 },
        { name: 'Universities', value: 12 },
        { name: 'Vocational', value: 34 }
      ];
    }
    
    if (titleLower.includes('transport') || titleLower.includes('traffic')) {
      return [
        { name: 'Road Transport', value: 65 },
        { name: 'Rail Transport', value: 25 },
        { name: 'Air Transport', value: 8 },
        { name: 'Water Transport', value: 2 }
      ];
    }
  }
  
  return defaultData;
};

const Visualization = ({ data, title, description }: VisualizationProps) => {
  const [activeTab, setActiveTab] = useState('bar');
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (data && Array.isArray(data) && data.length > 0) {
        // Validate that the data has the required structure
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
          console.log("Data exists but invalid structure, using enhanced sample data");
          setChartData(generateEnhancedSampleData(title, description));
        }
      } else {
        console.log("No valid data provided, using enhanced sample data");
        setChartData(generateEnhancedSampleData(title, description));
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
