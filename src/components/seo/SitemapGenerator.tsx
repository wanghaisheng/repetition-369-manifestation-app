
import React, { useEffect } from 'react';
import { generateSitemap, generateRobotsTxt } from '@/utils/seo';

export const SitemapGenerator = () => {
  useEffect(() => {
    // 生成并设置sitemap
    const sitemap = generateSitemap();
    const robotsTxt = generateRobotsTxt();
    
    // 在开发环境中，将sitemap和robots.txt添加到控制台以供参考
    if (process.env.NODE_ENV === 'development') {
      console.log('Generated Sitemap:', sitemap);
      console.log('Generated Robots.txt:', robotsTxt);
    }
    
    // 在生产环境中，可以通过API端点提供这些文件
    // 这里我们将它们存储在sessionStorage中供参考
    sessionStorage.setItem('generated-sitemap', sitemap);
    sessionStorage.setItem('generated-robots', robotsTxt);
  }, []);

  return null; // 这是一个utility组件，不渲染任何内容
};

// 用于获取生成的sitemap的helper函数
export const getSitemap = (): string => {
  return sessionStorage.getItem('generated-sitemap') || generateSitemap();
};

// 用于获取生成的robots.txt的helper函数
export const getRobotsTxt = (): string => {
  return sessionStorage.getItem('generated-robots') || generateRobotsTxt();
};
