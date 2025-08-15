// 动态sitemap生成工具

export interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  alternates?: { lang: string; href: string }[];
}

export const generateSitemap = (entries: SitemapEntry[], baseUrl = 'https://369.heymanifestation.com'): string => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  
  const urlsetOpening = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;
  
  const urls = entries.map(entry => {
    const url = entry.url.startsWith('http') ? entry.url : `${baseUrl}${entry.url}`;
    
    let urlXml = `  <url>
    <loc>${url}</loc>`;
    
    if (entry.lastmod) {
      urlXml += `
    <lastmod>${entry.lastmod}</lastmod>`;
    }
    
    if (entry.changefreq) {
      urlXml += `
    <changefreq>${entry.changefreq}</changefreq>`;
    }
    
    if (entry.priority !== undefined) {
      urlXml += `
    <priority>${entry.priority}</priority>`;
    }
    
    // 添加多语言alternates
    if (entry.alternates) {
      entry.alternates.forEach(alternate => {
        const altHref = alternate.href.startsWith('http') ? alternate.href : `${baseUrl}${alternate.href}`;
        urlXml += `
    <xhtml:link rel="alternate" hreflang="${alternate.lang}" href="${altHref}" />`;
      });
    }
    
    urlXml += `
  </url>`;
    
    return urlXml;
  }).join('\n');
  
  return `${xmlHeader}
${urlsetOpening}
${urls}
</urlset>`;
};

export const getStaticPages = (): SitemapEntry[] => {
  const today = new Date().toISOString().split('T')[0];
  
  const staticRoutes = [
    { path: '/', priority: 1.0, changefreq: 'daily' as const },
    { path: '/about', priority: 0.8, changefreq: 'monthly' as const },
    { path: '/faq', priority: 0.7, changefreq: 'monthly' as const },
    { path: '/auth', priority: 0.5, changefreq: 'yearly' as const }
  ];

  return staticRoutes.map(route => ({
    url: route.path,
    lastmod: today,
    changefreq: route.changefreq,
    priority: route.priority,
    alternates: [
      { lang: 'zh-CN', href: route.path },
      { lang: 'en', href: route.path },
      { lang: 'x-default', href: route.path }
    ]
  }));
};

export const generateRobotsTxt = (baseUrl = 'https://369.heymanifestation.com'): string => {
  return `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot  
Allow: /
Crawl-delay: 1

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: WhatsApp
Allow: /

# 禁止访问敏感区域
Disallow: /admin/
Disallow: /api/
Disallow: /.env*
Disallow: /config/
Disallow: /node_modules/
Disallow: /src/
Disallow: /supabase/

# 允许静态资源
Allow: /assets/
Allow: /images/
Allow: /fonts/
Allow: /*.css
Allow: /*.js
Allow: /*.jpg
Allow: /*.jpeg
Allow: /*.png
Allow: /*.webp
Allow: /*.svg
Allow: /*.ico

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-zh.xml
Sitemap: ${baseUrl}/sitemap-en.xml

# 爬虫延迟设置
Crawl-delay: 1`;
};