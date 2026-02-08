import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "@/contexts/AuthContext";
import { logger } from '@/utils/logger';
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RouteHandler } from "@/components/routing/RouteHandler";
import { LanguageRouter } from "@/components/routing/LanguageRouter";
import { RedirectHandler } from "@/components/seo/RedirectHandler";
import { WebAppStructuredData, OrganizationStructuredData } from "@/components/seo/StructuredData";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SEOErrorBoundary } from "@/components/seo/SEOErrorBoundary";
import { ANALYTICS_CONFIG } from '@/config/analytics';
import { SearchConsoleVerification } from "@/components/seo/SearchConsoleVerification";
import { WebVitalsMonitor } from "@/components/performance/WebVitalsMonitor";
import { CriticalResourceOptimizer } from "@/components/seo/CriticalResourceOptimizer";
import { PWAInstallPrompt } from "@/components/pwa/PWAInstallPrompt";
import React, { useEffect, Suspense, lazy } from 'react';

// 关键页面直接导入（首屏加载）
import Landing from "./pages/Landing";

// 非关键页面懒加载（代码分割）
const About = lazy(() => import("./pages/About"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Method369 = lazy(() => import("./pages/Method369"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const UserStories = lazy(() => import("@/pages/UserStories"));
const Auth = lazy(() => import("@/pages/Auth"));
const Index = lazy(() => import("./pages/Index"));
const BlogManagement = lazy(() => import("./components/blog/BlogManagement").then(m => ({ default: m.BlogManagement })));
const AdminStats = lazy(() => import("./pages/AdminStats"));
const NotFound = lazy(() => import("./pages/NotFound"));

// 延迟加载第三方分析组件
const GoogleAnalytics = lazy(() => import("@/components/analytics/GoogleAnalytics").then(m => ({ default: m.GoogleAnalytics })));
const MicrosoftClarity = lazy(() => import("@/components/analytics/MicrosoftClarity").then(m => ({ default: m.MicrosoftClarity })));
const GoogleAdsenseAuto = lazy(() => import("@/components/analytics/GoogleAdsense").then(m => ({ default: m.GoogleAdsenseAuto })));
const CoreWebVitalsReport = lazy(() => import("@/components/performance/CoreWebVitalsReport").then(m => ({ default: m.CoreWebVitalsReport })));
const AuthDebugPanel = lazy(() => import("@/components/auth/AuthDebugPanel").then(m => ({ default: m.AuthDebugPanel })));

// 页面加载骨架屏
const PageFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => failureCount < 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// 性能优化初始化
const initializePerformanceOptimizations = () => {
  try {
    // 检查性能模式
    if (localStorage.getItem('performance-mode') === 'true') {
      document.body.classList.add('performance-mode');
    }
    
    // 基础性能优化
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch(logger.warn);
    }
  } catch (error) {
    logger.error('Performance optimization initialization error', error);
  }
};

const App = () => {
  useEffect(() => {
    initializePerformanceOptimizations();
    
    // 延迟加载第三方脚本，不阻塞首屏渲染
    const loadAnalytics = () => {
      // 在页面空闲时加载分析脚本
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          // 分析脚本会通过lazy组件加载
        }, { timeout: 3000 });
      }
    };
    
    // 等待首屏渲染完成后加载
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
              {/* 全局SEO组件 - 轻量级，不阻塞渲染 */}
              <SEOErrorBoundary>
                <SearchConsoleVerification />
                <CriticalResourceOptimizer />
                <WebAppStructuredData />
                <OrganizationStructuredData />
              </SEOErrorBoundary>
              
              {/* 性能监控 - 不影响渲染 */}
              <WebVitalsMonitor />
              
              {/* 延迟加载的分析组件 */}
              <Suspense fallback={null}>
                <GoogleAnalytics measurementId={ANALYTICS_CONFIG.GA4_MEASUREMENT_ID} />
                <MicrosoftClarity projectId={ANALYTICS_CONFIG.CLARITY_PROJECT_ID} />
                <GoogleAdsenseAuto adClient={ANALYTICS_CONFIG.ADSENSE_CLIENT_ID} />
                <CoreWebVitalsReport />
              </Suspense>
              
              <Toaster />
              <BrowserRouter>
                <LanguageRouter>
                  <RedirectHandler />
                  <RouteHandler>
                    <Suspense fallback={<PageFallback />}>
                      <Routes>
                        {/* 默认语言（中文）- 无前缀 */}
                        <Route path="/" element={<Landing />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/method369" element={<Method369 />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:slug" element={<BlogPost />} />
                        <Route path="/user-stories" element={<UserStories />} />
                        
                        {/* 英文版本 - /en 前缀 */}
                        <Route path="/en" element={<Landing />} />
                        <Route path="/en/about" element={<About />} />
                        <Route path="/en/faq" element={<FAQ />} />
                        <Route path="/en/method369" element={<Method369 />} />
                        <Route path="/en/privacy" element={<Privacy />} />
                        <Route path="/en/terms" element={<Terms />} />
                        <Route path="/en/blog" element={<Blog />} />
                        <Route path="/en/blog/:slug" element={<BlogPost />} />
                        <Route path="/en/user-stories" element={<UserStories />} />
                        
                        {/* Admin routes */}
                        <Route path="/blog-admin" element={
                          <ProtectedRoute>
                            <BlogManagement />
                          </ProtectedRoute>
                        } />
                        <Route path="/admin-stats" element={
                          <ProtectedRoute>
                            <AdminStats />
                          </ProtectedRoute>
                        } />
                        
                        {/* Authentication route */}
                        <Route path="/auth" element={<Auth />} />
                        
                        {/* Protected main application */}
                        <Route path="/app" element={<Navigate to="/app/home" replace />} />
                        <Route path="/app/:tab" element={
                          <ProtectedRoute>
                            <Index />
                          </ProtectedRoute>
                        } />
                        
                        {/* 404 for unknown routes - proper SEO handling */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </RouteHandler>
                </LanguageRouter>
              </BrowserRouter>
              
              {/* PWA Install Prompt */}
              <PWAInstallPrompt />
              
              {/* Debug panel - 延迟加载 */}
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

export default App;
