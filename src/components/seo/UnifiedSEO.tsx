import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { 
  SEO_CONFIG, 
  generateCanonicalUrl, 
  generatePageKeywords,
  generateHreflangLinks 
} from '@/config/seo';

interface UnifiedSEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article';
  includeStructuredData?: boolean;
}

export const UnifiedSEO = ({
  title = SEO_CONFIG.DEFAULT_TITLE.zh,
  description = SEO_CONFIG.DEFAULT_DESCRIPTION.zh,
  keywords,
  image = SEO_CONFIG.DEFAULT_OG_IMAGE,
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
  const hreflangLinks = generateHreflangLinks(location.pathname);

  const structuredData = includeStructuredData ? {
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
      
      {/* Open Graph */}
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
      
      {/* Mobile Optimization */}
      <meta name="theme-color" content="#007AFF" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={SEO_CONFIG.BRAND_NAME.zh} />
      
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
      <link rel="alternate" type="application/rss+xml" title={`${SEO_CONFIG.BRAND_NAME.zh} RSS Feed`} href="/rss.xml" />
    </Helmet>
  );
};
