import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

export const CriticalResourcePreloader = () => {
  useEffect(() => {
    // 预加载关键资源
    const preloadCriticalResources = () => {
      const resources = [
        // 关键字体
        {
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
          as: 'style',
          crossOrigin: 'anonymous'
        },
        // 关键图片（如果有的话）
        {
          href: '/369-app-icon.png',
          as: 'image',
          type: 'image/png'
        }
      ];

      resources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        if (resource.crossOrigin) {
          link.crossOrigin = resource.crossOrigin;
        }
        if (resource.type) {
          link.type = resource.type;
        }
        
        // 避免重复添加
        if (!document.querySelector(`link[href="${resource.href}"]`)) {
          document.head.appendChild(link);
        }
      });
    };

    // 延迟执行以避免阻塞初始渲染
    const timer = setTimeout(preloadCriticalResources, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Helmet>
      {/* 关键DNS预解析 */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="dns-prefetch" href="//c.clarity.ms" />
      
      {/* 关键资源预连接 */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      
      {/* 关键CSS预加载 */}
      <link
        rel="preload"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        as="style"
        onLoad={(e) => {
          const target = e.target as HTMLLinkElement;
          target.onload = null;
          target.rel = 'stylesheet';
        }}
      />
      
      {/* 备用样式表加载 */}
      <noscript>
        {`<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />`}
      </noscript>
      
      {/* Resource Hints for performance */}
      <link rel="prefetch" href="/wishes" />
      <link rel="prefetch" href="/practice" />
      <link rel="prefetch" href="/about" />
      
      {/* 预加载关键脚本 */}
      <link rel="modulepreload" href="/src/main.tsx" />
    </Helmet>
  );
};