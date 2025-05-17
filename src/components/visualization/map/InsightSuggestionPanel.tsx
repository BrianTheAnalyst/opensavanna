
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, ArrowRight, Map, BarChart2, RefreshCw } from 'lucide-react';

interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'spatial' | 'temporal' | 'correlation' | 'anomaly';
  confidence: number; // 0-1
  applied?: boolean;
}

interface InsightSuggestionPanelProps {
  insights: Insight[];
  loading?: boolean;
  onInsightApply: (insightId: string) => void;
  onRefreshInsights: () => void;
}

const InsightSuggestionPanel: React.FC<InsightSuggestionPanelProps> = ({
  insights,
  loading = false,
  onInsightApply,
  onRefreshInsights
}) => {
  // Get icon for insight type
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'spatial': return <Map className="h-4 w-4" />;
      case 'temporal': return <Timeline className="h-4 w-4" />;
      case 'correlation': return <Workflow className="h-4 w-4" />;
      case 'anomaly': return <AlertCircle className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  // Get confidence class based on confidence value
  const getConfidenceClass = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600";
    if (confidence >= 0.6) return "text-amber-600";
    return "text-orange-600";
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md flex items-center">
            <Lightbulb className="h-4 w-4 mr-2" />
            AI Suggested Insights
          </CardTitle>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onRefreshInsights}
            disabled={loading}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-24">
            <div className="text-sm text-muted-foreground">Analyzing data...</div>
          </div>
        ) : insights.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-sm text-muted-foreground">No insights available yet.</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={onRefreshInsights}
            >
              Generate Insights
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map(insight => (
              <div 
                key={insight.id}
                className={`border rounded-md p-3 ${
                  insight.applied ? 'bg-primary/10 border-primary/30' : 'bg-card hover:bg-muted/50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {getInsightIcon(insight.type)}
                    <h4 className="text-sm font-medium">{insight.title}</h4>
                  </div>
                  <div className={`text-xs ${getConfidenceClass(insight.confidence)}`}>
                    {Math.round(insight.confidence * 100)}% confidence
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                <div className="flex justify-end mt-2">
                  <Button
                    size="sm"
                    variant={insight.applied ? "outline" : "default"}
                    className="text-xs h-7"
                    onClick={() => onInsightApply(insight.id)}
                  >
                    {insight.applied ? "Applied" : "Apply"}
                    {!insight.applied && <ArrowRight className="h-3 w-3 ml-1" />}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="text-xs text-muted-foreground mt-4">
          <p>Insights are AI-generated suggestions based on patterns in your data. Apply them to explore different perspectives.</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Import the missing icon components
import { Timeline, AlertCircle, Workflow } from 'lucide-react';

export default InsightSuggestionPanel;
