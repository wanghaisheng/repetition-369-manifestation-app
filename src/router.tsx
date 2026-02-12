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
import { Route as enIndexRoute } from './routes/en/index';
import { Route as enAboutRoute } from './routes/en/about';
import { Route as enFaqRoute } from './routes/en/faq';
import { Route as enMethod369Route } from './routes/en/method369';
import { Route as enPrivacyRoute } from './routes/en/privacy';
import { Route as enTermsRoute } from './routes/en/terms';
import { Route as enBlogIndexRoute } from './routes/en/blog/index';
import { Route as enBlogSlugRoute } from './routes/en/blog/$slug';
import { Route as enUserStoriesRoute } from './routes/en/user-stories';
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
  enIndexRoute,
  enAboutRoute,
  enFaqRoute,
  enMethod369Route,
  enPrivacyRoute,
  enTermsRoute,
  enBlogIndexRoute,
  enBlogSlugRoute,
  enUserStoriesRoute,
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
