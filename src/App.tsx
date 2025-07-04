
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
import { SEOHead } from "@/components/seo/SEOHead";
import { WebAppStructuredData, OrganizationStructuredData } from "@/components/seo/StructuredData";
import { preloadCriticalResources, registerServiceWorker } from "@/utils/performance";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import React, { useEffect } from 'react';

const queryClient = new QueryClient();

// 性能优化初始化
const initializePerformanceOptimizations = () => {
  preloadCriticalResources();
  registerServiceWorker();
  
  // 检查性能模式
  if (localStorage.getItem('performance-mode') === 'true') {
    document.body.classList.add('performance-mode');
  }
};

const App = () => {
  useEffect(() => {
    initializePerformanceOptimizations();
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            {/* Global SEO and Structured Data */}
            <SEOHead 
              title="显化369 - 愿望成真的神奇力量"
              description="基于特斯拉369显化法则的智能练习应用，帮助您系统化实现愿望目标"
            />
            <WebAppStructuredData />
            <OrganizationStructuredData />
            
            {/* Analytics and tracking */}
            <GoogleAnalytics measurementId="G-XXXXXXXXXX" />
            <MicrosoftClarity projectId="XXXXXXXXXX" />
            <GoogleAdsenseAuto adClient="ca-pub-XXXXXXXXXX" />
            
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
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
