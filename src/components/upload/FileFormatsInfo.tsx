
import React from 'react';
import { FileType } from 'lucide-react';

const FileFormatsInfo = () => {
  return (
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
  );
};

export default FileFormatsInfo;
