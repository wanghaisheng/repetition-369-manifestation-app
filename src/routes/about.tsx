import { createRoute, lazyRouteComponent } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  staticData: {
    seo: {
      titleKey: 'about:seo.title',
      descriptionKey: 'about:seo.description',
      keywordsKey: 'about:seo.keywords',
      type: 'article',
    }
  },
  component: lazyRouteComponent(() => import('@/pages/About')),
});
