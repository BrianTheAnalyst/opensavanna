
import React from 'react';

const LoadingSpinner = () => (
  <div className="text-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-3"></div>
    <p className="text-foreground/70">Loading datasets...</p>
  </div>
);

export default LoadingSpinner;
