
import React from 'react';
import { BarChart3, LineChart, PieChart, Download } from 'lucide-react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface ChartHeaderProps {
  title?: string;
  description?: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onDownload: () => void;
}

export const ChartHeader = ({
  title,
  description,
  activeTab,
  setActiveTab,
  onDownload
}: ChartHeaderProps) => {
  return (
    <div className="p-6 pb-0">
      {title && <h3 className="text-xl font-medium mb-1">{title}</h3>}
      {description && <p className="text-foreground/70 mb-4">{description}</p>}
      
      <div className="flex items-center justify-between mb-4">
        <TabsList className="glass">
          <TabsTrigger value="bar" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Bar Chart</span>
          </TabsTrigger>
          <TabsTrigger value="line" className="flex items-center">
            <LineChart className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Line Chart</span>
          </TabsTrigger>
          <TabsTrigger value="pie" className="flex items-center">
            <PieChart className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Pie Chart</span>
          </TabsTrigger>
        </TabsList>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onDownload}
          className="text-xs"
        >
          <Download className="h-3 w-3 mr-1" />
          Download Data
        </Button>
      </div>
    </div>
  );
};
