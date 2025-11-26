import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  SEO_CONFIG, 
  generateCanonicalUrl, 
  generatePageKeywords, 
  generateHreflangLinks 
} from '@/config/seo';

interface MultiLanguageSEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article';
  includeStructuredData?: boolean;
}

export const MultiLanguageSEO = ({
  title,
  description,
  keywords,
  image = SEO_CONFIG.DEFAULT_OG_IMAGE,
  type = 'website',
  includeStructuredData = true
}: MultiLanguageSEOProps) => {
  const { i18n } = useTranslation();
  const location = useLocation();
  
  // 动态设置HTML lang属性
  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  // 获取当前语言
  const currentLang = i18n.language as 'zh' | 'en';
  
  // 生成页面标题
  const pageTitle = title || SEO_CONFIG.DEFAULT_TITLE[currentLang];
  
  // 生成页面描述
  const pageDescription = description || SEO_CONFIG.DEFAULT_DESCRIPTION[currentLang];
  
  // 生成页面关键词
  const pathSegments = location.pathname.split('/').filter(Boolean);
  // 移除语言前缀后获取页面名称
  const page = pathSegments.filter(seg => !['en', 'zh'].includes(seg)).pop() || 'home';
  const pageKeywords = keywords || generatePageKeywords(page, currentLang);
  
  // 生成规范化URL（当前路径已包含语言前缀）
  const canonicalUrl = generateCanonicalUrl(location.pathname);
  
  // 生成Hreflang链接
  const hreflangLinks = generateHreflangLinks(location.pathname);
  
  // 生成结构化数据
  const structuredData = includeStructuredData ? {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: currentLang === 'zh' ? '显化369' : 'Manifestation 369',
    description: pageDescription,
    url: SEO_CONFIG.DOMAIN,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Any',
    inLanguage: currentLang === 'zh' ? 'zh-CN' : 'en-US',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: currentLang === 'zh' ? 'CNY' : 'USD'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1000'
    },
    author: {
      '@type': 'Organization',
      name: SEO_CONFIG.ORGANIZATION.name[currentLang],
      url: SEO_CONFIG.DOMAIN,
      description: SEO_CONFIG.ORGANIZATION.description[currentLang]
    }
  } : null;

  const criticalStyles = `
    .ios-blur {
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }
    
    .safe-bottom {
      padding-bottom: env(safe-area-inset-bottom);
    }
    
    .min-h-screen {
      min-height: 100vh;
      min-height: 100dvh;
    }
    
    .skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;

  return (
    <Helmet>
      {/* Critical CSS */}
      <style>{criticalStyles}</style>
      
      {/* HTML lang attribute is set via useEffect */}
      
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      <meta name="author" content={SEO_CONFIG.ORGANIZATION.name[currentLang]} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Hreflang Links */}
      {hreflangLinks.map((link) => (
        <link
          key={link.lang}
          rel="alternate"
          hrefLang={link.lang}
          href={link.href}
        />
      ))}
      
      {/* Open Graph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={pageTitle} />
      <meta property="og:site_name" content={currentLang === 'zh' ? '显化369' : 'Manifestation 369'} />
      <meta property="og:locale" content={currentLang === 'zh' ? 'zh_CN' : 'en_US'} />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={pageTitle} />
      
      {/* Mobile Optimization */}
      <meta name="theme-color" content="#007AFF" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={currentLang === 'zh' ? '显化369' : 'Manifestation 369'} />
      
      {/* Performance Optimization */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://clarity.microsoft.com" />
      <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
      
      {/* Critical Fonts */}
      <link
        rel="preload"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
        as="style"
        onLoad={(e) => {
          const target = e.target as HTMLLinkElement;
          target.onload = null;
          target.rel = 'stylesheet';
        }}
      />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Alternative Formats */}
      <link rel="alternate" type="application/rss+xml" title={`${currentLang === 'zh' ? '显化369' : 'Manifestation 369'} RSS Feed`} href="/rss.xml" />
    </Helmet>
  );
};