
import React from 'react';
import { Dataset } from '@/types/dataset';
import { Separator } from "@/components/ui/separator";
import DatasetSidebarInfo from '@/components/dataset/DatasetSidebarInfo';
import DatasetVerificationStatus from '@/components/dataset/DatasetVerificationStatus';

interface DatasetHeaderProps {
  dataset: Dataset;
  handleDownload: () => void;
  onDataChange?: () => void; // Add onDataChange prop
}

const DatasetHeader: React.FC<DatasetHeaderProps> = ({ dataset, handleDownload, onDataChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 animate-fade-in">
      <div className="md:col-span-2">
        <div className="mb-4">
          {dataset.verificationStatus && (
            <DatasetVerificationStatus dataset={dataset} className="mb-4" />
          )}
          <h1 className="text-3xl font-medium tracking-tight mb-2">{dataset.title}</h1>
          <p className="text-foreground/70">{dataset.description}</p>
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex flex-wrap gap-3">
          {dataset.tags ? (
            dataset.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-secondary rounded-full text-xs font-medium">
                {tag}
              </span>
            ))
          ) : (
            <>
              <span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium">
                {dataset.category}
              </span>
              <span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium">
                {dataset.country}
              </span>
              <span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium">
                {dataset.format}
              </span>
            </>
          )}
        </div>
      </div>
      
      <div>
        <DatasetSidebarInfo dataset={dataset} onDataChange={onDataChange} />
      </div>
    </div>
  );
};

export default DatasetHeader;
