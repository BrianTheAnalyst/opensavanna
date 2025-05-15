
import React from 'react';
import { DataInsightResult } from '@/services/dataInsightsService';
import HeaderSection from './sections/HeaderSection';
import VisualizationsSection from './sections/VisualizationsSection';
import ComparisonSection from './sections/ComparisonSection';
import DatasetsSection from './sections/DatasetsSection';
import { Separator } from '@/components/ui/separator';

interface DataInsightsResultProps {
  result: DataInsightResult;
}

const DataInsightsResult: React.FC<DataInsightsResultProps> = ({ result }) => {
  const [showInsights, setShowInsights] = React.useState(true);
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with question, answer and insights */}
      <HeaderSection 
        result={result} 
        showInsights={showInsights} 
        setShowInsights={setShowInsights} 
      />
      
      {/* Visualizations */}
      <VisualizationsSection result={result} />
      
      {/* Comparison Section */}
      <ComparisonSection comparisonResult={result.comparisonResult} />
      
      {/* Datasets Used */}
      <DatasetsSection datasets={result.datasets} />
    </div>
  );
};

export default DataInsightsResult;
