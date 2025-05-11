
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((props: { resetErrorBoundary: () => void }) => ReactNode);
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      // Fallback UI when an error occurs
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback({ resetErrorBoundary: this.resetErrorBoundary });
        }
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div 
          className="min-h-[200px] p-8 border border-destructive/50 bg-destructive/10 rounded-lg flex flex-col items-center justify-center text-center"
          role="alert"
          aria-live="assertive"
        >
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" aria-hidden="true" />
          <h3 className="text-xl font-bold mb-2">Something went wrong</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            We encountered an unexpected error while rendering this component. 
            Please try refreshing the page.
          </p>
          <Button 
            onClick={this.resetErrorBoundary} 
            className="flex items-center gap-2"
            aria-label="Refresh page"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
