
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TabsContent } from "@/components/ui/tabs";
import { ChartHeader } from './visualization/ChartHeader';
import { ChartFooter } from './visualization/ChartFooter';
import { toast } from 'sonner';

const colors = ['#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e', '#f97316', '#eab308'];

interface VisualizationProps {
  data: any;
  title?: string;
  description?: string;
}

const Visualization = ({ data, title, description }: VisualizationProps) => {
  const [activeTab, setActiveTab] = useState('bar');
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Sample data if none is provided
  const sampleData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 900 },
    { name: 'Jul', value: 700 },
  ];
  
  useEffect(() => {
    // Process data for visualization
    const timer = setTimeout(() => {
      if (data && Array.isArray(data) && data.length > 0) {
        console.log("Visualization data:", data);
        setChartData(data);
      } else {
        console.log("Using sample data for visualization");
        setChartData(sampleData);
      }
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [data]);
  
  const handleDownload = () => {
    // Implementation for data download
    console.log('Downloading chart data:', chartData);
    
    try {
      // Create CSV content
      const headers = Object.keys(chartData[0]).join(',');
      const rows = chartData.map(item => Object.values(item).join(',')).join('\n');
      const csvContent = `${headers}\n${rows}`;
      
      // Create a blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `chart-data-${Date.now()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Data downloaded successfully', {
        description: 'CSV file has been saved to your downloads folder'
      });
      console.log('Data download complete');
    } catch (error) {
      console.error('Error downloading data:', error);
      toast.error('Failed to download data');
    }
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
  
  // Render the appropriate chart based on activeTab
  const renderChart = () => {
    switch (activeTab) {
      case 'bar':
        return <BarChartContent data={chartData} colors={colors} />;
      case 'line':
        return <LineChartContent data={chartData} colors={colors} />;
      case 'pie':
        return <PieChartContent data={chartData} colors={colors} />;
      default:
        return <BarChartContent data={chartData} colors={colors} />;
    }
  };
  
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
        {renderChart()}
      </div>
      
      <ChartFooter />
    </div>
  );
};

// Extracted components for different chart types
const BarChartContent = ({ data, colors }: { data: any[], colors: string[] }) => (
  <div className="h-80 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }} 
          tickLine={false}
        />
        <YAxis 
          tick={{ fontSize: 12 }} 
          tickLine={false}
          axisLine={false}
        />
        <Tooltip 
          contentStyle={{ 
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: 'none'
          }} 
        />
        <Legend />
        <Bar 
          dataKey="value" 
          fill={colors[0]}
          radius={[4, 4, 0, 0]}
          animationDuration={1000}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const LineChartContent = ({ data, colors }: { data: any[], colors: string[] }) => (
  <div className="h-80 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }} 
          tickLine={false}
        />
        <YAxis 
          tick={{ fontSize: 12 }} 
          tickLine={false}
          axisLine={false}
        />
        <Tooltip 
          contentStyle={{ 
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: 'none'
          }} 
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={colors[1]}
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          animationDuration={1000}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const PieChartContent = ({ data, colors }: { data: any[], colors: string[] }) => (
  <div className="h-80 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          animationDuration={1000}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: 'none'
          }} 
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default Visualization;
