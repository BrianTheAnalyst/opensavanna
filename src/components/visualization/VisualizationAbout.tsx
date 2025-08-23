
import { ChartBar, LineChart } from 'lucide-react';
import React from 'react';

import { Dataset } from '@/types/dataset';

interface VisualizationAboutProps {
  dataset: Dataset;
}

const VisualizationAbout: React.FC<VisualizationAboutProps> = ({ dataset }) => {
  return (
    <div className="mt-6 p-6 bg-muted/30 rounded-xl">
      <div className="flex items-center mb-3">
        <ChartBar className="h-5 w-5 text-primary mr-2" />
        <h3 className="text-lg font-medium">About Data Visualization</h3>
      </div>
      
      <div className="space-y-3">
        <p className="text-foreground/80">
          These visualizations are automatically generated based on your {dataset.title} dataset. 
          The charts and insights aim to help you understand patterns and trends in your data.
        </p>
        
        <p className="text-foreground/80">
          {dataset.dataPoints ? 
            `This analysis is based on ${typeof dataset.dataPoints === 'number' 
              ? dataset.dataPoints.toLocaleString() 
              : dataset.dataPoints} data points from the dataset.` : 
            'Analysis is based on available data points from the dataset.'
          }
        </p>
        
        <div className="flex items-center mt-2 text-sm text-primary">
          <LineChart className="h-4 w-4 mr-1" />
          <span>For more detailed analysis, use the Advanced Visualization tools</span>
        </div>
      </div>
    </div>
  );
};

export default VisualizationAbout;
