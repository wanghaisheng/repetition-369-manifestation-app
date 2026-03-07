import { createRoute, lazyRouteComponent } from '@tanstack/react-router';
import { Route as localeRoute } from '../../$locale';

export const Route = createRoute({
  getParentRoute: () => localeRoute,
  path: 'blog',
  component: lazyRouteComponent(() => import('@/pages/Blog')),
});
