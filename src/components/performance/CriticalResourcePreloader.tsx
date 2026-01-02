import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

export const CriticalResourcePreloader = () => {
  useEffect(() => {
    // 预加载关键路由的代码 - 在空闲时执行
    const preloadRoutes = () => {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          // 预加载可能访问的页面
          import('@/pages/About');
          import('@/pages/FAQ');
        }, { timeout: 5000 });
      }
    };

    // 等待首屏内容加载完成后预加载
    if (document.readyState === 'complete') {
      preloadRoutes();
    } else {
      window.addEventListener('load', preloadRoutes, { once: true });
    }
  }, []);

  return (
    <Helmet>
      {/* 关键DNS预解析 - 减少DNS查询时间 */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//hziwbeyokjdswlzzmjem.supabase.co" />
      
      {/* 关键资源预连接 - 建立早期连接 */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://hziwbeyokjdswlzzmjem.supabase.co" />
      
      {/* 预取可能访问的页面 - 低优先级 */}
      <link rel="prefetch" href="/about" />
      <link rel="prefetch" href="/faq" />
      <link rel="prefetch" href="/method369" />
    </Helmet>
  );
};