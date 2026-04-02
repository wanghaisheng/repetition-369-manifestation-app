import { createRoute, lazyRouteComponent } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/user-stories',
  staticData: {
    seo: {
      titleKey: 'userStories:seo.title',
      descriptionKey: 'userStories:seo.description',
      keywordsKey: 'userStories:seo.keywords',
    }
  },
  component: lazyRouteComponent(() => import('@/pages/UserStories')),
});
