
import React from 'react';

const NoVisualizationData: React.FC = () => {
  return (
    <div className="glass border border-border/50 rounded-xl p-6 mb-6">
      <h2 className="text-xl font-medium mb-4">Visualization Not Available</h2>
      <p className="text-foreground/70 mb-6">
        We couldn't generate visualizations for this dataset. This might be due to the data format or file not being accessible.
      </p>
    </div>
  );
};

export default NoVisualizationData;
