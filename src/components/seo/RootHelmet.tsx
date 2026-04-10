import { Helmet } from 'react-helmet-async';
import { useLocation, useMatches } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { DEFAULT_LANGUAGE } from '@/config/routes';
import { 
  SEO_CONFIG, 
  generateCanonicalUrl, 
  generatePageKeywords,
  generateHreflangLinks 
} from '@/config/seo';

interface RouteSEOData {
  title?: string;
  titleKey?: string;
  description?: string;
  descriptionKey?: string;
  keywords?: string;
  keywordsKey?: string;
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
}

/**
 * RootHelmet — unified <head> manager.
 * Reads `staticData.seo` from the deepest matched route
 * and outputs all meta / OG / hreflang / canonical tags in one place.
 * Pages no longer need their own Helmet / SEO components.
 */
export const RootHelmet = () => {
  const matches = useMatches();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  
  const currentLang = (i18n.language || DEFAULT_LANGUAGE) as 'zh' | 'en';

  // Merge seo from all matched routes (deepest wins)
  let seo: RouteSEOData = {};
  for (const match of matches) {
    const routeSeo = (match.staticData as any)?.seo;
    if (routeSeo) {
      seo = { ...seo, ...routeSeo };
    }
  }

  // Resolve i18n keys → strings
  const title = seo.title 
    || (seo.titleKey ? t(seo.titleKey) : null)
    || SEO_CONFIG.DEFAULT_TITLE[currentLang];

  const description = seo.description
    || (seo.descriptionKey ? t(seo.descriptionKey) : null)
    || SEO_CONFIG.DEFAULT_DESCRIPTION[currentLang];

  const keywords = seo.keywords
    || (seo.keywordsKey ? t(seo.keywordsKey) : null)
    || generatePageKeywords(
        location.pathname.split('/').filter(s => !['en', 'zh', ''].includes(s)).pop() || 'home',
        currentLang
      );

  const image = seo.image || SEO_CONFIG.DEFAULT_OG_IMAGE;
  const type = seo.type || 'website';
  const canonicalUrl = generateCanonicalUrl(location.pathname);
  const hreflangLinks = generateHreflangLinks(location.pathname);
  const siteName = SEO_CONFIG.BRAND_NAME[currentLang];
  const ogLocale = currentLang === 'zh' ? 'zh_CN' : 'en_US';

  // Set document lang
  if (typeof document !== 'undefined') {
    document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
  }

  return (
    <Helmet>
      {/* Basic */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={SEO_CONFIG.ORGANIZATION.name[currentLang]} />
      
      {/* Robots */}
      {seo.noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}
      <meta name="googlebot" content={seo.noindex ? 'noindex, nofollow' : 'index, follow'} />
      
      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Hreflang */}
      {hreflangLinks.map((link) => (
        <link key={link.lang} rel="alternate" hrefLang={link.lang} href={link.href} />
      ))}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={ogLocale} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />
      
      {/* Mobile */}
      <meta name="theme-color" content="#007AFF" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      
      {/* Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="dns-prefetch" href="//clarity.microsoft.com" />
      
      {/* RSS */}
      <link rel="alternate" type="application/rss+xml" title={`${siteName} RSS Feed`} href="/rss.xml" />
    </Helmet>
  );
};
