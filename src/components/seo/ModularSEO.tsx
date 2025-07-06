
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { generatePageKeywords, generateCanonicalUrl } from '@/utils/seoOptimization';

interface ModularSEOProps {
  page: string;
  title: string;
  description: string;
  image?: string;
  keywords?: string;
}

export const ModularSEO = ({ 
  page, 
  title, 
  description, 
  image = 'https://xianghua369.com/og-image.jpg',
  keywords 
}: ModularSEOProps) => {
  const canonicalUrl = generateCanonicalUrl(page);
  const pageKeywords = keywords || generatePageKeywords(page);
  
  return (
    <Helmet>
      {/* Enhanced Meta Tags */}
      <meta name="keywords" content={pageKeywords} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Enhanced Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="显化369" />
      <meta property="og:locale" content="zh_CN" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO Tags */}
      <meta name="theme-color" content="#007AFF" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Preload critical resources */}
      <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      
      {/* DNS prefetch for external domains */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="dns-prefetch" href="//clarity.microsoft.com" />
    </Helmet>
  );
};
