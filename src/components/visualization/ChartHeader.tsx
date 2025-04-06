
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, BarChart3, LineChart, PieChart } from 'lucide-react';

interface ChartHeaderProps {
  title?: string;
  description?: string;
  activeTab: string;
  setActiveTab: (value: string) => void;
  onDownload?: () => void;
}

export const ChartHeader: React.FC<ChartHeaderProps> = ({
  title = 'Visualization',
  description,
  activeTab,
  setActiveTab,
  onDownload
}) => {
  return (
    <div className="p-6 pb-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          {description && (
            <p className="text-foreground/70 text-sm">{description}</p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 h-8">
              <TabsTrigger value="bar" className="p-1 px-2">
                <BarChart3 className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="line" className="p-1 px-2">
                <LineChart className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="pie" className="p-1 px-2">
                <PieChart className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {onDownload && (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 gap-1" 
              onClick={onDownload}
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Data</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
