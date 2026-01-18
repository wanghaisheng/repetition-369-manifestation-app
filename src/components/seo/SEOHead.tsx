import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { 
  SEO_CONFIG, 
  generateCanonicalUrl, 
  generateHreflangLinks 
} from '@/config/seo';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export const SEOHead = ({
  title = SEO_CONFIG.DEFAULT_TITLE.zh,
  description = SEO_CONFIG.DEFAULT_DESCRIPTION.zh,
  keywords = '显化,369方法,吸引力法则,愿望实现,冥想,正念,个人成长,心理学',
  image = SEO_CONFIG.DEFAULT_OG_IMAGE,
  url,
  type = 'website',
  author = SEO_CONFIG.ORGANIZATION.name.zh,
  publishedTime,
  modifiedTime
}: SEOHeadProps) => {
  let location;
  try {
    location = useLocation();
  } catch (error) {
    location = { pathname: '/' };
  }

  const canonicalUrl = url || generateCanonicalUrl(location.pathname);
  const hreflangLinks = generateHreflangLinks(location.pathname);
  const fullTitle = title.includes(SEO_CONFIG.BRAND_NAME.zh) ? title : `${title} | ${SEO_CONFIG.BRAND_NAME.zh}`;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
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
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={SEO_CONFIG.BRAND_NAME.zh} />
      <meta property="og:locale" content="zh_CN" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />
      
      {/* Article specific tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      
      {/* Additional SEO Tags */}
      <meta name="theme-color" content="#007AFF" />
      <meta name="msapplication-TileColor" content="#007AFF" />
      <meta name="application-name" content={SEO_CONFIG.BRAND_NAME.zh} />
      <meta name="apple-mobile-web-app-title" content={SEO_CONFIG.BRAND_NAME.zh} />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
    </Helmet>
  );
};
