/**
 * Performance monitoring utilities for tracking page load and Core Web Vitals
 */

export interface PerformanceMetrics {
  totalLoadTime: number;
  connectTime: number;
  renderTime: number;
  lcp?: number;
  fid?: number;
  cls?: number;
}

/**
 * Measure page load performance metrics
 */
export function measurePageLoad(): void {
  if (!window.performance) {
    console.warn('Performance API not available');
    return;
  }

  // Wait for page to fully load
  window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    const connectTime = perfData.responseEnd - perfData.requestStart;
    const renderTime = perfData.domComplete - perfData.domLoading;

    const metrics: PerformanceMetrics = {
      totalLoadTime: pageLoadTime,
      connectTime,
      renderTime,
    };

    logMetrics(metrics);
    sendMetricsToAnalytics(metrics);
  });

  // Monitor Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        const lcp = lastEntry.renderTime || lastEntry.loadTime || 0;
        console.log('LCP (Largest Contentful Paint):', Math.round(lcp), 'ms');
        
        if (lcp > 2500) {
          console.warn('LCP is slower than recommended (> 2.5s)');
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.debug('LCP monitoring not available');
    }

    // Monitor First Input Delay (FID)
    try {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          const fid = entry.processingDuration || 0;
          console.log('FID (First Input Delay):', Math.round(fid), 'ms');
          
          if (fid > 100) {
            console.warn('FID is slower than recommended (> 100ms)');
          }
        });
      }).observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.debug('FID monitoring not available');
    }

    // Monitor Cumulative Layout Shift (CLS)
    try {
      let cls = 0;
      new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            cls += entry.value || 0;
            console.log('CLS (Cumulative Layout Shift):', cls.toFixed(3));
            
            if (cls > 0.1) {
              console.warn('CLS is higher than recommended (> 0.1)');
            }
          }
        });
      }).observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.debug('CLS monitoring not available');
    }
  }
}

/**
 * Log metrics to console in development
 */
function logMetrics(metrics: PerformanceMetrics): void {
  if (import.meta.env.MODE !== 'development') return;

  try {
    const dashboard = `PAGE LOAD PERFORMANCE: Total=${metrics.totalLoadTime}ms, Connect=${metrics.connectTime}ms, Render=${metrics.renderTime}ms`;
    console.log(dashboard);
    
    if (metrics.totalLoadTime > 4000) {
      console.warn('Page load is slower than recommended (> 4s)');
    }
  } catch (e) {
    // Silently fail
  }
}

/**
 * Send metrics to analytics service (Google Analytics, etc.)
 */
function sendMetricsToAnalytics(metrics: PerformanceMetrics): void {
  // Only send in production
  if (import.meta.env.MODE !== 'production') return;

  // Google Analytics integration (if available)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'page_load_time', {
      value: metrics.totalLoadTime,
      event_category: 'performance',
    });

    (window as any).gtag('event', 'connect_time', {
      value: metrics.connectTime,
      event_category: 'performance',
    });
  }

  // Send to custom analytics endpoint
  try {
    fetch('/api/analytics/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        url: window.location.href,
        metrics,
      }),
      // Don't wait for response
      keepalive: true,
    }).catch(() => {
      // Silently fail
    });
  } catch (e) {
    // Analytics error shouldn't break the app
  }
}

/**
 * Get current memory usage (if available)
 */
export function getMemoryUsage(): number | null {
  if ((performance as any).memory) {
    return Math.round((performance as any).memory.usedJSHeapSize / 1048576);
  }
  return null;
}

/**
 * Log memory usage periodically
 */
export function logMemoryUsage(intervalMs: number = 5000): void {
  if (import.meta.env.MODE !== 'development') return;

  setInterval(() => {
    const memory = getMemoryUsage();
    if (memory) {
      console.log(`💾 Memory Usage: ${memory}MB`);
    }
  }, intervalMs);
}

/**
 * Measure execution time of a function
 */
export async function measureAsync<T>(
  label: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  try {
    return await fn();
  } finally {
    const end = performance.now();
    try {
      console.log(`⏱️ ${label}: ${(end - start).toFixed(2)}ms`);
    } catch (e) {
      // Silently fail
    }
  }
}

/**
 * Get performance dashboard data as formatted string
 */
export function getPerformanceDashboard(): string {
  if (!window.performance) {
    return 'Performance API not available';
  }

  const perfData = window.performance.timing;
  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
  const connectTime = perfData.responseEnd - perfData.requestStart;
  const renderTime = perfData.domComplete - perfData.domLoading;
  const dnsTime = perfData.domainLookupEnd - perfData.domainLookupStart;
  const ttfb = perfData.responseStart - perfData.navigationStart;

  const status = pageLoadTime < 2000 ? '✅ EXCELLENT' : pageLoadTime < 4000 ? '⚠️  GOOD' : '❌ SLOW';

  return `
╔════════════════════════════════════════╗
║   PERFORMANCE DASHBOARD                ║
╠════════════════════════════════════════╣
║ Total Load Time      │ ${pageLoadTime}ms
║ Connect Time         │ ${connectTime}ms
║ Render Time          │ ${renderTime}ms
║ DNS Lookup           │ ${dnsTime}ms
║ Time to First Byte   │ ${ttfb}ms
╠════════════════════════════════════════╣
║ Status: ${status}
╚════════════════════════════════════════╝
  `;
}/**
 * Measure execution time of a synchronous function
 */
export function measureSync<T>(label: string, fn: () => T): T {
  const start = performance.now();
  try {
    return fn();
  } finally {
    const end = performance.now();
    console.log(`⏱️ ${label}: ${(end - start).toFixed(2)}ms`);
  }
}
