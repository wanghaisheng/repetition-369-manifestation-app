import { createRoute, lazyRouteComponent } from '@tanstack/react-router';
import { Route as rootRoute } from '../__root';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog',
  staticData: {
    seo: {
      title: '369显化法博客 - 成功案例与方法技巧 | 显化369',
      description: '探索369显化方法的成功案例、实践技巧和创始人故事',
      keywords: '显化369博客,显化方法,成功案例,创始人故事,独立开发',
    }
  },
  component: lazyRouteComponent(() => import('@/pages/Blog')),
});
