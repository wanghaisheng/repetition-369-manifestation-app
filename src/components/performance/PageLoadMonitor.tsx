
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackWebVitals, monitorMemoryUsage } from '@/utils/performance';

export const PageLoadMonitor = () => {
  const location = useLocation();

  useEffect(() => {
    // 页面加载时跟踪性能指标
    const startTime = performance.now();
    
    // 跟踪Web Vitals
    trackWebVitals();
    
    // 监控内存使用情况
    const memoryCheck = setInterval(() => {
      monitorMemoryUsage();
    }, 30000); // 每30秒检查一次内存
    
    // 计算页面加载时间
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    // 发送页面加载时间到分析平台
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_load_time', {
        event_category: 'Performance',
        value: Math.round(loadTime),
        custom_parameter: location.pathname
      });
    }
    
    console.log(`Page ${location.pathname} loaded in ${loadTime.toFixed(2)}ms`);
    
    return () => {
      clearInterval(memoryCheck);
    };
  }, [location]);

  return null;
};
