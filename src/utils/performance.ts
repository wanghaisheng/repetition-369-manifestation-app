
// Performance optimization utilities

// 懒加载图片
export const lazyLoadImage = (img: HTMLImageElement, src: string) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        img.src = src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });
  
  observer.observe(img);
};

// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

// 节流函数
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// 缓存管理
class CacheManager {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttl: number = 300000) { // 默认5分钟
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear() {
    this.cache.clear();
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }
}

export const cache = new CacheManager();

// Web Vitals 监控
export const trackWebVitals = () => {
  if (typeof window === 'undefined') return;

  // FCP (First Contentful Paint)
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      console.log(`${entry.name}: ${entry.startTime}ms`);
      
      // 发送到分析平台
      if (window.gtag) {
        window.gtag('event', entry.name, {
          event_category: 'Web Vitals',
          value: Math.round(entry.startTime),
          non_interaction: true,
        });
      }
    });
  });

  observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });

  // CLS (Cumulative Layout Shift)
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        clsValue += (entry as any).value;
      }
    }
  });

  clsObserver.observe({ entryTypes: ['layout-shift'] });

  // FID (First Input Delay) - 页面卸载时报告
  window.addEventListener('beforeunload', () => {
    if (window.gtag && clsValue > 0) {
      window.gtag('event', 'CLS', {
        event_category: 'Web Vitals',
        value: Math.round(clsValue * 1000),
        non_interaction: true,
      });
    }
  });
};

// 预加载关键资源
export const preloadCriticalResources = () => {
  const criticalResources = [
    '/src/components/views/HomeView.tsx',
    '/src/components/views/PracticeView.tsx'
  ];

  criticalResources.forEach((resource) => {
    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.href = resource;
    document.head.appendChild(link);
  });
};

// 代码分割和懒加载组件
export const createLazyComponent = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) => {
  return React.lazy(importFn);
};

// 内存使用监控
export const monitorMemoryUsage = () => {
  if (!('memory' in performance)) return;

  const memInfo = (performance as any).memory;
  const usage = {
    used: Math.round(memInfo.usedJSHeapSize / 1048576), // MB
    total: Math.round(memInfo.totalJSHeapSize / 1048576), // MB
    limit: Math.round(memInfo.jsHeapSizeLimit / 1048576) // MB
  };

  console.log('Memory Usage:', usage);
  
  // 如果内存使用超过80%，触发清理
  if (usage.used / usage.limit > 0.8) {
    cache.clear();
    console.log('Memory cleanup triggered');
  }

  return usage;
};

// Service Worker 注册
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered:', registration);
      return registration;
    } catch (error) {
      console.error('SW registration failed:', error);
      return null;
    }
  }
  return null;
};

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
