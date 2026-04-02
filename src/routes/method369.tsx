import { createRoute, lazyRouteComponent } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/method369',
  staticData: {
    seo: {
      titleKey: 'method369:seo.title',
      descriptionKey: 'method369:seo.description',
      keywordsKey: 'method369:seo.keywords',
      type: 'article',
    }
  },
  component: lazyRouteComponent(() => import('@/pages/Method369')),
});
