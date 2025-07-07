// Performance optimization utilities

export const preloadCriticalResources = () => {
  if (typeof window === 'undefined') return;
  
  try {
    // 预加载关键资源
    const criticalResources = [
      { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap', as: 'style' }
    ];
    
    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.as === 'style') {
        link.onload = () => {
          link.rel = 'stylesheet';
        };
      }
      document.head.appendChild(link);
    });
  } catch (error) {
    console.log('Preload resources error:', error);
  }
};

export const registerServiceWorker = () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
  
  try {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service worker registration failed, but continue
      console.log('Service worker registration failed');
    });
  } catch (error) {
    console.log('Service worker error:', error);
  }
};

// Track web vitals and send to analytics
export const trackWebVitals = (): void => {
  if (typeof window === 'undefined') return;

  try {
    // Get performance entries
    const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (entries.length > 0) {
      const navigationEntry = entries[0];
      
      // Calculate metrics
      const loadTime = navigationEntry.loadEventEnd - navigationEntry.fetchStart;
      const domContentLoaded = navigationEntry.domContentLoadedEventEnd - navigationEntry.fetchStart;
      
      console.log('Performance metrics:', {
        loadTime,
        domContentLoaded,
        transferSize: navigationEntry.transferSize,
      });

      // Send to analytics if available
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'page_load_time', {
          value: Math.round(loadTime),
          metric_id: 'load_time'
        });
      }
    }

    // Track LCP, FID, CLS using performance observer
    if ('PerformanceObserver' in window) {
      // Track Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as any[];
        const lastEntry = entries[entries.length - 1];
        if (lastEntry && typeof window.gtag === 'function') {
          window.gtag('event', 'web_vitals', {
            metric_name: 'LCP',
            value: Math.round(lastEntry.startTime),
          });
        }
      });
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.log('LCP observer not supported');
      }

      // Track First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as any[];
        entries.forEach((entry) => {
          if (entry.processingStart && typeof window.gtag === 'function') {
            const fid = entry.processingStart - entry.startTime;
            window.gtag('event', 'web_vitals', {
              metric_name: 'FID',
              value: Math.round(fid),
            });
          }
        });
      });

      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.log('FID observer not supported');
      }
    }
  } catch (error) {
    console.log('Performance tracking error:', error);
  }
};

export const monitorMemoryUsage = () => {
  if (typeof window === 'undefined' || !('performance' in window) || !('memory' in (window.performance as any))) return;
  
  try {
    const memory = (window.performance as any).memory;
    const memoryUsage = {
      used: Math.round(memory.usedJSHeapSize / 1048576),
      total: Math.round(memory.totalJSHeapSize / 1048576),
      limit: Math.round(memory.jsHeapSizeLimit / 1048576)
    };
    
    console.log('Memory usage:', memoryUsage);
    
    // Alert if memory usage is high
    if (memoryUsage.used / memoryUsage.limit > 0.8) {
      console.warn('High memory usage detected');
    }
  } catch (error) {
    console.log('Memory monitoring error:', error);
  }
};
