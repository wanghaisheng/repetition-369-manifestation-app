
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { normalizeUrl, enforceHttps } from '@/utils/seoOptimization';

export const RedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Force HTTPS in production
    if (process.env.NODE_ENV === 'production') {
      enforceHttps();
    }

    // Normalize URL structure
    const normalizedPath = normalizeUrl(location.pathname);
    if (normalizedPath !== location.pathname) {
      navigate(normalizedPath, { replace: true });
    }

    // Handle common redirect patterns
    const redirectMap: Record<string, string> = {
      '/home': '/',
      '/index': '/',
      '/main': '/',
    };

    if (redirectMap[location.pathname]) {
      navigate(redirectMap[location.pathname], { replace: true });
    }
  }, [location, navigate]);

  return null;
};
