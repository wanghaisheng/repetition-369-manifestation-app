import { createRoute, lazyRouteComponent } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/try',
  staticData: {
    seo: {
      title: '免费试用 369 显化法 - 无需注册立即体验 | 显化369',
      description: '无需注册，30 秒生成你的专属肯定句，立即开始 369 书写练习。感受显化的力量，再决定是否注册。',
      keywords: '369试用,免注册体验,显化法体验,肯定句生成,369书写',
    },
  },
  component: lazyRouteComponent(() => import('@/pages/Try')),
});
