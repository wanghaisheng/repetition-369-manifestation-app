
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SEO_CONFIG } from '@/config/seo';
import { normalizePath, removeLanguagePrefix, isMarketingPage } from '@/utils/languageUrl';

export const RedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');
    
    // 生产环境重定向处理
    if (!isLocalhost) {
      // 1. 强制HTTPS重定向
      if (protocol !== 'https:') {
        window.location.replace(`https:${window.location.href.substring(protocol.length)}`);
        return;
      }
      
      // 2. www 到 non-www 重定向（统一URL格式）
      if (hostname.startsWith('www.')) {
        const nonWwwUrl = window.location.href.replace('://www.', '://');
        window.location.replace(nonWwwUrl);
        return;
      }
    }

    // URL规范化处理
    let normalizedPath = normalizePath(location.pathname);
    
    // 常见重定向映射（考虑语言前缀）
    const pathWithoutLang = removeLanguagePrefix(normalizedPath);
    const redirectMap: Record<string, string> = {
      '/home': '/',
      '/index': '/',
      '/main': '/',
      '/index.html': '/',
      '/home.html': '/',
    };
    
    // 检查是否需要重定向
    if (redirectMap[pathWithoutLang]) {
      const langPrefix = normalizedPath.startsWith('/en') ? '/en' : '';
      const redirectTarget = langPrefix + (redirectMap[pathWithoutLang] === '/' && langPrefix ? '' : redirectMap[pathWithoutLang]);
      navigate(redirectTarget || '/', { replace: true });
      return;
    }
    
    // 检查路径是否需要规范化（移除尾随斜杠）
    if (normalizedPath !== location.pathname) {
      navigate(normalizedPath + location.search + location.hash, { replace: true });
      return;
    }
    
    // 移除默认语言(zh)的显式前缀
    if (normalizedPath.startsWith('/zh/') || normalizedPath === '/zh') {
      const pathWithoutZh = normalizedPath.replace(/^\/zh/, '') || '/';
      navigate(pathWithoutZh + location.search + location.hash, { replace: true });
      return;
    }
    
  }, [location, navigate]);

  return null;
};
