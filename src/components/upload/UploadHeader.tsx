
import React from 'react';

const UploadHeader: React.FC = () => {
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
          <p className="text-foreground/70 mb-4">
            Share your datasets with the community. Contributions will be reviewed before publishing.
          </p>
        </div>
      </div>
    </section>
  );
};

export default UploadHeader;
