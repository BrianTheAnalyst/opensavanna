
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
  queryHash: string;
}

interface CacheMetrics {
  hits: number;
  misses: number;
  evictions: number;
}

class IntelligentCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxSize: number;
  private ttl: number; // Time to live in milliseconds
  private metrics: CacheMetrics = { hits: 0, misses: 0, evictions: 0 };

  constructor(maxSize = 100, ttlMinutes = 30) {
    this.maxSize = maxSize;
    this.ttl = ttlMinutes * 60 * 1000;
  }

  // Generate cache key from query and relevant parameters
  private generateKey(query: string, additionalParams?: any): string {
    const normalizedQuery = query.toLowerCase().trim();
    const paramsStr = additionalParams ? JSON.stringify(additionalParams) : '';
    return btoa(normalizedQuery + paramsStr);
  }

  // Check if cache entry is still valid
  private isValid(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp < this.ttl;
  }

  // Evict least recently used items when cache is full
  private evictLRU(): void {
    if (this.cache.size <= this.maxSize) return;

    let lruKey = '';
    let lruTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < lruTime) {
        lruTime = entry.lastAccessed;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey);
      this.metrics.evictions++;
    }
  }

  // Get cached data
  get(query: string, additionalParams?: any): T | null {
    const key = this.generateKey(query, additionalParams);
    const entry = this.cache.get(key);

    if (!entry || !this.isValid(entry)) {
      this.metrics.misses++;
      if (entry) this.cache.delete(key); // Remove expired entry
      return null;
    }

    // Update access metrics
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.metrics.hits++;

    return entry.data;
  }

  // Set cached data
  set(query: string, data: T, additionalParams?: any): void {
    const key = this.generateKey(query, additionalParams);
    const now = Date.now();

    // Evict if necessary
    this.evictLRU();

    this.cache.set(key, {
      data,
      timestamp: now,
      accessCount: 1,
      lastAccessed: now,
      queryHash: key
    });
  }

  // Clear expired entries
  cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttl) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => this.cache.delete(key));
  }

  // Get cache statistics
  getMetrics(): CacheMetrics & { size: number; hitRate: number } {
    const total = this.metrics.hits + this.metrics.misses;
    return {
      ...this.metrics,
      size: this.cache.size,
      hitRate: total > 0 ? this.metrics.hits / total : 0
    };
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
    this.metrics = { hits: 0, misses: 0, evictions: 0 };
  }
}

// Create cache instances for different data types
export const insightsCache = new IntelligentCache(50, 20); // 20 minute TTL for insights
export const visualizationCache = new IntelligentCache(30, 15); // 15 minute TTL for visualization data
export const datasetCache = new IntelligentCache(100, 60); // 60 minute TTL for dataset metadata

// Cleanup function to be called periodically
export const performCacheCleanup = () => {
  insightsCache.cleanup();
  visualizationCache.cleanup();
  datasetCache.cleanup();
};

// Start periodic cleanup (every 5 minutes)
if (typeof window !== 'undefined') {
  setInterval(performCacheCleanup, 5 * 60 * 1000);
}
