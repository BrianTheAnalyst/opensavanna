
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DataInsightResult } from '@/services/dataInsights/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquareText } from 'lucide-react';
import HeaderSection from './sections/HeaderSection';
import VisualizationsSection from './sections/VisualizationsSection';
import ComparisonSection from './sections/ComparisonSection';
import DatasetsSection from './sections/DatasetsSection';

interface DataInsightsResultProps {
  result: DataInsightResult;
  onFollowUpClick?: (question: string) => void;
}

const DataInsightsResult = ({ result, onFollowUpClick }: DataInsightsResultProps) => {
  const [expandedInsights, setExpandedInsights] = useState(false);
  
  const toggleInsights = () => {
    setExpandedInsights(!expandedInsights);
  };
  
  const handleFollowUpClick = (question: string) => {
    if (onFollowUpClick) {
      onFollowUpClick(question);
    }
  };
  
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <HeaderSection
        question={result.question}
        answer={result.answer}
      />
      
      {/* Follow-up Questions */}
      {result.followUpQuestions && result.followUpQuestions.length > 0 && (
        <Card className="border border-border/50 shadow-sm">
          <CardContent className="pt-6">
            <div className="mb-3 flex items-center gap-2">
              <MessageSquareText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Explore Further</h3>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {result.followUpQuestions.map((question, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  className="border-primary/30 hover:border-primary hover:bg-primary/5"
                  onClick={() => handleFollowUpClick(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Main visualizations */}
      <VisualizationsSection visualizations={result.visualizations} />
      
      {/* Comparison if available */}
      {result.comparisonResult && (
        <ComparisonSection comparison={result.comparisonResult} />
      )}
      
      {/* Insights */}
      <Card className="border border-border/50 shadow-sm">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-3">Key Insights</h3>
          <div className="space-y-3">
            {(expandedInsights ? result.insights : result.insights.slice(0, 3)).map((insight, index) => (
              <div 
                key={index} 
                className="p-3 bg-muted/40 rounded-lg border border-border/30"
              >
                {insight}
              </div>
            ))}
            
            {result.insights.length > 3 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={toggleInsights}
              >
                {expandedInsights ? 'Show Less' : `Show ${result.insights.length - 3} More Insights`}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Dataset information */}
      <DatasetsSection 
        datasets={result.datasets}
      />
    </div>
  );
};

export default DataInsightsResult;
