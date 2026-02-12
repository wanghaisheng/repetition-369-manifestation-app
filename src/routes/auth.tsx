import { createRoute, lazyRouteComponent } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: (search.redirect as string) || '/app',
  }),
  component: lazyRouteComponent(() => import('@/pages/Auth')),
});
