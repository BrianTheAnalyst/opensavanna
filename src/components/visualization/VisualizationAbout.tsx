
import React from 'react';
import { Dataset } from '@/types/dataset';

interface VisualizationAboutProps {
  dataset: Dataset;
}

const VisualizationAbout: React.FC<VisualizationAboutProps> = ({ dataset }) => {
  return (
    <div className="mt-6 p-6 bg-muted/30 rounded-xl">
      <h3 className="text-lg font-medium mb-3">About Data Visualization</h3>
      <p className="text-foreground/70">
        These visualizations are automatically generated based on your {dataset.title} dataset. 
        The charts and insights aim to help you understand patterns and trends in your data.
        For more detailed analysis, you can download the full dataset or use the Advanced Visualization tools.
      </p>
    </div>
  );
};

export default VisualizationAbout;
