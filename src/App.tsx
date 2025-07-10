
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RouteHandler } from "@/components/routing/RouteHandler";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { MicrosoftClarity } from "@/components/analytics/MicrosoftClarity";
import { GoogleAdsenseAuto } from "@/components/analytics/GoogleAdsense";
import { WebAppStructuredData, OrganizationStructuredData } from "@/components/seo/StructuredData";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthDebugPanel } from "@/components/auth/AuthDebugPanel";
import { SEOErrorBoundary } from "@/components/seo/SEOErrorBoundary";
import { preloadCriticalResources, registerServiceWorker } from "@/utils/performance";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
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
    preloadCriticalResources();
    registerServiceWorker();
    
    // 检查性能模式
    if (localStorage.getItem('performance-mode') === 'true') {
      document.body.classList.add('performance-mode');
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
              {/* 全局结构化数据 - 使用错误边界保护 */}
              <SEOErrorBoundary>
                <WebAppStructuredData />
                <OrganizationStructuredData />
              </SEOErrorBoundary>
              
              {/* 分析和追踪 - 使用占位符ID */}
              <GoogleAnalytics measurementId="G-PLACEHOLDER" />
              <MicrosoftClarity projectId="PLACEHOLDER" />
              <GoogleAdsenseAuto adClient="ca-pub-PLACEHOLDER" />
              
              <Toaster />
              <BrowserRouter>
                <RouteHandler>
                  <Routes>
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/" element={
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    } />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </RouteHandler>
              </BrowserRouter>
              
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
