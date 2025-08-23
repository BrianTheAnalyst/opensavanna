
import { FileText, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Dataset } from '@/types/dataset';

interface DatasetDetailsProps {
  dataset: Dataset;
  defaultTags: string[];
}

const DatasetDetails = ({ dataset, defaultTags }: DatasetDetailsProps) => {
  return (
    <div className="space-y-6">
      <div className="glass border border-border/50 rounded-xl p-6">
        <h2 className="text-xl font-medium mb-4">Dataset Details</h2>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-foreground/60 mb-1">License</p>
            <p className="font-medium">{dataset.license || 'Open Data License'}</p>
          </div>
          <div>
            <p className="text-xs text-foreground/60 mb-1">Format</p>
            <p className="font-medium flex items-center">
              <FileText className="h-4 w-4 mr-1 text-primary" />
              {dataset.format}
            </p>
          </div>
          <div>
            <p className="text-xs text-foreground/60 mb-1">File Size</p>
            <p className="font-medium">{dataset.fileSize || '2.4 MB'}</p>
          </div>
          <div>
            <p className="text-xs text-foreground/60 mb-1">Data Points</p>
            <p className="font-medium">{dataset.dataPoints || '5,200'}</p>
          </div>
          <div>
            <p className="text-xs text-foreground/60 mb-1">Time Period</p>
            <p className="font-medium">{dataset.timespan || '2010-2023'}</p>
          </div>
          <div>
            <p className="text-xs text-foreground/60 mb-1">Source</p>
            <a 
              href={dataset.source || '#'}
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline flex items-center"
            >
              Visit Original Source
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
      </div>
      
      <div className="glass border border-border/50 rounded-xl p-6">
        <h2 className="text-xl font-medium mb-4">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {(dataset.tags || defaultTags).map((tag: string) => (
            <Link 
              key={tag} 
              to={`/datasets?tag=${tag}`}
              className="text-xs bg-secondary px-2 py-1 rounded-full hover:bg-secondary/80 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DatasetDetails;
