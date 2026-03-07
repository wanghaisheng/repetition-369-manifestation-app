import { createRoute, redirect, Outlet } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/config/routes';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '$locale',
  beforeLoad: ({ params, location }) => {
    const { locale } = params;
    if (locale === DEFAULT_LANGUAGE) {
      const rest = location.pathname.replace(`/${locale}`, '') || '/';
      throw redirect({ to: rest });
    }
    if (!SUPPORTED_LANGUAGES.includes(locale as any)) {
      throw redirect({ to: '/' });
    }
  },
  component: Outlet,
});
