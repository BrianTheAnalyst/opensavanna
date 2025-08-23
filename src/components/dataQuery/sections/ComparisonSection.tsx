
import React from 'react';

import InsightCard from '@/components/InsightCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataInsightResult } from '@/services/dataInsights/types';

interface ComparisonSectionProps {
  comparison: DataInsightResult['comparisonResult'];
}

const ComparisonSection: React.FC<ComparisonSectionProps> = ({ comparison }) => {
  if (!comparison) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{comparison.title}</CardTitle>
        <CardDescription>{comparison.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <InsightCard
          title=""
          data={comparison.data}
          type="bar"
          dataKey="value"
          nameKey="name"
        />
      </CardContent>
    </Card>
  );
};

export default ComparisonSection;
