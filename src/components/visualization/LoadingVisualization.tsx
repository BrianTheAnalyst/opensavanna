
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingVisualization: React.FC = () => {
  return (
    <div className="glass border border-border/50 rounded-xl p-6 mb-6">
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <span className="text-foreground/70 text-center">Analyzing dataset and generating visualizations...</span>
        <div className="w-full max-w-md mt-6">
          <div className="h-2 bg-primary/10 rounded-full mb-3 animate-pulse"></div>
          <div className="h-2 bg-primary/10 rounded-full mb-3 w-4/5 animate-pulse"></div>
          <div className="h-2 bg-primary/10 rounded-full w-2/3 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingVisualization;
