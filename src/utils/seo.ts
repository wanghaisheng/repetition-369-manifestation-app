
// SEO utility functions

export const generatePageTitle = (title: string, includeBrand = true): string => { 
  if (includeBrand && !title.includes('显化369')) {
    return `${title} | 显化369 - 愿望成真的神奇力量`;
  }
  return title;
};

export const generateCanonicalUrl = (path: string): string => {
  const baseUrl = 'https://xianghua369.com';
  // Remove trailing slash and clean up path
  const cleanPath = path.replace(/\/$/, '') || '';
  return `${baseUrl}${cleanPath}`;
};

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
    'auth': '登录注册'
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
  const baseUrl = 'https://xianghua369.com';
  const staticPages = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/wishes', priority: 0.8, changefreq: 'weekly' },
    { url: '/practice', priority: 0.8, changefreq: 'weekly' },
    { url: '/progress', priority: 0.7, changefreq: 'weekly' },
    { url: '/community', priority: 0.6, changefreq: 'weekly' },
    { url: '/auth', priority: 0.5, changefreq: 'monthly' }
  ];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
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

Sitemap: https://xianghua369.com/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /.env
Disallow: /config/

# Allow all other content
Allow: /`;
};
