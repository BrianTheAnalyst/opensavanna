
import React from 'react';

interface EmptyDatasetStateProps {
  activeTab: string;
}

const EmptyDatasetState = ({ activeTab }: EmptyDatasetStateProps) => {
  return (
    <div className="text-center py-12 border border-dashed border-border rounded-xl">
      <div className="text-4xl mb-3">📊</div>
      <h3 className="text-lg font-medium mb-1">No datasets {activeTab}</h3>
      <p className="text-foreground/70">
        {activeTab === 'pending' 
          ? 'There are no datasets pending verification at this time.' 
          : `No datasets have been ${activeTab} yet.`}
      </p>
    </div>
  );
};

export default EmptyDatasetState;
