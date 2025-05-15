
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import InsightCard from '@/components/InsightCard';
import { DataInsightResult } from '@/services/dataInsightsService';

interface ComparisonSectionProps {
  comparisonResult: DataInsightResult['comparisonResult'];
}

const ComparisonSection: React.FC<ComparisonSectionProps> = ({ comparisonResult }) => {
  if (!comparisonResult) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{comparisonResult.title}</CardTitle>
        <CardDescription>{comparisonResult.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <InsightCard
          title=""
          data={comparisonResult.data}
          type="bar"
          dataKey="value"
          nameKey="name"
        />
      </CardContent>
    </Card>
  );
};

export default ComparisonSection;
