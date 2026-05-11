import { createRouter } from '@tanstack/react-router';
import { Route as rootRoute } from './routes/__root';
import { Route as indexRoute } from './routes/index';
import { Route as aboutRoute } from './routes/about';
import { Route as faqRoute } from './routes/faq';
import { Route as method369Route } from './routes/method369';
import { Route as privacyRoute } from './routes/privacy';
import { Route as termsRoute } from './routes/terms';
import { Route as blogIndexRoute } from './routes/blog/index';
import { Route as blogSlugRoute } from './routes/blog/$slug';
import { Route as userStoriesRoute } from './routes/user-stories';
import { Route as authRoute } from './routes/auth';
import { Route as tryRoute } from './routes/try';
import { Route as localeRoute } from './routes/$locale';
import { Route as localeIndexRoute } from './routes/$locale/index';
import { Route as localeAboutRoute } from './routes/$locale/about';
import { Route as localeFaqRoute } from './routes/$locale/faq';
import { Route as localeMethod369Route } from './routes/$locale/method369';
import { Route as localePrivacyRoute } from './routes/$locale/privacy';
import { Route as localeTermsRoute } from './routes/$locale/terms';
import { Route as localeBlogIndexRoute } from './routes/$locale/blog/index';
import { Route as localeBlogSlugRoute } from './routes/$locale/blog/$slug';
import { Route as localeUserStoriesRoute } from './routes/$locale/user-stories';
import { Route as appIndexRoute } from './routes/app/index';
import { Route as appTabRoute } from './routes/app/$tab';
import { Route as blogAdminRoute } from './routes/blog-admin';
import { Route as adminStatsRoute } from './routes/admin-stats';
import { Route as catchAllRoute } from './routes/$';

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  faqRoute,
  method369Route,
  privacyRoute,
  termsRoute,
  blogIndexRoute,
  blogSlugRoute,
  userStoriesRoute,
  authRoute,
  tryRoute,
  localeRoute.addChildren([
    localeIndexRoute,
    localeAboutRoute,
    localeFaqRoute,
    localeMethod369Route,
    localePrivacyRoute,
    localeTermsRoute,
    localeBlogIndexRoute,
    localeBlogSlugRoute,
    localeUserStoriesRoute,
  ]),
  appIndexRoute,
  appTabRoute,
  blogAdminRoute,
  adminStatsRoute,
  catchAllRoute,
]);

export const router = createRouter({ routeTree } as any);

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
