
import React from 'react';
import { Info, FileType } from 'lucide-react';

const UploadGuidelines: React.FC = () => {
  return (
    <div className="mt-10 space-y-6">
      <div className="glass border border-border/50 rounded-xl p-6">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium mb-2">Dataset Guidelines</h3>
            <ul className="text-sm text-foreground/70 space-y-2 list-disc pl-4">
              <li>Ensure your data is properly structured with clear headers and consistent formatting.</li>
              <li>Include metadata and sources to provide context for your dataset.</li>
              <li>Remove any personal or sensitive information before uploading.</li>
              <li>For geospatial data, ensure coordinates are in standard format (WGS84).</li>
              <li>Files up to 100MB are accepted, but we recommend optimizing large datasets for better performance.</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="glass border border-border/50 rounded-xl p-6">
        <div className="flex items-start">
          <FileType className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium mb-2">Supported File Formats</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
              <div className="glass-light rounded-lg p-3">
                <div className="text-sm font-medium mb-1">CSV</div>
                <p className="text-xs text-foreground/70">Standard tabular data format</p>
              </div>
              <div className="glass-light rounded-lg p-3">
                <div className="text-sm font-medium mb-1">JSON</div>
                <p className="text-xs text-foreground/70">Structured data objects</p>
              </div>
              <div className="glass-light rounded-lg p-3">
                <div className="text-sm font-medium mb-1">GeoJSON</div>
                <p className="text-xs text-foreground/70">Geospatial vector data</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadGuidelines;
