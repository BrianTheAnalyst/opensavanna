
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, AlertTriangle, Target, BarChart3, LineChart } from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  BarChart as RechartsBarChart,
  ScatterChart as RechartsScatterChart,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Line, 
  Bar,
  Scatter,
  ResponsiveContainer 
} from 'recharts';
import { IntelligentVisualization, DataInsight } from '@/services/dataAnalysis/intelligentDataAnalyzer';

interface IntelligentChartProps {
  visualization: IntelligentVisualization;
}

const IntelligentChart: React.FC<IntelligentChartProps> = ({ visualization }) => {
  const renderChart = () => {
    const commonProps = {
      data: visualization.data,
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    };

    switch (visualization.type) {
      case 'line':
        return (
          <RechartsLineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="name" 
              stroke="#64748b" 
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#f8fafc', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
              formatter={(value: any, name: string) => [
                typeof value === 'number' ? value.toFixed(2) : value,
                visualization.yAxis
              ]}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2 }}
              name={visualization.yAxis}
            />
          </RechartsLineChart>
        );

      case 'bar':
        return (
          <RechartsBarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="name" 
              stroke="#64748b" 
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#f8fafc', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
              formatter={(value: any, name: string) => [
                typeof value === 'number' ? value.toFixed(2) : value,
                visualization.yAxis
              ]}
            />
            <Legend />
            <Bar 
              dataKey="value" 
              fill="#3b82f6"
              name={visualization.yAxis}
              radius={[4, 4, 0, 0]}
            />
          </RechartsBarChart>
        );

      case 'scatter':
        return (
          <RechartsScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name={visualization.xAxis}
              stroke="#64748b" 
              fontSize={12}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name={visualization.yAxis}
              stroke="#64748b" 
              fontSize={12}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ 
                backgroundColor: '#f8fafc', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
              formatter={(value: any, name: string) => [
                typeof value === 'number' ? value.toFixed(2) : value,
                name === 'x' ? visualization.xAxis : visualization.yAxis
              ]}
            />
            <Scatter 
              name="Data Points" 
              data={visualization.data} 
              fill="#3b82f6"
            />
          </RechartsScatterChart>
        );

      default:
        return <div className="flex items-center justify-center h-64 text-muted-foreground">Unsupported chart type</div>;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="h-4 w-4" />;
      case 'correlation':
        return <BarChart3 className="h-4 w-4" />;
      case 'anomaly':
        return <AlertTriangle className="h-4 w-4" />;
      case 'threshold':
        return <Target className="h-4 w-4" />;
      default:
        return <LineChart className="h-4 w-4" />;
    }
  };

  const getInsightColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Card className="border-border/50 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl mb-2">{visualization.title}</CardTitle>
            <CardDescription className="text-base">
              {visualization.description}
            </CardDescription>
            <Badge variant="outline" className="mt-2">
              {visualization.purpose}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Chart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        {visualization.insights && visualization.insights.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Key Insights</h4>
            <div className="space-y-3">
              {visualization.insights.map((insight, index) => (
                <Alert key={index} className="border-l-4 border-l-primary">
                  <div className="flex items-start gap-3">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium">{insight.title}</h5>
                        <Badge variant={getInsightColor(insight.impact)} className="text-xs">
                          {insight.impact} impact
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {(insight.confidence * 100).toFixed(0)}% confidence
                        </Badge>
                      </div>
                      <AlertDescription className="text-sm">
                        {insight.description}
                      </AlertDescription>
                      {insight.recommendations && insight.recommendations.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Recommendations:</p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {insight.recommendations.map((rec, recIndex) => (
                              <li key={recIndex} className="flex items-start gap-1">
                                <span>•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IntelligentChart;
