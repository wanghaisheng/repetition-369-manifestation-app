
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthStats {
  initTime: number;
  loadTime: number | null;
  retryCount: number;
  lastError: string | null;
}

export const AuthDebugPanel = () => {
  const { isLoading, isAuthenticated, authError } = useAuth();
  const [stats, setStats] = useState<AuthStats>({
    initTime: Date.now(),
    loadTime: null,
    retryCount: 0,
    lastError: null
  });

  useEffect(() => {
    if (!isLoading && stats.loadTime === null) {
      setStats(prev => ({
        ...prev,
        loadTime: Date.now() - prev.initTime
      }));
      
      console.log('Auth Performance Stats:', {
        loadTime: Date.now() - stats.initTime,
        isAuthenticated,
        authError
      });
    }
  }, [isLoading, isAuthenticated, authError, stats.initTime, stats.loadTime]);

  useEffect(() => {
    if (authError) {
      setStats(prev => ({
        ...prev,
        retryCount: prev.retryCount + 1,
        lastError: authError
      }));
    }
  }, [authError]);

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white p-2 rounded-lg shadow-lg text-xs border z-50 max-w-xs">
      <div className="font-semibold mb-1">Auth Debug</div>
      <div>Status: {isLoading ? 'Loading' : isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
      <div>Load Time: {stats.loadTime ? `${stats.loadTime}ms` : 'Loading...'}</div>
      <div>Retries: {stats.retryCount}</div>
      {authError && (
        <div className="text-red-600 mt-1">
          Error: {authError.substring(0, 50)}...
        </div>
      )}
    </div>
  );
};
