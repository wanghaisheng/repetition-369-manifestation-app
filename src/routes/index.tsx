import { createRoute } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { lazy } from 'react';

const Landing = lazy(() => import('@/pages/Landing'));

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Landing,
});
