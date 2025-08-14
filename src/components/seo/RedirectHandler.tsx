
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SEO_CONFIG } from '@/config/seo';

export const RedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 强制HTTPS重定向（生产环境）
    if (process.env.NODE_ENV === 'production') {
      if (typeof window !== 'undefined' && 
          window.location.protocol !== 'https:' && 
          !window.location.hostname.includes('localhost') &&
          !window.location.hostname.includes('127.0.0.1')) {
        window.location.replace(`https:${window.location.href.substring(window.location.protocol.length)}`);
        return;
      }
    }

    // URL规范化处理
    let normalizedPath = location.pathname;
    
    // 移除尾随斜杠（除了根路径）
    if (normalizedPath !== '/' && normalizedPath.endsWith('/')) {
      normalizedPath = normalizedPath.slice(0, -1);
    }
    
    // 移除重复斜杠
    normalizedPath = normalizedPath.replace(/\/+/g, '/');
    
    // 常见重定向映射
    const redirectMap: Record<string, string> = {
      '/home': '/',
      '/index': '/',
      '/main': '/',
      '/index.html': '/',
      '/home.html': '/',
    };
    
    // 检查是否需要重定向
    if (redirectMap[normalizedPath]) {
      navigate(redirectMap[normalizedPath], { replace: true });
      return;
    }
    
    // 检查路径是否需要规范化
    if (normalizedPath !== location.pathname) {
      navigate(normalizedPath + location.search + location.hash, { replace: true });
      return;
    }

    // 语言路径处理
    const pathSegments = normalizedPath.split('/').filter(Boolean);
    const firstSegment = pathSegments[0];
    
    // 如果第一个段是支持的语言代码，但不是有效路由，则重定向
    if (SEO_CONFIG.SUPPORTED_LANGUAGES.includes(firstSegment) && pathSegments.length === 1) {
      // 语言路径如 /en 重定向到首页并设置语言参数
      navigate(`/?lang=${firstSegment}`, { replace: true });
      return;
    }
    
  }, [location, navigate]);

  return null;
};
