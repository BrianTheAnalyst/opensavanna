
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NoVisualizationData: React.FC = () => {
  return (
    <div className="glass border border-border/50 rounded-xl p-6 mb-6">
      <div className="flex items-start">
        <div className="mr-4 bg-yellow-100 p-2 rounded-full">
          <AlertTriangle className="h-6 w-6 text-yellow-600" />
        </div>
        <div>
          <h2 className="text-xl font-medium mb-2">Visualization Not Available</h2>
          <p className="text-foreground/70 mb-4">
            We couldn't generate visualizations for this dataset. This might be due to the data format or file not being accessible.
          </p>
          <div className="space-y-2 text-sm text-foreground/70 mb-4">
            <p>Possible reasons:</p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>The file format is not supported for visualization</li>
              <li>The dataset file could not be parsed correctly</li>
              <li>The data structure doesn't contain visualization-friendly fields</li>
            </ul>
          </div>
          <div className="flex gap-3">
            <Link to="/datasets">
              <Button variant="outline" size="sm">Browse Other Datasets</Button>
            </Link>
            <Link to="/upload">
              <Button size="sm">Upload New Dataset</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoVisualizationData;
