
import React from 'react';
import { Dataset } from '@/types/dataset';
import VisualizationTabs from './VisualizationTabs';

interface VisualizationContainerProps {
  dataset: Dataset;
  visualizationData: any[];
  insights: string[];
  analysisMode: 'overview' | 'detailed' | 'advanced';
  setAnalysisMode: (mode: 'overview' | 'detailed' | 'advanced') => void;
}

const VisualizationContainer: React.FC<VisualizationContainerProps> = ({
  dataset,
  visualizationData,
  insights,
  analysisMode,
  setAnalysisMode
}) => {
  return (
    <div className="glass border border-border/50 rounded-xl p-6 mb-6">
      <h2 className="text-xl font-medium mb-4">Visualize This Dataset</h2>
      <p className="text-foreground/70 mb-6">
        Explore the data through interactive visualizations. Select different views and parameters to discover insights.
      </p>
      
      <VisualizationTabs 
        dataset={dataset}
        visualizationData={visualizationData}
        insights={insights}
        analysisMode={analysisMode}
        setAnalysisMode={setAnalysisMode}
      />
    </div>
  );
};

export default VisualizationContainer;
