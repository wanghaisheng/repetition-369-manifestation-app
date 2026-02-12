import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

interface AdvancedStructuredDataProps {
  type?: 'WebPage' | 'Article' | 'FAQPage' | 'HowTo' | 'Product' | 'Organization';
  title?: string;
  description?: string;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  image?: string;
  faqItems?: Array<{ question: string; answer: string; }>;
  howToSteps?: Array<{ name: string; text: string; }>;
}

export const AdvancedStructuredData: React.FC<AdvancedStructuredDataProps> = ({
  type = 'WebPage',
  title,
  description,
  author,
  publishedDate,
  modifiedDate,
  image,
  faqItems,
  howToSteps,
}) => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const baseUrl = 'https://369.heymanifestation.com';
  const currentUrl = `${baseUrl}${location.pathname}`;
  
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
    name: title,
    description: description,
    url: currentUrl,
    inLanguage: i18n.language,
    isPartOf: {
      '@type': 'WebSite',
      name: '显化369',
      alternateName: 'Manifestation 369',
      url: baseUrl,
      description: '基于369方法的愿望显化应用，帮助用户实现目标和梦想',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${baseUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    },
    publisher: {
      '@type': 'Organization',
      name: '显化369',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/369-app-icon.png`,
        width: 512,
        height: 512
      }
    }
  };

  // 添加作者信息
  if (author) {
    Object.assign(baseData, {
      author: {
        '@type': 'Person',
        name: author,
        url: `${baseUrl}/about`
      }
    });
  }

  // 添加日期信息
  if (publishedDate) {
    Object.assign(baseData, {
      datePublished: publishedDate,
      dateModified: modifiedDate || publishedDate
    });
  }

  // 添加图片信息
  if (image) {
    Object.assign(baseData, {
      image: {
        '@type': 'ImageObject',
        url: image.startsWith('http') ? image : `${baseUrl}${image}`,
        width: 1200,
        height: 630
      }
    });
  }

  // FAQ页面结构化数据
  if (type === 'FAQPage' && faqItems) {
    Object.assign(baseData, {
      mainEntity: faqItems.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer
        }
      }))
    });
  }

  // HowTo页面结构化数据
  if (type === 'HowTo' && howToSteps) {
    Object.assign(baseData, {
      step: howToSteps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name,
        text: step.text
      })),
      totalTime: 'PT15M', // 15分钟
      estimatedCost: {
        '@type': 'MonetaryAmount',
        currency: 'CNY',
        value: '0'
      }
    });
  }

  // 文章类型结构化数据
  if (type === 'Article') {
    Object.assign(baseData, {
      '@type': 'Article',
      headline: title,
      articleSection: '显化方法',
      wordCount: description ? description.length : 500,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': currentUrl
      }
    });
  }

  // 面包屑导航结构化数据
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '首页',
        item: baseUrl
      }
    ]
  };

  // 动态生成面包屑
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const routeNames: Record<string, string> = {
    'about': '关于我们',
    'method369': '369方法',
    'faq': '常见问题',
    'wishes': '愿望管理',
    'practice': '练习中心',
    'progress': '进度跟踪',
    'community': '社区分享',
    'auth': '登录注册'
  };

  pathSegments.forEach((segment, index) => {
    breadcrumbData.itemListElement.push({
      '@type': 'ListItem',
      position: index + 2,
      name: routeNames[segment] || segment,
      item: `${baseUrl}/${pathSegments.slice(0, index + 1).join('/')}`
    });
  });

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(baseData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbData)}
      </script>
    </Helmet>
  );
};