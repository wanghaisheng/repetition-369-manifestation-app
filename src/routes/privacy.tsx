import { createRoute, lazyRouteComponent } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy',
  staticData: {
    seo: {
      title: '隐私政策 - 数据保护与用户隐私 | 显化369',
      description: '显化369应用的隐私政策，了解我们如何保护您的个人信息和数据安全',
      keywords: '隐私政策,数据保护,用户隐私,显化369',
    }
  },
  component: lazyRouteComponent(() => import('@/pages/Privacy')),
});
