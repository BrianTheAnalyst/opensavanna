
import React from 'react';

interface InsightsDisplayProps {
  insights: string[];
}

export const InsightsDisplay: React.FC<InsightsDisplayProps> = ({ insights }) => {
  return (
    <div className="glass border border-border/50 rounded-xl p-6 mt-6">
      <h3 className="text-lg font-medium mb-4">AI-Generated Insights</h3>
      <ul className="space-y-3">
        {insights.map((insight, index) => (
          <li key={index} className="flex items-start">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mr-2 text-xs font-medium">
              {index + 1}
            </span>
            <span className="text-foreground/80">{insight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
