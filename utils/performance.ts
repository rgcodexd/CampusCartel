// Simple in-memory cache for API responses
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

export const cacheGet = (key: string): any | null => {
  const cached = cache.get(key);
  if (!cached) return null;

  const now = Date.now();
  if (now - cached.timestamp > cached.ttl) {
    cache.delete(key);
    return null;
  }

  return cached.data;
};

export const cacheSet = (key: string, data: any, ttl: number = 5 * 60 * 1000): void => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
};

export const cacheClear = (): void => {
  cache.clear();
};

export const cacheDelete = (key: string): void => {
  cache.delete(key);
};

// Debounce utility for search inputs
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility for scroll events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Image preloading utility
export const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
};

// Batch processing utility
export const batchProcess = async <T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 10
): Promise<R[]> => {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
  }
  
  return results;
};

// Memory usage monitoring (for development)
export const getMemoryUsage = (): { used: number; total: number; percentage: number } => {
  if (typeof performance !== 'undefined' && performance.memory) {
    const memory = performance.memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
    };
  }
  
  return { used: 0, total: 0, percentage: 0 };
};

// Performance measurement utility
export const measurePerformance = <T>(name: string, fn: () => T): T => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  console.log(`${name} took ${end - start}ms`);
  return result;
};

export const measureAsyncPerformance = async <T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> => {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  
  console.log(`${name} took ${end - start}ms`);
  return result;
}; 