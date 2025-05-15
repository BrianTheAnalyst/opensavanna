
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dataset } from '@/types/dataset';

interface DatasetsSectionProps {
  datasets: Dataset[];
}

const DatasetsSection: React.FC<DatasetsSectionProps> = ({ datasets }) => {
  return (
    <Card className="bg-muted/30">
      <CardHeader>
        <CardTitle className="text-lg">Datasets Used</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {datasets.map(dataset => (
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
  );
};

export default DatasetsSection;
