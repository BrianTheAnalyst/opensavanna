
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingVisualization: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2 text-foreground/70">Analyzing dataset and generating visualizations...</span>
    </div>
  );
};

export default LoadingVisualization;
