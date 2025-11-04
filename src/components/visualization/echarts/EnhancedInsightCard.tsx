import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EChartsRenderer, ChartType, ChartConfig } from './EChartsRenderer';
import { Badge } from '@/components/ui/badge';

interface EnhancedInsightCardProps {
  title: string;
  description?: string;
  data: any[];
  type: ChartType;
  dataKey?: string;
  nameKey?: string;
  config?: ChartConfig;
  className?: string;
  onDrillDown?: (params: any) => void;
  enableCrossFilter?: boolean;
  badge?: string;
}

const EnhancedInsightCard: React.FC<EnhancedInsightCardProps> = ({
  title,
  description,
  data,
  type,
  dataKey = 'value',
  nameKey = 'name',
  config = {},
  className,
  onDrillDown,
  enableCrossFilter = true,
  badge,
}) => {
  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{title}</CardTitle>
            {badge && <Badge variant="secondary">{badge}</Badge>}
          </div>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-center justify-center bg-muted/30 rounded-lg">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">No data available</p>
              <p className="text-sm text-muted-foreground/70">
                Try adjusting filters or check if the dataset contains data
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          {badge && <Badge variant="secondary">{badge}</Badge>}
        </div>
        {description && <CardDescription className="text-sm">{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="bg-gradient-to-b from-background/50 to-background rounded-lg p-4">
          <EChartsRenderer
            type={type}
            data={data}
            config={config}
            nameKey={nameKey}
            dataKey={dataKey}
            onDrillDown={onDrillDown}
            enableCrossFilter={enableCrossFilter}
            height="300px"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedInsightCard;
