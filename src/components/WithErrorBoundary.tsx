
import React, { ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';

interface WithErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const WithErrorBoundary: React.FC<WithErrorBoundaryProps> = ({ 
  children, 
  fallback 
}) => {
  return (
    <ErrorBoundary fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
};

export default WithErrorBoundary;
