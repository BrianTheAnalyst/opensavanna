
import React, { useState, useEffect } from 'react';
import { Dataset } from '@/types/dataset';
import { BarChart3, FileText, LineChart, PieChart, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import InsightDashboard from '@/components/InsightDashboard';
import AdvancedVisualization from '@/components/AdvancedVisualization';
import Visualization from '@/components/Visualization';
import { generateCategoryData, generateTimeSeriesData } from '@/utils/datasetVisualizationUtils';
import { Skeleton } from '@/components/ui/skeleton';

interface VisualizationTabsProps {
  dataset: Dataset;
  visualizationData: any[];
  insights: string[];
  analysisMode: 'overview' | 'detailed' | 'advanced';
  setAnalysisMode: (mode: 'overview' | 'detailed' | 'advanced') => void;
  isLoading?: boolean;
}

const VisualizationTabs: React.FC<VisualizationTabsProps> = ({ 
  dataset, 
  visualizationData, 
  insights, 
  analysisMode, 
  setAnalysisMode,
  isLoading = false
}) => {
  // Validate data before rendering
  const isDataValid = Array.isArray(visualizationData) && visualizationData.length > 0;
  const [activeTab, setActiveTab] = useState<string>(analysisMode);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check viewport width for responsive design
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  // Ensure the tabs stay in sync with the parent component's analysisMode
  useEffect(() => {
    setActiveTab(analysisMode);
  }, [analysisMode]);

  // Handle tab change and update parent's analysisMode
  const handleTabChange = (value: string) => {
    const mode = value as 'overview' | 'detailed' | 'advanced';
    setActiveTab(value);
    setAnalysisMode(mode);
    toast.info(`Switched to ${value} visualization mode`);
  };
  
  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
      <TabsList className={`glass ${isMobile ? 'grid grid-cols-3 w-full' : ''}`}>
        <TabsTrigger value="overview" className="flex items-center">
          <BarChart3 className="h-4 w-4 mr-2" />
          {!isMobile && "Overview Analysis"}
        </TabsTrigger>
        <TabsTrigger value="detailed" className="flex items-center">
          <PieChart className="h-4 w-4 mr-2" />
          {!isMobile && "Detailed Charts"}
        </TabsTrigger>
        <TabsTrigger value="advanced" className="flex items-center">
          <LineChart className="h-4 w-4 mr-2" />
          {!isMobile && "Advanced Visualization"}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <div className="pt-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          ) : (
            <InsightDashboard 
              dataset={dataset} 
              visualizationData={visualizationData} 
              insights={insights} 
            />
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="detailed">
        <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            <>
              <Skeleton className="h-80 w-full rounded-lg" />
              <Skeleton className="h-80 w-full rounded-lg" />
              <Skeleton className="h-80 w-full rounded-lg" />
              <Skeleton className="h-80 w-full rounded-lg" />
            </>
          ) : !isDataValid ? (
            <div className="col-span-2">
              <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Unable to generate detailed charts. The dataset may not contain visualization-friendly data.
                </AlertDescription>
              </Alert>
              <Button 
                onClick={() => setAnalysisMode('overview')} 
                variant="outline" 
                className="mt-4"
              >
                Return to Overview
              </Button>
            </div>
          ) : (
            <>
              <div className={isMobile ? "col-span-1" : ""}>
                <Visualization 
                  data={visualizationData} 
                  title={`${dataset.title} - Overview`} 
                  description="Analysis of key metrics from your dataset"
                />
              </div>
              
              <div className={isMobile ? "col-span-1" : ""}>
                <Visualization 
                  data={generateTimeSeriesData(visualizationData, dataset.category)} 
                  title="Trend Analysis" 
                  description="Time-based progression of key metrics"
                />
              </div>
              
              <div className={isMobile ? "col-span-1" : ""}>
                <Visualization 
                  data={generateCategoryData(visualizationData, dataset.category)} 
                  title="Category Distribution" 
                  description="Distribution across different categories"
                />
              </div>
              
              <div className={`glass border border-border/50 rounded-xl p-6 ${isMobile ? "col-span-1" : ""}`}>
                <h3 className="text-lg font-medium mb-3">Key Insights</h3>
                {insights.length > 0 ? (
                  <ul className="space-y-2">
                    {insights.slice(0, 5).map((insight, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block h-5 w-5 text-xs flex items-center justify-center rounded-full bg-primary/10 text-primary mr-2 mt-0.5">
                          {index + 1}
                        </span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-foreground/70">No insights available for this dataset</p>
                )}
                
                <div className="flex items-center mt-4 pt-4 border-t border-border/50">
                  <FileText className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">Analysis based on {dataset.title}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="advanced">
        <div className="pt-4">
          {isLoading ? (
            <Skeleton className="h-96 w-full rounded-lg" />
          ) : !isDataValid ? (
            <div>
              <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Unable to generate advanced visualization. The dataset may not contain visualization-friendly data.
                </AlertDescription>
              </Alert>
              <Button 
                onClick={() => setAnalysisMode('overview')} 
                variant="outline" 
                className="mt-4"
              >
                Return to Overview
              </Button>
            </div>
          ) : (
            <AdvancedVisualization 
              dataset={dataset}
              data={visualizationData}
            />
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default VisualizationTabs;
