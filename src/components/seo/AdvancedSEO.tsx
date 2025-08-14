import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { SEO_CONFIG } from '@/config/seo';

interface AdvancedSEOProps {
  breadcrumbs?: Array<{ name: string; href: string }>;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  faq?: Array<{ question: string; answer: string }>;
}

export const AdvancedSEO: React.FC<AdvancedSEOProps> = ({
  breadcrumbs,
  article,
  faq
}) => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const currentLang = i18n.language as 'zh' | 'en';

  // 生成面包屑结构化数据
  const generateBreadcrumbsStructuredData = () => {
    if (!breadcrumbs || breadcrumbs.length === 0) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: `${SEO_CONFIG.DOMAIN}${crumb.href}`
      }))
    };
  };

  // 生成文章结构化数据
  const generateArticleStructuredData = () => {
    if (!article) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: document.title,
      description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
      author: {
        '@type': 'Person',
        name: article.author || SEO_CONFIG.ORGANIZATION.name[currentLang]
      },
      publisher: {
        '@type': 'Organization',
        name: SEO_CONFIG.ORGANIZATION.name[currentLang],
        logo: {
          '@type': 'ImageObject',
          url: `${SEO_CONFIG.DOMAIN}/369-app-icon.png`
        }
      },
      datePublished: article.publishedTime,
      dateModified: article.modifiedTime || article.publishedTime,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${SEO_CONFIG.DOMAIN}${location.pathname}`
      },
      articleSection: article.section,
      keywords: article.tags?.join(', ')
    };
  };

  // 生成FAQ结构化数据
  const generateFAQStructuredData = () => {
    if (!faq || faq.length === 0) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer
        }
      }))
    };
  };

  const breadcrumbsData = generateBreadcrumbsStructuredData();
  const articleData = generateArticleStructuredData();
  const faqData = generateFAQStructuredData();

  return (
    <Helmet>
      {/* 高级meta标签 */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* PWA相关 */}
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#007AFF" />
      <meta name="apple-mobile-web-app-title" content={SEO_CONFIG.DEFAULT_TITLE[currentLang]} />
      
      {/* 社交媒体优化 */}
      <meta property="fb:app_id" content="your-facebook-app-id" />
      <meta name="twitter:site" content="@your-twitter-handle" />
      <meta name="twitter:creator" content="@your-twitter-handle" />
      
      {/* 地理位置标签（如果适用） */}
      <meta name="geo.region" content="CN" />
      <meta name="geo.placename" content="China" />
      
      {/* 内容分级 */}
      <meta name="rating" content="general" />
      <meta name="audience" content="all" />
      
      {/* 版权信息 */}
      <meta name="copyright" content={`© ${new Date().getFullYear()} ${SEO_CONFIG.ORGANIZATION.name[currentLang]}`} />
      <meta name="rights" content="All rights reserved" />
      
      {/* 面包屑结构化数据 */}
      {breadcrumbsData && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbsData)}
        </script>
      )}
      
      {/* 文章结构化数据 */}
      {articleData && (
        <script type="application/ld+json">
          {JSON.stringify(articleData)}
        </script>
      )}
      
      {/* FAQ结构化数据 */}
      {faqData && (
        <script type="application/ld+json">
          {JSON.stringify(faqData)}
        </script>
      )}
    </Helmet>
  );
};