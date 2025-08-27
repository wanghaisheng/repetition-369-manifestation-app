import React from 'react';
import { Helmet } from 'react-helmet-async';

export const CriticalResourceOptimizer = () => {
  return (
    <Helmet>
      {/* 关键字体预加载 */}
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
      <noscript>
        {`<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />`}
      </noscript>

      {/* 关键图片预加载 */}
      <link rel="preload" href="/369-app-icon.png" as="image" type="image/png" />
      <link rel="preload" href="/369-app-icon-2.png" as="image" type="image/png" />

      {/* 关键脚本预加载 */}
      <link rel="modulepreload" href="/src/main.tsx" />
      <link rel="modulepreload" href="/src/App.tsx" />

      {/* DNS预取和预连接优化 */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="dns-prefetch" href="//clarity.microsoft.com" />
      <link rel="dns-prefetch" href="//c.bing.com" />

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />

      {/* 资源提示 */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
      
      {/* 优化渲染 */}
      <meta name="color-scheme" content="light dark" />
      <meta name="supported-color-schemes" content="light dark" />

      {/* Critical CSS内联 */}
      <style>
        {`
          /* Critical CSS - 首屏关键样式 */
          html {
            line-height: 1.15;
            -webkit-text-size-adjust: 100%;
          }
          
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
              'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
              sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          
          * {
            box-sizing: border-box;
          }
          
          /* 防止布局偏移的占位符样式 */
          .skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
          }
          
          @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          
          /* iOS安全区域适配 */
          .safe-top {
            padding-top: env(safe-area-inset-top);
          }
          
          .safe-bottom {
            padding-bottom: env(safe-area-inset-bottom);
          }
          
          /* 减少首屏加载闪烁 */
          .min-h-screen {
            min-height: 100vh;
            min-height: 100dvh;
          }
          
          /* 关键元素的基础样式 */
          .gradient-bg {
            background: linear-gradient(135deg, rgb(59 130 246), rgb(147 51 234));
          }
          
          .blur-bg {
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
          }
        `}
      </style>
    </Helmet>
  );
};