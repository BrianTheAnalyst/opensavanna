
import React from 'react';
import { Info } from 'lucide-react';

const DatasetGuidelines = () => {
  return (
    <div className="glass border border-border/50 rounded-xl p-6">
      <div className="flex items-start">
        <Info className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-medium mb-2">Dataset Guidelines</h3>
          <ul className="text-sm text-foreground/70 space-y-2 list-disc pl-4">
            <li>Ensure your data is properly structured with clear headers and consistent formatting.</li>
            <li>Include metadata and sources to provide context for your dataset.</li>
            <li>Remove any personal or sensitive information before uploading.</li>
            <li>Ensure your data complies with African data protection laws.</li>
            <li>For geospatial data, ensure coordinates are in standard format (WGS84).</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DatasetGuidelines;
