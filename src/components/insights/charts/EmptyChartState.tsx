
import React from 'react';

interface EmptyChartStateProps {
  message?: string;
}

const EmptyChartState: React.FC<EmptyChartStateProps> = ({ 
  message = "No visualization data available for this dataset."
}) => {
  return (
    <div className="glass border border-border/50 rounded-xl p-6 text-center">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
};

export default EmptyChartState;
