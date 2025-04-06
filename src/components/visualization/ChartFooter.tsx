
import React from 'react';

export const ChartFooter = () => {
  const currentDate = new Date();
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  
  return (
    <div className="border-t border-border/50 p-4 bg-muted/30">
      <div className="text-xs text-foreground/60">
        This visualization is based on the latest available data. Last updated: {month} {year}
      </div>
    </div>
  );
};
