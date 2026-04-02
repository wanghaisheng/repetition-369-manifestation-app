import { createRoute, lazyRouteComponent } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/faq',
  staticData: {
    seo: {
      titleKey: 'faq:seo.title',
      descriptionKey: 'faq:seo.description',
      keywordsKey: 'faq:seo.keywords',
    }
  },
  component: lazyRouteComponent(() => import('@/pages/FAQ')),
});
