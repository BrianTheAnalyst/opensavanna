
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';

interface InsightsSectionProps {
  insights: string[];
}

const InsightsSection: React.FC<InsightsSectionProps> = ({ insights }) => {
  const [expandedInsights, setExpandedInsights] = useState(false);
  
  const toggleInsights = () => {
    setExpandedInsights(!expandedInsights);
  };
  
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
          {(expandedInsights ? insights : insights.slice(0, 3)).map((insight, index) => (
            <div 
              key={index} 
              className="p-3 bg-muted/40 rounded-lg border border-border/30 hover:bg-muted/60 transition-colors"
            >
              {insight}
            </div>
          ))}
          
          {insights.length > 3 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={toggleInsights}
            >
              {expandedInsights ? 'Show Less' : `Show ${insights.length - 3} More Insights`}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightsSection;
