// 多语言路由配置

export const SUPPORTED_LANGUAGES = ['zh', 'en'] as const;
export const DEFAULT_LANGUAGE = 'zh';

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

// 营销页面路由配置（需要多语言URL支持）
export const MARKETING_PAGES = [
  { path: '', name: 'landing', component: 'Landing' },
  { path: 'about', name: 'about', component: 'About' },
  { path: 'faq', name: 'faq', component: 'FAQ' },
  { path: 'method369', name: 'method369', component: 'Method369' },
  { path: 'blog', name: 'blog', component: 'Blog' },
  { path: 'user-stories', name: 'user-stories', component: 'UserStories' },
  { path: 'privacy', name: 'privacy', component: 'Privacy' },
  { path: 'terms', name: 'terms', component: 'Terms' },
] as const;

// 应用页面路由（不需要多语言URL）
export const APP_PAGES = [
  { path: 'app', name: 'app', protected: true },
  { path: 'app/:tab', name: 'app-tab', protected: true },
  { path: 'auth', name: 'auth', protected: false },
  { path: 'blog-admin', name: 'blog-admin', protected: true },
  { path: 'admin-stats', name: 'admin-stats', protected: true },
] as const;

// 动态路由（博客文章等）
export const DYNAMIC_PAGES = [
  { path: 'blog/:slug', name: 'blog-post', component: 'BlogPost' },
] as const;
