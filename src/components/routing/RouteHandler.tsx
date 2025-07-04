
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { redirectToCanonical } from '@/utils/urlOptimization';
import { trackWebVitals } from '@/utils/performance';

export const RouteHandler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // URL规范化处理
    const canonicalPath = redirectToCanonical(location.pathname);
    if (canonicalPath !== location.pathname) {
      navigate(canonicalPath, { replace: true });
      return;
    }

    // 页面访问追踪
    if (window.gtag) {
      window.gtag('config', 'G-XXXXXXXXXX', {
        page_path: location.pathname,
        page_title: document.title
      });
    }

    // 滚动到顶部（对于新页面）
    if (!location.hash) {
      window.scrollTo(0, 0);
    }

    // 性能监控
    trackWebVitals();
  }, [location, navigate]);

  return <>{children}</>;
};
