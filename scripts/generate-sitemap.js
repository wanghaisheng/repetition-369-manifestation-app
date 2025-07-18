
const fs = require('fs');
const path = require('path');

const generateSitemap = () => {
  const baseUrl = 'https://369.heymanifestation.com';
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

  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml);
  console.log('✅ Sitemap generated successfully at public/sitemap.xml');
};

// 如果直接运行此脚本则生成 sitemap
if (require.main === module) {
  generateSitemap();
}

module.exports = { generateSitemap };
