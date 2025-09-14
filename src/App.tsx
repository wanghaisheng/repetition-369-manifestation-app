import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RouteHandler } from "@/components/routing/RouteHandler";
import { RedirectHandler } from "@/components/seo/RedirectHandler";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { MicrosoftClarity } from "@/components/analytics/MicrosoftClarity";
import { GoogleAdsenseAuto } from "@/components/analytics/GoogleAdsense";
import { WebAppStructuredData, OrganizationStructuredData } from "@/components/seo/StructuredData";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthDebugPanel } from "@/components/auth/AuthDebugPanel";
import { SEOErrorBoundary } from "@/components/seo/SEOErrorBoundary";
import { ANALYTICS_CONFIG, isValidAnalyticsId } from '@/config/analytics';
import { SearchConsoleVerification } from "@/components/seo/SearchConsoleVerification";
import { WebVitalsMonitor } from "@/components/performance/WebVitalsMonitor";
import { CoreWebVitalsReport } from "@/components/performance/CoreWebVitalsReport";
import { CriticalResourceOptimizer } from "@/components/seo/CriticalResourceOptimizer";
import Index from "./pages/Index";
import Auth from "@/pages/Auth";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import UserStories from "@/pages/UserStories";
import { BlogManagement } from "./components/blog/BlogManagement";
import Landing from "./pages/Landing";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Method369 from "./pages/Method369";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import { PWAInstallPrompt } from "@/components/pwa/PWAInstallPrompt";
import React, { useEffect } from 'react';

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
      navigator.serviceWorker.register('/sw.js').catch(console.log);
    }
  } catch (error) {
    console.log('Performance optimization initialization error:', error);
  }
};

const App = () => {
  useEffect(() => {
    initializePerformanceOptimizations();
  }, []);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
              {/* 全局SEO和性能优化组件 */}
              <SEOErrorBoundary>
                <SearchConsoleVerification />
                <CriticalResourceOptimizer />
                <WebAppStructuredData />
                <OrganizationStructuredData />
              </SEOErrorBoundary>
              
              {/* 性能监控 */}
              <WebVitalsMonitor />
              <CoreWebVitalsReport />
              
              {/* 分析和追踪 - 使用配置文件中的真实ID */}
              <GoogleAnalytics measurementId={ANALYTICS_CONFIG.GA4_MEASUREMENT_ID} />
              <MicrosoftClarity projectId={ANALYTICS_CONFIG.CLARITY_PROJECT_ID} />
              <GoogleAdsenseAuto adClient={ANALYTICS_CONFIG.ADSENSE_CLIENT_ID} />
              
              <Toaster />
              <BrowserRouter>
                <RedirectHandler />
                <RouteHandler>
                  <Routes>
                    {/* Public marketing landing page */}
                    <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/method369" element={<Method369 />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/user-stories" element={<UserStories />} />
        <Route path="/blog-admin" element={
          <ProtectedRoute>
            <BlogManagement />
          </ProtectedRoute>
        } />
                    
                    {/* Authentication route */}
                    <Route path="/auth" element={<Auth />} />
                    
                    {/* Protected main application */}
                    <Route path="/app" element={
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    } />
                    
                    {/* Redirect any other routes to landing */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </RouteHandler>
              </BrowserRouter>
              
              {/* PWA Install Prompt */}
              <PWAInstallPrompt />
              
              {/* Debug panel for development */}
              <AuthDebugPanel />
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
