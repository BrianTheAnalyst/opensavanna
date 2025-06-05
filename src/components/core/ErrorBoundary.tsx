
/**
 * Production-ready error boundary with security considerations
 * Handles errors gracefully without exposing sensitive information
 */

import React, { Component, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorId: string | null;
  timestamp: Date | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorId: null,
      timestamp: null
    };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Generate a secure error ID without exposing sensitive information
    const errorId = crypto.randomUUID().slice(0, 8);
    
    return {
      hasError: true,
      errorId,
      timestamp: new Date()
    };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error securely (in production, this would go to a logging service)
    console.error('Error caught by boundary:', {
      errorId: this.state.errorId,
      message: error.message,
      timestamp: this.state.timestamp,
      // Don't log potentially sensitive error details in production
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
        componentStack: errorInfo.componentStack
      })
    });
    
    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }
  
  handleReset = () => {
    this.setState({
      hasError: false,
      errorId: null,
      timestamp: null
    });
  };
  
  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default error UI
      return (
        <Card className="max-w-md mx-auto mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Something went wrong
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
              </AlertDescription>
            </Alert>
            
            {this.state.errorId && (
              <div className="text-xs text-muted-foreground">
                Error ID: <code className="font-mono">{this.state.errorId}</code>
              </div>
            )}
            
            <Button
              onClick={this.handleReset}
              className="w-full"
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      );
    }
    
    return this.props.children;
  }
}
