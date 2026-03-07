import { createRoute, lazyRouteComponent } from '@tanstack/react-router';
import { Route as localeRoute } from '../$locale';

export const Route = createRoute({
  getParentRoute: () => localeRoute,
  path: 'method369',
  component: lazyRouteComponent(() => import('@/pages/Method369')),
});
