
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface UploadPageHeaderProps {
  isLoggedIn: boolean;
}

const UploadPageHeader = ({ isLoggedIn }: UploadPageHeaderProps) => {
  return (
    <section className="bg-muted/30 py-12">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block px-3 py-1 mb-2 text-xs font-medium text-primary bg-primary/10 rounded-full">
            Contribute Data
          </div>
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">
            Upload a New Dataset
          </h1>
          <p className="text-foreground/70 mb-2">
            Share your datasets with the African data commons community. All uploads require verification before publishing.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4 inline-flex items-center text-sm text-amber-800">
            <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>Submissions are reviewed by our team before being published to ensure data quality and compliance with African data protection laws.</span>
          </div>
          {!isLoggedIn && (
            <p className="text-destructive mb-4">
              You need to be logged in to upload datasets.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default UploadPageHeader;
