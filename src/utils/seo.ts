import { SEO_CONFIG, generateCanonicalUrl as configGenerateCanonicalUrl } from '@/config/seo';

// SEO utility functions

export const generatePageTitle = (title: string, includeBrand = true): string => { 
  if (includeBrand && !title.includes(SEO_CONFIG.BRAND_NAME.zh)) {
    return `${title} | ${SEO_CONFIG.DEFAULT_TITLE.zh}`;
  }
  return title;
};

// Re-export from config for backwards compatibility
export const generateCanonicalUrl = configGenerateCanonicalUrl;

export const generateBreadcrumbs = (pathname: string) => {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs = [
    { name: '首页', href: '/' }
  ];

  const routeNames: Record<string, string> = {
    'wishes': '愿望管理',
    'practice': '练习中心', 
    'progress': '进度跟踪',
    'community': '社区分享',
    'auth': '登录注册',
    'about': '关于我们',
    'faq': '常见问题',
    'method369': '369方法',
    'blog': '博客',
    'en': 'English'
  };

  let currentPath = '';
  paths.forEach(path => {
    currentPath += `/${path}`;
    const name = routeNames[path] || path;
    breadcrumbs.push({
      name,
      href: currentPath
    });
  });

  return breadcrumbs;
};

export const generateSitemap = () => {
  const staticPages = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/about', priority: 0.8, changefreq: 'weekly' },
    { url: '/faq', priority: 0.8, changefreq: 'weekly' },
    { url: '/method369', priority: 0.8, changefreq: 'weekly' },
    { url: '/blog', priority: 0.8, changefreq: 'daily' },
    { url: '/user-stories', priority: 0.7, changefreq: 'weekly' },
    { url: '/en', priority: 0.9, changefreq: 'daily' },
    { url: '/en/about', priority: 0.8, changefreq: 'weekly' },
    { url: '/en/faq', priority: 0.8, changefreq: 'weekly' },
    { url: '/en/method369', priority: 0.8, changefreq: 'weekly' },
    { url: '/en/blog', priority: 0.8, changefreq: 'daily' },
    { url: '/auth', priority: 0.5, changefreq: 'monthly' }
  ];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${SEO_CONFIG.DOMAIN}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemapXml;
};

export const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

Sitemap: ${SEO_CONFIG.DOMAIN}/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /.env
Disallow: /config/
Disallow: /blog-admin
Disallow: /admin-stats

# Allow all other content
Allow: /`;
};
