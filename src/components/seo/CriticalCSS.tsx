
import React from 'react';
import { Helmet } from 'react-helmet-async';

export const CriticalCSS = () => {
  const criticalStyles = `
    /* Critical above-the-fold styles */
    .ios-blur {
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }
    
    .safe-bottom {
      padding-bottom: env(safe-area-inset-bottom);
    }
    
    /* Prevent layout shift */
    .min-h-screen {
      min-height: 100vh;
      min-height: 100dvh;
    }
    
    /* 优化的骨架屏动画 */
    .skeleton, .animate-pulse {
      background: linear-gradient(90deg, 
        hsl(var(--muted)) 25%, 
        hsl(var(--muted-foreground) / 0.1) 50%, 
        hsl(var(--muted)) 75%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    
    /* 图片懒加载优化 */
    img[loading="lazy"] {
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
    }
    
    img[loading="lazy"].loaded {
      opacity: 1;
    }
    
    /* 首屏关键样式 - 防止布局偏移 */
    .hero-section {
      min-height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    /* 预优化常用的变换 */
    .transform-gpu {
      transform: translateZ(0);
    }
    
    /* 字体渲染优化 */
    body {
      font-display: swap;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    /* 按钮和交互元素的硬件加速 */
    button, .interactive {
      will-change: transform;
      backface-visibility: hidden;
    }
  `;

  return (
    <Helmet>
      <style>{criticalStyles}</style>
      
      {/* Preload critical fonts - 修复 noscript 格式 */}
      <link
        rel="preload"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
        as="style"
        onLoad={(e) => {
          const target = e.target as HTMLLinkElement;
          target.onload = null;
          target.rel = 'stylesheet';
        }}
      />
      
      {/* 修复 noscript 内容 - 使用字符串而不是JSX */}
      <noscript>
        {`<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />`}
      </noscript>
    </Helmet>
  );
};
