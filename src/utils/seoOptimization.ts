
// SEO优化工具函数

export const normalizeUrl = (path: string): string => {
  // 移除尾随斜杠（除了根路径）
  if (path !== '/' && path.endsWith('/')) {
    return path.slice(0, -1);
  }
  
  // 移除重复斜杠
  return path.replace(/\/+/g, '/');
};

export const generateCanonicalUrl = (path: string): string => {
  const baseUrl = 'https://xianghua369.com';
  const normalizedPath = normalizeUrl(path === 'home' ? '/' : `/${path}`);
  return `${baseUrl}${normalizedPath}`;
};

export const generatePageKeywords = (page: string): string => {
  const keywordMap: Record<string, string> = {
    home: '显化369,愿望实现,吸引力法则,369方法,冥想练习,正念',
    wishes: '愿望管理,目标设定,显化练习,愿望实现,个人成长',
    practice: '369练习,书写练习,肯定句,冥想,正念练习,显化技巧',
    progress: '进度跟踪,数据分析,成就统计,目标达成,个人发展',
    community: '社区分享,经验交流,成功故事,互动支持,励志分享',
    settings: '应用设置,个性化,用户偏好,通知设置,隐私设置'
  };
  
  return keywordMap[page] || '显化369,愿望实现,个人成长';
};

export const enforceHttps = (): void => {
  if (typeof window !== 'undefined' && location.protocol !== 'https:') {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);
  }
};

export const generateStructuredData = (page: string, title: string, description: string) => {
  const baseUrl = 'https://xianghua369.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: generateCanonicalUrl(page),
    isPartOf: {
      '@type': 'WebSite',
      name: '显化369',
      url: baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${baseUrl}/search?q={search_term_string}`,
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
          item: baseUrl
        },
        ...(page !== 'home' ? [{
          '@type': 'ListItem',
          position: 2,
          name: title,
          item: generateCanonicalUrl(page)
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
  });
};
