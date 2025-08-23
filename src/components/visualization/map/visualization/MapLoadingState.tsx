
import React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface MapLoadingStateProps {
  title: string;
  description: string;
}

const MapLoadingState: React.FC<MapLoadingStateProps> = ({ title, description }) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[450px] bg-muted/30 rounded-md flex items-center justify-center">
          <Skeleton className="w-full h-full" />
        </div>
      </CardContent>
    </Card>
  );
};

export default MapLoadingState;
