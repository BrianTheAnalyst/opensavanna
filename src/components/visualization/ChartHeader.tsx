
import { Download, BarChart3, LineChart, PieChart } from 'lucide-react';
import React from 'react';

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ChartHeaderProps {
  title?: string;
  description?: string;
  activeTab: string;
  setActiveTab: (value: string) => void;
  onDownload?: () => void;
}

export const ChartHeader: React.FC<ChartHeaderProps> = ({
  title = 'Data Visualization',
  description,
  activeTab,
  setActiveTab,
  onDownload
}) => {
  return (
    <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold text-foreground">{title}</h3>
            {description && (
              <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
                {description}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 h-10 bg-background/50 border border-border">
                <TabsTrigger 
                  value="bar" 
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Bar</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="line" 
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <LineChart className="h-4 w-4" />
                  <span className="hidden sm:inline">Line</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="pie" 
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <PieChart className="h-4 w-4" />
                  <span className="hidden sm:inline">Pie</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            {onDownload && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-10 gap-2 bg-background/50 hover:bg-background" 
                onClick={onDownload}
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export Data</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
