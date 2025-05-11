
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  fullPage?: boolean;
}

export function Loading({
  text = 'Loading...',
  size = 'md',
  className,
  iconClassName,
  textClassName,
  fullPage = false
}: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const containerClasses = fullPage 
    ? 'flex flex-col items-center justify-center min-h-[50vh]' 
    : 'flex flex-col items-center py-6';

  return (
    <div className={cn(containerClasses, className)} role="status" aria-live="polite">
      <Loader2 className={cn(`animate-spin ${sizeClasses[size]} text-primary`, iconClassName)} aria-hidden="true" />
      {text && <p className={cn("mt-2 text-sm text-muted-foreground", textClassName)}>{text}</p>}
      <span className="sr-only">Loading content</span>
    </div>
  );
}
