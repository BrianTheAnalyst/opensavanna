
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DataSourceBadge } from '@/components/ui/data-source-badge';
import { ConfidenceIndicator } from '@/components/ui/confidence-indicator';

interface MapHeaderProps {
  title: string;
  description: string;
  anomalyDetection: boolean;
  data?: any[];
}

const MapHeader: React.FC<MapHeaderProps> = ({ title, description, anomalyDetection, data = [] }) => {
  // Calculate data quality metrics
  const hasValidData = Array.isArray(data) && data.length > 0;
  const dataSource: 'real' | 'empty' = hasValidData ? 'real' : 'empty';
  const recordCount = hasValidData ? data.length : 0;
  const confidence = hasValidData ? Math.min(95, 70 + Math.min(recordCount / 10, 25)) : 0;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Badge variant="outline" className="bg-primary/10">
          {anomalyDetection ? 'Anomaly Detection: On' : 'Standard View'}
        </Badge>
      </div>
      
      {/* Quality Indicators for Map Data */}
      <div className="flex flex-wrap items-center gap-4 p-3 bg-card/50 rounded-lg border border-border">
        <DataSourceBadge 
          dataSource={dataSource}
          recordCount={recordCount}
          className="flex-shrink-0"
        />
        {hasValidData && (
          <ConfidenceIndicator 
            confidence={confidence}
            dataSource={dataSource}
            showDetails={false}
          />
        )}
      </div>
    </div>
  );
};

export default MapHeader;
