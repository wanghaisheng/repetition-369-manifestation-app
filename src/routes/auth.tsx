import { createRoute, lazyRouteComponent } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  staticData: {
    seo: {
      title: '登录 - 显化369',
      description: '登录或注册显化369账户，开始您的愿望实现之旅',
      keywords: '显化369登录,注册,用户账户,愿望实现,369方法',
    }
  },
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: (search.redirect as string) || '/app',
  }),
  component: lazyRouteComponent(() => import('@/pages/Auth')),
});
