
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataInsightResult } from '@/services/dataInsightsService';

interface HeaderSectionProps {
  result: DataInsightResult;
  showInsights: boolean;
  setShowInsights: (show: boolean) => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ 
  result, 
  showInsights, 
  setShowInsights 
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl">Query Results</CardTitle>
            <CardDescription className="mt-1">
              Based on your question: <span className="font-medium">{result.question}</span>
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {result.datasets.map(dataset => (
              <Badge key={dataset.id} variant="outline">
                {dataset.category}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-lg text-foreground/90">{result.answer}</p>
        
        <div className="mt-4 flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center text-sm font-medium"
            onClick={() => setShowInsights(!showInsights)}
          >
            {showInsights ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
            {showInsights ? 'Hide Key Insights' : 'Show Key Insights'}
          </Button>
        </div>
        
        {showInsights && (
          <div className="mt-2 space-y-2">
            {result.insights.map((insight, index) => (
              <div 
                key={index} 
                className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg"
              >
                <div className="h-6 w-6 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">
                  {index + 1}
                </div>
                <p className="text-sm text-foreground/80">{insight}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HeaderSection;
