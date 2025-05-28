
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ChartRenderer from './InsightCard/ChartRenderer';
import EmptyState from './InsightCard/EmptyState';
import { useProcessedData } from './InsightCard/dataProcessor';
import { InsightCardProps, DEFAULT_COLORS } from './InsightCard/types';

const InsightCard: React.FC<InsightCardProps> = ({
  title,
  description,
  data,
  type,
  dataKey,
  nameKey = 'name',
  colors = DEFAULT_COLORS,
  className,
  tooltipFormatter,
  xAxisLabel,
  yAxisLabel
}) => {
  const processedData = useProcessedData(data, dataKey, nameKey);
  
  if (processedData.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <EmptyState title={title} description={description} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartRenderer
          type={type}
          data={processedData}
          colors={colors}
          tooltipFormatter={tooltipFormatter}
          xAxisLabel={xAxisLabel}
          yAxisLabel={yAxisLabel}
        />
      </CardContent>
    </Card>
  );
};

export default InsightCard;
