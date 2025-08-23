
import { Lightbulb } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InsightsSectionProps {
  insights: string[];
  expanded?: boolean;
  onToggleExpanded?: () => void;
}

const InsightsSection: React.FC<InsightsSectionProps> = ({ 
  insights, 
  expanded = false,
  onToggleExpanded 
}) => {
  if (!insights || insights.length === 0) return null;
  
  return (
    <Card className="border border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <CardTitle className="text-lg font-medium">Key Insights</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {(expanded ? insights : insights.slice(0, 3)).map((insight, index) => (
            <div 
              key={index} 
              className="p-3 bg-muted/40 rounded-lg border border-border/30 hover:bg-muted/60 transition-colors"
            >
              {insight}
            </div>
          ))}
          
          {insights.length > 3 && onToggleExpanded && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={onToggleExpanded}
            >
              {expanded ? 'Show Less' : `Show ${insights.length - 3} More Insights`}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightsSection;
