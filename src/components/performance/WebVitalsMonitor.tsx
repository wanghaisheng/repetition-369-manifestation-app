import { useEffect } from 'react';
import { trackWebVitals, ANALYTICS_CONFIG } from '@/config/analytics';

interface WebVitalsMetric {
  name: string;
  value: number;
  id: string;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  entries: PerformanceEntry[];
}

export const WebVitalsMonitor = () => {
  useEffect(() => {
    // 只在生产环境启用性能监控
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    const initWebVitals = async () => {
      try {
        // 检查web-vitals是否可用，使用更安全的导入方式
        const webVitalsModule = await import('web-vitals').catch(() => null);
        if (!webVitalsModule) {
          console.warn('Web Vitals library not available');
          return;
        }
        const { onCLS, onINP, onFCP, onLCP, onTTFB } = webVitalsModule;

        // 监控Cumulative Layout Shift (CLS)
        onCLS((metric: WebVitalsMetric) => {
          trackWebVitals(metric);
          if (ANALYTICS_CONFIG.DEBUG_MODE) {
            console.log('CLS:', metric);
          }
        });

        // 监控Interaction to Next Paint (INP) - 替代FID
        onINP((metric: WebVitalsMetric) => {
          trackWebVitals(metric);
          if (ANALYTICS_CONFIG.DEBUG_MODE) {
            console.log('INP:', metric);
          }
        });

        // 监控First Contentful Paint (FCP)
        onFCP((metric: WebVitalsMetric) => {
          trackWebVitals(metric);
          if (ANALYTICS_CONFIG.DEBUG_MODE) {
            console.log('FCP:', metric);
          }
        });

        // 监控Largest Contentful Paint (LCP)
        onLCP((metric: WebVitalsMetric) => {
          trackWebVitals(metric);
          if (ANALYTICS_CONFIG.DEBUG_MODE) {
            console.log('LCP:', metric);
          }
        });

        // 监控Time to First Byte (TTFB)
        onTTFB((metric: WebVitalsMetric) => {
          trackWebVitals(metric);
          if (ANALYTICS_CONFIG.DEBUG_MODE) {
            console.log('TTFB:', metric);
          }
        });

      } catch (error) {
        console.warn('Web Vitals monitoring failed to initialize:', error);
      }
    };

    // 延迟初始化以避免影响页面加载
    const timer = setTimeout(initWebVitals, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // 监控自定义性能指标
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          
          // 追踪页面加载时间
          const loadTime = navEntry.loadEventEnd - navEntry.fetchStart;
          if (loadTime > 0) {
            trackWebVitals({
              name: 'page_load_time',
              value: loadTime,
              id: 'custom-plt',
              rating: loadTime < 2000 ? 'good' : loadTime < 4000 ? 'needs-improvement' : 'poor'
            });
          }

          // 追踪DNS查询时间
          const dnsTime = navEntry.domainLookupEnd - navEntry.domainLookupStart;
          if (dnsTime > 0) {
            trackWebVitals({
              name: 'dns_lookup_time',
              value: dnsTime,
              id: 'custom-dns',
              rating: dnsTime < 20 ? 'good' : dnsTime < 200 ? 'needs-improvement' : 'poor'
            });
          }
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['navigation'] });
    } catch (error) {
      console.warn('Performance observer failed to initialize:', error);
    }

    return () => observer.disconnect();
  }, []);

  return null;
};