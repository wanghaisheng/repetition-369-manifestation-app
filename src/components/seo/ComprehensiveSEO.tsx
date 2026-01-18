import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { 
  SEO_CONFIG, 
  generateCanonicalUrl, 
  generateHreflangLinks 
} from '@/config/seo';

interface ComprehensiveSEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article';
}

export const ComprehensiveSEO = ({
  title = SEO_CONFIG.DEFAULT_TITLE.zh,
  description = SEO_CONFIG.DEFAULT_DESCRIPTION.zh,
  keywords = '显化369,369方法,愿望实现,吸引力法则,冥想练习,正念,个人成长,显化法则,特斯拉369',
  image = SEO_CONFIG.DEFAULT_OG_IMAGE,
  type = 'website'
}: ComprehensiveSEOProps) => {
  let location;
  try {
    location = useLocation();
  } catch (error) {
    // 如果不在路由器上下文中，使用默认路径
    location = { pathname: '/' };
  }
  
  const canonicalUrl = generateCanonicalUrl(location.pathname);
  const hreflangLinks = generateHreflangLinks(location.pathname);
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SEO_CONFIG.BRAND_NAME.zh,
    description: description,
    url: SEO_CONFIG.DOMAIN,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CNY'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1000'
    },
    author: {
      '@type': 'Organization',
      name: SEO_CONFIG.ORGANIZATION.name.zh,
      url: SEO_CONFIG.DOMAIN
    }
  };

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '首页',
        item: SEO_CONFIG.DOMAIN
      }
    ]
  };

  return (
    <Helmet>
      {/* 基础Meta标签 */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={SEO_CONFIG.ORGANIZATION.name.zh} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Canonical URL - 防止重复内容问题 */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Hreflang Links - 多语言版本 */}
      {hreflangLinks.map((link) => (
        <link
          key={link.lang}
          rel="alternate"
          hrefLang={link.lang}
          href={link.href}
        />
      ))}
      
      {/* Open Graph 标签 */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={SEO_CONFIG.BRAND_NAME.zh} />
      <meta property="og:locale" content="zh_CN" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />
      
      {/* 移动端优化 */}
      <meta name="theme-color" content="#007AFF" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={SEO_CONFIG.BRAND_NAME.zh} />
      
      {/* 性能优化 */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://clarity.microsoft.com" />
      <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
      
      {/* 结构化数据 */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbData)}
      </script>
      
      {/* 替代格式 */}
      <link rel="alternate" type="application/rss+xml" title={`${SEO_CONFIG.BRAND_NAME.zh} RSS Feed`} href="/rss.xml" />
    </Helmet>
  );
};
