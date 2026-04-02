import { createRoute, lazyRouteComponent } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  staticData: {
    seo: {
      title: '服务条款 - 使用协议与规则 | 显化369',
      description: '显化369应用的服务条款，了解使用我们服务的规则和条件',
      keywords: '服务条款,使用协议,法律条款,显化369',
    }
  },
  component: lazyRouteComponent(() => import('@/pages/Terms')),
});
