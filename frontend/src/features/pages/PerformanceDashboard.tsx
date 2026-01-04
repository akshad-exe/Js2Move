import { useEffect, useState } from 'react';
import { getPerformanceDashboard, getMemoryUsage } from '@/lib/utils/performance';

interface Metrics {
  totalLoadTime: number;
  connectTime: number;
  renderTime: number;
  dnsTime: number;
  ttfb: number;
  memory?: number | null;
}

export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [memory, setMemory] = useState<number | null>(null);

  useEffect(() => {
    // Collect metrics after page load
    const timer = setTimeout(() => {
      if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        const totalLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const connectTime = perfData.responseEnd - perfData.requestStart;
        const renderTime = perfData.domComplete - perfData.domLoading;
        const dnsTime = perfData.domainLookupEnd - perfData.domainLookupStart;
        const ttfb = perfData.responseStart - perfData.navigationStart;
        const memoryUsage = getMemoryUsage();

        setMetrics({
          totalLoadTime,
          connectTime,
          renderTime,
          dnsTime,
          ttfb,
          memory: memoryUsage,
        });
      }
    }, 2000);

    // Update memory every 3 seconds
    const memoryInterval = setInterval(() => {
      const memory = getMemoryUsage();
      setMemory(memory);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(memoryInterval);
    };
  }, []);

  const getStatus = (loadTime: number) => {
    if (loadTime < 1000) return { text: 'EXCELLENT', color: 'text-green-500', icon: '✅' };
    if (loadTime < 2000) return { text: 'GOOD', color: 'text-blue-500', icon: '👍' };
    if (loadTime < 4000) return { text: 'OK', color: 'text-yellow-500', icon: '⚠️' };
    return { text: 'SLOW', color: 'text-red-500', icon: '❌' };
  };

  if (!metrics) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-gray-400">Collecting performance metrics...</div>
      </div>
    );
  }

  const status = getStatus(metrics.totalLoadTime);

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Performance Dashboard</h1>

        {/* Status Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-2">Overall Status</p>
              <p className={`text-3xl font-bold ${status.color}`}>
                {status.icon} {status.text}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm mb-2">Load Time</p>
              <p className="text-4xl font-bold text-white">{metrics.totalLoadTime}ms</p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <MetricCard
            label="Total Load Time"
            value={`${metrics.totalLoadTime}ms`}
            benchmark="< 2000ms"
            warning={metrics.totalLoadTime > 2000}
          />
          <MetricCard
            label="Connect Time"
            value={`${metrics.connectTime}ms`}
            benchmark="< 500ms"
            warning={metrics.connectTime > 500}
          />
          <MetricCard
            label="Render Time"
            value={`${metrics.renderTime}ms`}
            benchmark="< 1000ms"
            warning={metrics.renderTime > 1000}
          />
          <MetricCard
            label="DNS Lookup"
            value={`${metrics.dnsTime}ms`}
            benchmark="< 100ms"
            warning={metrics.dnsTime > 100}
          />
          <MetricCard
            label="Time to First Byte"
            value={`${metrics.ttfb}ms`}
            benchmark="< 600ms"
            warning={metrics.ttfb > 600}
          />
          <MetricCard
            label="Memory Usage"
            value={memory ? `${memory}MB` : (metrics.memory ? `${metrics.memory}MB` : 'N/A')}
            benchmark="< 100MB"
            warning={memory ? memory > 100 : metrics.memory ? metrics.memory > 100 : false}
          />
        </div>

        {/* Recommendations */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recommendations</h2>
          <div className="space-y-3 text-gray-400 text-sm">
            {metrics.totalLoadTime > 4000 && (
              <div className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span>Total load time is high. Consider: enabling code splitting, lazy loading routes, optimizing images</span>
              </div>
            )}
            {metrics.renderTime > 1000 && (
              <div className="flex items-start gap-3">
                <span className="text-yellow-500 mt-1">•</span>
                <span>Render time is high. Consider: reducing component complexity, memoizing expensive renders</span>
              </div>
            )}
            {metrics.connectTime > 500 && (
              <div className="flex items-start gap-3">
                <span className="text-yellow-500 mt-1">•</span>
                <span>Connect time is high. Consider: using CDN, optimizing server response, enabling compression</span>
              </div>
            )}
            {metrics.ttfb > 600 && (
              <div className="flex items-start gap-3">
                <span className="text-yellow-500 mt-1">•</span>
                <span>Time to First Byte is high. Consider: optimizing backend, enabling caching, reducing payload</span>
              </div>
            )}
            {metrics.totalLoadTime <= 2000 && metrics.renderTime <= 1000 && metrics.connectTime <= 500 && (
              <div className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span>Great! Your application is loading efficiently.</span>
              </div>
            )}
          </div>
        </div>

        {/* View Metrics Button */}
        <div className="mt-8">
          <button
            onClick={() => {
              const dashboard = getPerformanceDashboard();
              console.log(dashboard);
              alert('Performance metrics logged to console. Press F12 to see them.');
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            View Full Metrics in Console
          </button>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  benchmark: string;
  warning?: boolean;
}

function MetricCard({ label, value, benchmark, warning }: MetricCardProps) {
  return (
    <div className={`bg-gray-900 border rounded-lg p-4 ${warning ? 'border-yellow-600' : 'border-gray-800'}`}>
      <p className="text-gray-400 text-sm mb-2">{label}</p>
      <p className={`text-2xl font-bold mb-2 ${warning ? 'text-yellow-500' : 'text-white'}`}>{value}</p>
      <p className="text-gray-500 text-xs">Benchmark: {benchmark}</p>
    </div>
  );
}
