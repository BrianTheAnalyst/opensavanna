
import React from 'react';
import { Dataset } from '@/types/dataset';
import VisualizationTabs from './VisualizationTabs';
import VisualizationHeader from './VisualizationHeader';
import VisualizationFooter from './VisualizationFooter';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

interface VisualizationContainerProps {
  dataset: Dataset;
  visualizationData: any[];
  insights: string[];
  analysisMode: 'overview' | 'detailed' | 'advanced';
  setAnalysisMode: (mode: 'overview' | 'detailed' | 'advanced') => void;
  isLoading?: boolean;
  error?: string;
  geoJSON?: any | null;
}

const VisualizationContainer: React.FC<VisualizationContainerProps> = ({
  dataset,
  visualizationData,
  insights,
  analysisMode,
  setAnalysisMode,
  isLoading = false,
  error,
  geoJSON
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="glass border border-border/50 rounded-xl overflow-hidden shadow-xl">
        <div className="p-8">
          <VisualizationHeader 
            dataset={dataset} 
            analysisMode={analysisMode} 
            isLoading={isLoading} 
            error={error} 
          />
          
          <Separator className="my-8" />
          
          {error && (
            <Alert variant="destructive" className="mb-8">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Visualization Error</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="min-h-[600px] w-full">
            <VisualizationTabs 
              dataset={dataset}
              visualizationData={visualizationData}
              insights={insights}
              analysisMode={analysisMode}
              setAnalysisMode={setAnalysisMode}
              isLoading={isLoading}
              geoJSON={geoJSON}
            />
          </div>
        </div>
        
        <VisualizationFooter dataset={dataset} />
      </div>
    </div>
  );
};

export default VisualizationContainer;
