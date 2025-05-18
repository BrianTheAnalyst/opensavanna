
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, ArrowRight, Map, BarChart2, RefreshCw, Clock, AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

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
      case 'temporal': return <Clock className="h-4 w-4" />;
      case 'correlation': return <BarChart2 className="h-4 w-4" />;
      case 'anomaly': return <AlertCircle className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  // Get confidence class based on confidence value
  const getConfidenceBadgeClass = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    if (confidence >= 0.6) return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
    return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
  };

  return (
    <Card className="shadow-sm transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md flex items-center">
            <Lightbulb className="h-4 w-4 mr-2 text-primary" />
            AI Suggested Insights
          </CardTitle>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onRefreshInsights}
            disabled={loading}
            className="h-8 w-8 p-0 rounded-full"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        {loading ? (
          <div className="flex items-center justify-center h-24 animate-pulse">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Analyzing data...
            </div>
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
                className={`border rounded-lg p-3 transition-all ${
                  insight.applied 
                    ? 'bg-primary/5 border-primary/30 shadow-sm'
                    : 'bg-card hover:bg-muted/30 hover:border-muted/80'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded-md ${
                      insight.type === 'anomaly'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                        : insight.type === 'correlation'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                        : insight.type === 'temporal'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                    }`}>
                      {getInsightIcon(insight.type)}
                    </div>
                    <h4 className="text-sm font-medium">{insight.title}</h4>
                  </div>
                  <Badge variant="outline" className={`text-xs ${getConfidenceBadgeClass(insight.confidence)}`}>
                    {Math.round(insight.confidence * 100)}% confidence
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                <div className="flex justify-end mt-2">
                  <Button
                    size="sm"
                    variant={insight.applied ? "outline" : "default"}
                    className="text-xs h-7 transition-all"
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
        
        <div className="text-xs text-muted-foreground mt-4 p-2 bg-muted/50 rounded-md border border-border/40">
          <p>Insights are AI-generated suggestions based on patterns in your data. Apply them to explore different perspectives.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightSuggestionPanel;
