import { useEffect } from 'react';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { normalizePath } from '@/utils/languageUrl';

/**
 * RedirectHandler - 简化版
 * 
 * 只处理客户端 URL 规范化：
 * - 移除尾随斜杠
 * - 移除 /zh 前缀（默认语言不需要前缀）
 * 
 * 注意：HTTP→HTTPS 和 www→non-www 重定向应在 CDN/服务器层配置
 * 不存在的页面应返回 404，而非客户端重定向
 */
export const RedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // URL 规范化：移除尾随斜杠
    const normalizedPath = normalizePath(location.pathname);
    
    if (normalizedPath !== location.pathname) {
      navigate({ to: normalizedPath + location.search + location.hash, replace: true });
      return;
    }
    
    // 移除默认语言(zh)的显式前缀
    if (normalizedPath.startsWith('/zh/') || normalizedPath === '/zh') {
      const pathWithoutZh = normalizedPath.replace(/^\/zh/, '') || '/';
      navigate({ to: pathWithoutZh + location.search + location.hash, replace: true });
      return;
    }
    
  }, [location, navigate]);

  return null;
};
