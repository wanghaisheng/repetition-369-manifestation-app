// SEO优化工具函数 - 使用统一配置
import { 
  SEO_CONFIG, 
  generateCanonicalUrl as configGenerateCanonicalUrl, 
  generatePageKeywords as configGeneratePageKeywords 
} from '@/config/seo';

export const normalizeUrl = (path: string): string => {
  // 移除尾随斜杠（除了根路径）
  if (path !== '/' && path.endsWith('/')) {
    return path.slice(0, -1);
  }
  
  // 移除重复斜杠
  return path.replace(/\/+/g, '/');
};

// Re-export from config for backwards compatibility
export const generateCanonicalUrl = configGenerateCanonicalUrl;
export const generatePageKeywords = configGeneratePageKeywords;

export const enforceHttps = (): void => {
  if (typeof window !== 'undefined' && location.protocol !== 'https:' && !location.hostname.includes('localhost')) {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);
  }
};

export const generateStructuredData = (page: string, title: string, description: string) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: generateCanonicalUrl(`/${page}`),
    isPartOf: {
      '@type': 'WebSite',
      name: SEO_CONFIG.BRAND_NAME.zh,
      url: SEO_CONFIG.DOMAIN,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SEO_CONFIG.DOMAIN}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: '首页',
          item: SEO_CONFIG.DOMAIN
        },
        ...(page !== 'home' && page !== '' ? [{
          '@type': 'ListItem',
          position: 2,
          name: title,
          item: generateCanonicalUrl(`/${page}`)
        }] : [])
      ]
    }
  };
};

export const optimizeImages = (imageUrl: string, width?: number, height?: number): string => {
  // 图像优化逻辑
  if (!imageUrl) return '';
  
  // 如果是外部URL，直接返回
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // 本地图像优化
  const params = new URLSearchParams();
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  params.append('q', '85'); // 质量设置为85%
  
  return `${imageUrl}${params.toString() ? '?' + params.toString() : ''}`;
};

export const preloadCriticalResources = (): void => {
  if (typeof window === 'undefined') return;
  
  // 预加载关键资源
  const criticalResources = [
    '/fonts/inter.woff2',
    '/images/logo.webp',
    '/images/hero-bg.webp'
  ];
  
  criticalResources.forEach(resource => {
    try {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      
      if (resource.includes('font')) {
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
      } else if (resource.includes('image')) {
        link.as = 'image';
      }
      
      document.head.appendChild(link);
    } catch (error) {
      console.warn('Failed to preload resource:', resource, error);
    }
  });
};
