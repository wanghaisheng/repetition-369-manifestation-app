import React, { useEffect, Suspense, lazy } from 'react';
import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { logger } from '@/utils/logger';
import { WebAppStructuredData, OrganizationStructuredData } from '@/components/seo/StructuredData';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SEOErrorBoundary } from '@/components/seo/SEOErrorBoundary';
import { ANALYTICS_CONFIG } from '@/config/analytics';
import { SearchConsoleVerification } from '@/components/seo/SearchConsoleVerification';
import { WebVitalsMonitor } from '@/components/performance/WebVitalsMonitor';
import { CriticalResourceOptimizer } from '@/components/seo/CriticalResourceOptimizer';
import { PWAInstallPrompt } from '@/components/pwa/PWAInstallPrompt';
import { getLanguageFromPath } from '@/utils/languageUrl';
import { normalizePath } from '@/utils/languageUrl';
import { trackWebVitals } from '@/utils/performance';

const GoogleAnalytics = lazy(() => import('@/components/analytics/GoogleAnalytics').then(m => ({ default: m.GoogleAnalytics })));
const MicrosoftClarity = lazy(() => import('@/components/analytics/MicrosoftClarity').then(m => ({ default: m.MicrosoftClarity })));
const GoogleAdsenseAuto = lazy(() => import('@/components/analytics/GoogleAdsense').then(m => ({ default: m.GoogleAdsenseAuto })));
const CoreWebVitalsReport = lazy(() => import('@/components/performance/CoreWebVitalsReport').then(m => ({ default: m.CoreWebVitalsReport })));
const AuthDebugPanel = lazy(() => import('@/components/auth/AuthDebugPanel').then(m => ({ default: m.AuthDebugPanel })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount) => failureCount < 2,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const initializePerformanceOptimizations = () => {
  try {
    if (localStorage.getItem('performance-mode') === 'true') {
      document.body.classList.add('performance-mode');
    }
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch(logger.warn);
    }
  } catch (error) {
    logger.error('Performance optimization initialization error', error);
  }
};

/**
 * LanguageSync - syncs URL path language to i18n (replaces LanguageRouter)
 */
const LanguageSync = () => {
  const location = useLocation();
  const { i18n } = useTranslation();
  
  useEffect(() => {
    const pathLang = getLanguageFromPath(location.pathname);
    if (i18n.language !== pathLang) {
      i18n.changeLanguage(pathLang);
    }
  }, [location.pathname, i18n]);

  return null;
};

/**
 * RouteEffects - handles analytics, scroll, performance (replaces RouteHandler)
 */
const RouteEffects = () => {
  const location = useLocation();

  useEffect(() => {
    try {
      // GA page tracking
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', 'G-PLACEHOLDER', {
          page_path: location.pathname,
          page_title: document.title
        });
      }
      // Scroll to top
      if (!location.hash) {
        window.scrollTo(0, 0);
      }
      // Performance monitoring
      if (typeof window !== 'undefined') {
        trackWebVitals();
      }
    } catch (error) {
      console.log('Route handler error:', error);
    }
  }, [location.pathname, location.hash]);

  return null;
};

/**
 * RedirectNormalizer - handles trailing slash & /zh prefix removal (replaces RedirectHandler)
 */
const RedirectNormalizer = () => {
  const location = useLocation();
  const navigate = Route.useNavigate();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const normalizedPath = normalizePath(location.pathname);
    
    if (normalizedPath !== location.pathname) {
      navigate({ to: normalizedPath + location.search + location.hash, replace: true });
      return;
    }
    
    if (normalizedPath.startsWith('/zh/') || normalizedPath === '/zh') {
      const pathWithoutZh = normalizedPath.replace(/^\/zh/, '') || '/';
      navigate({ to: pathWithoutZh + location.search + location.hash, replace: true });
      return;
    }
  }, [location, navigate]);

  return null;
};

const PageFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const RootComponent = () => {
  useEffect(() => {
    initializePerformanceOptimizations();
    
    const loadAnalytics = () => {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {}, { timeout: 3000 });
      }
    };
    
    if (document.readyState === 'complete') {
      loadAnalytics();
    } else {
      window.addEventListener('load', loadAnalytics, { once: true });
    }
  }, []);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
              {/* Global SEO */}
              <SEOErrorBoundary>
                <SearchConsoleVerification />
                <CriticalResourceOptimizer />
                <WebAppStructuredData />
                <OrganizationStructuredData />
              </SEOErrorBoundary>
              
              <WebVitalsMonitor />
              
              {/* Lazy analytics */}
              <Suspense fallback={null}>
                <GoogleAnalytics measurementId={ANALYTICS_CONFIG.GA4_MEASUREMENT_ID} />
                <MicrosoftClarity projectId={ANALYTICS_CONFIG.CLARITY_PROJECT_ID} />
                <GoogleAdsenseAuto adClient={ANALYTICS_CONFIG.ADSENSE_CLIENT_ID} />
                <CoreWebVitalsReport />
              </Suspense>
              
              <Toaster />
              
              {/* Route-level logic (replaces LanguageRouter, RouteHandler, RedirectHandler) */}
              <LanguageSync />
              <RedirectNormalizer />
              <RouteEffects />
              
              <Suspense fallback={<PageFallback />}>
                <Outlet />
              </Suspense>
              
              <PWAInstallPrompt />
              
              <Suspense fallback={null}>
                <AuthDebugPanel />
              </Suspense>
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
});
