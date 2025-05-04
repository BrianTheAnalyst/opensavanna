
import React from 'react';
import { DatasetWithEmail } from '@/types/dataset';

interface DatasetMetadataProps {
  dataset: DatasetWithEmail;
}

const DatasetMetadata = ({ dataset }: DatasetMetadataProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
      <div>
        <span className="text-foreground/50">Category:</span> {dataset.category}
      </div>
      <div>
        <span className="text-foreground/50">Format:</span> {dataset.format}
      </div>
      <div>
        <span className="text-foreground/50">Country/Region:</span> {dataset.country}
      </div>
      <div>
        <span className="text-foreground/50">Source:</span> {dataset.source || 'Not specified'}
      </div>
      <div>
        <span className="text-foreground/50">Submitter:</span> {dataset.email}
      </div>
      <div>
        <span className="text-foreground/50">Submitted:</span> {new Date(dataset.created_at || '').toLocaleDateString()}
      </div>
    </div>
  );
};

export default DatasetMetadata;
