
import { ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

const DefaultFallback = ({ componentName, resetErrorBoundary }: { componentName?: string, resetErrorBoundary: () => void }) => (
  <Alert variant="destructive" className="my-4">
    <AlertTriangle className="h-4 w-4" />
    <AlertTitle>An error occurred</AlertTitle>
    <AlertDescription className="flex flex-col space-y-4">
      <p>
        There was a problem loading {componentName || 'this component'}. 
        Please try refreshing the page or try again later.
      </p>
      <Button 
        size="sm" 
        variant="outline" 
        className="w-fit flex items-center gap-2" 
        onClick={resetErrorBoundary}
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Try Again
      </Button>
    </AlertDescription>
  </Alert>
);

const ErrorBoundaryWrapper = ({ 
  children, 
  fallback,
  componentName
}: ErrorBoundaryWrapperProps) => {
  return (
    <ErrorBoundary 
      fallback={fallback || (
        ({ resetErrorBoundary }) => (
          <DefaultFallback componentName={componentName} resetErrorBoundary={resetErrorBoundary} />
        )
      )}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryWrapper;
