
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { generateCanonicalUrl, generatePageKeywords } from '@/utils/seoOptimization';

interface UnifiedSEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article';
  includeStructuredData?: boolean;
}

export const UnifiedSEO = ({
  title = '显化369 - 愿望成真的神奇力量',
  description = '基于特斯拉369显化法则的智能练习应用，帮助您系统化实现愿望目标。支持愿望管理、369练习、进度跟踪和社区分享。',
  keywords,
  image = 'https://lovable.dev/opengraph-image-p98pqg.png',
  type = 'website',
  includeStructuredData = true
}: UnifiedSEOProps) => {
  let location;
  try {
    location = useLocation();
  } catch (error) {
    location = { pathname: '/' };
  }

  const canonicalUrl = generateCanonicalUrl(location.pathname);
  const pageKeywords = keywords || generatePageKeywords(location.pathname.split('/')[1] || 'home');

  const structuredData = includeStructuredData ? {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '显化369',
    description: description,
    url: 'https://xianghua369.com',
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
      name: '显化369团队',
      url: 'https://xianghua369.com'
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
      
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={pageKeywords} />
      <meta name="author" content="显化369团队" />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="显化369" />
      <meta property="og:locale" content="zh_CN" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />
      
      {/* Mobile Optimization */}
      <meta name="theme-color" content="#007AFF" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="显化369" />
      
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
      <link rel="alternate" type="application/rss+xml" title="显化369 RSS Feed" href="/rss.xml" />
    </Helmet>
  );
};
