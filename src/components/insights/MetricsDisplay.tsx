
import React from 'react';

import ChartInsight from '../ChartInsight';

import type { Metric } from './metrics';

interface MetricsDisplayProps {
  metrics: Metric[];
}

export const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <ChartInsight key={index} {...metric} />
      ))}
    </div>
  );
};
