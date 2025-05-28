
import React from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description }) => (
  <div className="flex h-40 items-center justify-center">
    <div className="text-center">
      <p className="text-muted-foreground">No data available</p>
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
    </div>
  </div>
);

export default EmptyState;
