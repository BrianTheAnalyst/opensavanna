
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface InsightsDisplayProps {
  insights: string[];
}

export const InsightsDisplay: React.FC<InsightsDisplayProps> = ({ insights }) => {
  if (!insights || insights.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-primary" />
          AI-Generated Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-background/50 rounded-lg border border-border/50">
              <div className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                {index + 1}
              </div>
              <p className="text-foreground/90 leading-relaxed text-sm">{insight}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
