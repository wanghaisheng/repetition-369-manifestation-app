import { useEffect, useState } from 'react';
import { trackUserAction } from '@/config/analytics';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  memoryUsage?: number;
}

export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    interactionTime: 0,
  });

  useEffect(() => {
    // 测量页面加载时间
    const measureLoadTime = () => {
      if (performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        setMetrics(prev => ({ ...prev, loadTime }));
        
        // 追踪加载时间
        if (loadTime > 0) {
          trackUserAction('page_load_complete', 'performance', 'load_time', loadTime);
        }
      }
    };

    // 测量首次渲染时间
    const measureRenderTime = () => {
      if (performance.getEntriesByType) {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        
        if (firstPaint) {
          setMetrics(prev => ({ ...prev, renderTime: firstPaint.startTime }));
          trackUserAction('first_paint', 'performance', 'render_time', firstPaint.startTime);
        }
      }
    };

    // 测量内存使用情况（如果支持）
    const measureMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
        setMetrics(prev => ({ ...prev, memoryUsage }));
      }
    };

    // 延迟测量以确保页面完全加载
    const timer = setTimeout(() => {
      measureLoadTime();
      measureRenderTime();
      measureMemory();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // 测量用户交互延迟
  const measureInteraction = (interactionType: string) => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const interactionTime = endTime - startTime;
      
      setMetrics(prev => ({ ...prev, interactionTime }));
      trackUserAction(`interaction_${interactionType}`, 'performance', 'interaction_time', interactionTime);
    };
  };

  return {
    metrics,
    measureInteraction,
  };
};