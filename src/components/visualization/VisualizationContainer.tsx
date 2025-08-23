
import { AlertCircle } from 'lucide-react';
import React from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Dataset } from '@/types/dataset';

import VisualizationFooter from './VisualizationFooter';
import VisualizationHeader from './VisualizationHeader';
import VisualizationTabs from './VisualizationTabs';

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
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border">
        <div className="p-6">
          <VisualizationHeader 
            dataset={dataset} 
            analysisMode={analysisMode} 
            isLoading={isLoading} 
            error={error} 
          />
        </div>
      </div>
      
      <div className="p-6">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Visualization Error</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
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
      
      <VisualizationFooter dataset={dataset} />
    </div>
  );
};

export default VisualizationContainer;
