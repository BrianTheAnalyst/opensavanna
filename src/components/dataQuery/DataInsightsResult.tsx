
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DataInsightResult } from '@/services/dataInsightsService';
import InsightCard from '@/components/InsightCard';
import { Badge } from '@/components/ui/badge';
import MapVisualization from '@/components/visualization/MapVisualization';

interface DataInsightsResultProps {
  result: DataInsightResult;
}

const DataInsightsResult: React.FC<DataInsightsResultProps> = ({ result }) => {
  const [showInsights, setShowInsights] = React.useState(true);
  
  return (
    <div className="space-y-6 animate-fade-in">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {result.visualizations.map((viz, index) => {
          if (viz.type === 'map') {
            return (
              <Card key={index} className="md:col-span-2">
                <CardHeader>
                  <CardTitle>{viz.title}</CardTitle>
                  <CardDescription>Geographic visualization of data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <MapVisualization
                      data={viz.data}
                      title={viz.title}
                      description="Geographic data representation"
                      isLoading={false}
                      category=""
                      geoJSON={null}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          }
          
          return (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{viz.title}</CardTitle>
                <CardDescription>
                  Visualization based on {viz.data.length} data points
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InsightCard
                  title=""
                  data={viz.data}
                  type={viz.type}
                  dataKey="value"
                  nameKey="name"
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {result.comparisonResult && (
        <Card>
          <CardHeader>
            <CardTitle>{result.comparisonResult.title}</CardTitle>
            <CardDescription>{result.comparisonResult.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <InsightCard
              title=""
              data={result.comparisonResult.data}
              type="bar"
              dataKey="value"
              nameKey="name"
            />
          </CardContent>
        </Card>
      )}
      
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">Datasets Used</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {result.datasets.map(dataset => (
              <div key={dataset.id} className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 12H5M5 12C6.10457 12 7 11.1046 7 10C7 8.89543 6.10457 8 5 8H3V16H5C6.10457 16 7 15.1046 7 14C7 12.8954 6.10457 12 5 12ZM12 16V12M12 8V12M12 12H16M21 12H16M16 12V8M16 12V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{dataset.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{dataset.description}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {dataset.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{dataset.date}</span>
                  </div>
                </div>
                <Button asChild size="sm" variant="outline">
                  <a href={`/datasets/${dataset.id}`} target="_blank" rel="noopener noreferrer">
                    View Dataset
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataInsightsResult;
