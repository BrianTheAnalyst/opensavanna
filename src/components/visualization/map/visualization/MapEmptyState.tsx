
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface MapEmptyStateProps {
  title: string;
  description: string;
}

const MapEmptyState: React.FC<MapEmptyStateProps> = ({ title, description }) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[450px] bg-muted/30 rounded-md flex items-center justify-center p-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">No geographic data found in this dataset.</p>
            <p className="text-sm text-muted-foreground">
              Geographic visualization requires GeoJSON data or coordinates (latitude/longitude).
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapEmptyState;
