
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const LOADING_TIMEOUT = 15000; // 15 seconds

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, authError, retryAuth } = useAuth();
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
    if (isLoading) {
      console.log('ProtectedRoute: Loading started');
      const timer = setTimeout(() => {
        console.warn('ProtectedRoute: Loading timeout reached');
        setLoadingTimeout(true);
      }, LOADING_TIMEOUT);

      return () => {
        clearTimeout(timer);
        setLoadingTimeout(false);
      };
    } else {
      console.log('ProtectedRoute: Loading completed', { isAuthenticated });
      setLoadingTimeout(false);
    }
  }, [isLoading, isAuthenticated]);

  // Show error state if there's an auth error or loading timeout
  if (authError || loadingTimeout) {
    return (
      <div className="min-h-screen bg-ios-secondary-background flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 text-red-500">
            <AlertCircle className="w-full h-full" />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {loadingTimeout ? '连接超时' : '认证错误'}
          </h2>
          
          <p className="text-gray-600 mb-6">
            {authError || '认证系统响应超时，请重试'}
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={retryAuth}
              className="w-full bg-ios-blue hover:bg-ios-blue/90 text-white rounded-ios"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              重试连接
            </Button>
            
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="w-full rounded-ios"
            >
              刷新页面
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            如果问题持续存在，请联系技术支持
          </p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-ios-secondary-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ios-blue mx-auto mb-4"></div>
          <p className="text-gray-600">正在验证身份...</p>
          <p className="text-sm text-gray-500 mt-2">
            首次加载可能需要几秒钟
          </p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    console.log('ProtectedRoute: Redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  // Render protected content
  console.log('ProtectedRoute: Rendering protected content');
  return <>{children}</>;
};
