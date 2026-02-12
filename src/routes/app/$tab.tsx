import { createRoute } from '@tanstack/react-router';
import { Route as rootRoute } from '../__root';
import React, { lazy, Suspense } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const IndexPage = lazy(() => import('@/pages/Index'));

const ProtectedApp = () => (
  <ProtectedRoute>
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <IndexPage />
    </Suspense>
  </ProtectedRoute>
);

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app/$tab',
  component: ProtectedApp,
});
