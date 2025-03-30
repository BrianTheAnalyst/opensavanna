
import React from 'react';
import { Dataset } from '@/types/dataset';
import { BarChart3, FileText, LineChart, PieChart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InsightDashboard from '@/components/InsightDashboard';
import AdvancedVisualization from '@/components/AdvancedVisualization';
import Visualization from '@/components/Visualization';
import { generateCategoryData, generateTimeSeriesData } from '@/utils/datasetVisualizationUtils';

interface VisualizationTabsProps {
  dataset: Dataset;
  visualizationData: any[];
  insights: string[];
  analysisMode: 'overview' | 'detailed' | 'advanced';
  setAnalysisMode: (mode: 'overview' | 'detailed' | 'advanced') => void;
}

const VisualizationTabs: React.FC<VisualizationTabsProps> = ({ 
  dataset, 
  visualizationData, 
  insights, 
  analysisMode, 
  setAnalysisMode 
}) => {
  return (
    <Tabs value={analysisMode} onValueChange={(v) => setAnalysisMode(v as any)} className="mb-6">
      <TabsList className="glass">
        <TabsTrigger value="overview" className="flex items-center">
          <BarChart3 className="h-4 w-4 mr-2" />
          Overview Analysis
        </TabsTrigger>
        <TabsTrigger value="detailed" className="flex items-center">
          <PieChart className="h-4 w-4 mr-2" />
          Detailed Charts
        </TabsTrigger>
        <TabsTrigger value="advanced" className="flex items-center">
          <LineChart className="h-4 w-4 mr-2" />
          Advanced Visualization
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <div className="pt-4">
          <InsightDashboard 
            dataset={dataset} 
            visualizationData={visualizationData} 
            insights={insights} 
          />
        </div>
      </TabsContent>
      
      <TabsContent value="detailed">
        <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Visualization 
            data={visualizationData} 
            title={`${dataset.title} - Overview`} 
            description="Analysis of key metrics from your dataset"
          />
          
          <Visualization 
            data={generateTimeSeriesData(visualizationData, dataset.category)} 
            title="Trend Analysis" 
            description="Time-based progression of key metrics"
          />
          
          <Visualization 
            data={generateCategoryData(visualizationData, dataset.category)} 
            title="Category Distribution" 
            description="Distribution across different categories"
          />
          
          <div className="glass border border-border/50 rounded-xl p-6">
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
        </div>
      </TabsContent>
      
      <TabsContent value="advanced">
        <div className="pt-4">
          <AdvancedVisualization 
            dataset={dataset}
            data={visualizationData}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default VisualizationTabs;
