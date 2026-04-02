import { createRoute, lazyRouteComponent } from '@tanstack/react-router';
import { Route as rootRoute } from '../__root';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog/$slug',
  staticData: {
    seo: {
      type: 'article',
    }
  },
  component: lazyRouteComponent(() => import('@/pages/BlogPost')),
});
