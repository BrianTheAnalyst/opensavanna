
/**
 * Performance optimization utilities
 * Memory-efficient and optimized for production use
 */

/**
 * Debounce function calls to improve performance
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttle function calls to limit execution frequency
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Memory-efficient array chunking for large datasets
 */
export function* chunkArray<T>(array: readonly T[], size: number): Generator<T[]> {
  for (let i = 0; i < array.length; i += size) {
    yield array.slice(i, i + size);
  }
}

/**
 * Lazy loading wrapper for expensive operations
 */
export class LazyLoader<T> {
  private value?: T;
  private loaded = false;
  
  constructor(private loader: () => T) {}
  
  get(): T {
    if (!this.loaded) {
      this.value = this.loader();
      this.loaded = true;
    }
    return this.value!;
  }
  
  reset(): void {
    this.value = undefined;
    this.loaded = false;
  }
}
