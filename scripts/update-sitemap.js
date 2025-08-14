const fs = require('fs');
const path = require('path');

const updateSitemapAndRobots = () => {
  const baseUrl = 'https://369.heymanifestation.com';
  
  // 生成sitemap.xml
  const staticPages = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/en', priority: 1.0, changefreq: 'daily' },
    { url: '/auth', priority: 0.5, changefreq: 'monthly' },
    { url: '/app', priority: 0.8, changefreq: 'weekly' }
  ];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${staticPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    ${page.url === '/' ? `    <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/" />
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/" />` : ''}
    ${page.url === '/en' ? `    <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/" />
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/" />` : ''}
  </url>`).join('\n')}
</urlset>`;

  // 生成robots.txt
  const robotsTxt = `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /.env
Disallow: /config/

# Allow all other content
Allow: /`;

  // 确保public目录存在
  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  // 写入文件
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml);
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
  
  console.log('✅ Sitemap and robots.txt generated successfully');
};

// 如果直接运行此脚本则生成文件
if (require.main === module) {
  updateSitemapAndRobots();
}

module.exports = { updateSitemapAndRobots };