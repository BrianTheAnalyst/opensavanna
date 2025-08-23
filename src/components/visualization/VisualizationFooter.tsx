
import React from 'react';

import { Dataset } from '@/types/dataset';

interface VisualizationFooterProps {
  dataset: Dataset;
}

const VisualizationFooter: React.FC<VisualizationFooterProps> = ({ dataset }) => {
  return (
    <div className="border-t border-border/50 p-4 bg-muted/30">
      <div className="flex items-center justify-between">
        <div className="text-xs text-foreground/60">
          Visualization based on {dataset.dataPoints || 'available'} records from {dataset.title}
        </div>
        <div className="text-xs text-foreground/60">
          Last updated: {dataset.date || 'Recently'}
        </div>
      </div>
    </div>
  );
};

export default VisualizationFooter;
