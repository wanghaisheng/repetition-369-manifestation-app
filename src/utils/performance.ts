
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

export const trackWebVitals = () => {
  if (typeof window === 'undefined') return;
  
  try {
    // Track Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.log(`${entry.name}: ${entry.value}`);
        
        // Send to analytics if available
        if (window.gtag) {
          window.gtag('event', entry.name, {
            event_category: 'Web Vitals',
            value: Math.round(entry.value),
            non_interaction: true,
          });
        }
      });
    });

    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'cumulative-layout-shift'] });
  } catch (error) {
    console.log('Web vitals tracking error:', error);
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
