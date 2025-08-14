// SEO统一配置文件
export const SEO_CONFIG = {
  // 统一域名配置
  DOMAIN: 'https://369.heymanifestation.com',
  
  // 默认语言设置
  DEFAULT_LANGUAGE: 'zh',
  SUPPORTED_LANGUAGES: ['zh', 'en'],
  
  // 默认SEO信息
  DEFAULT_TITLE: {
    zh: '显化369 - 愿望成真的神奇力量',
    en: 'Manifestation 369 - The Magical Power of Making Wishes Come True'
  },
  
  DEFAULT_DESCRIPTION: {
    zh: '基于特斯拉369显化法则的智能练习应用，帮助您系统化实现愿望目标。支持愿望管理、369练习、进度跟踪和社区分享。',
    en: 'An intelligent practice app based on Tesla\'s 369 manifestation method, helping you systematically achieve your wish goals. Supports wish management, 369 practice, progress tracking and community sharing.'
  },
  
  // 页面关键词映射
  PAGE_KEYWORDS: {
    zh: {
      home: '显化369,愿望实现,吸引力法则,369方法,冥想练习,正念',
      wishes: '愿望管理,目标设定,显化练习,愿望实现,个人成长',
      practice: '369练习,书写练习,肯定句,冥想,正念练习,显化技巧',
      progress: '进度跟踪,数据分析,成就统计,目标达成,个人发展',
      community: '社区分享,经验交流,成功故事,互动支持,励志分享',
      auth: '用户登录,注册,账户管理,个人设置'
    },
    en: {
      home: 'manifestation 369,wish fulfillment,law of attraction,369 method,meditation practice,mindfulness',
      wishes: 'wish management,goal setting,manifestation practice,wish fulfillment,personal growth',
      practice: '369 practice,writing practice,affirmations,meditation,mindfulness practice,manifestation techniques',
      progress: 'progress tracking,data analysis,achievement statistics,goal achievement,personal development',
      community: 'community sharing,experience exchange,success stories,interactive support,inspirational sharing',
      auth: 'user login,registration,account management,personal settings'
    }
  },
  
  // Open Graph默认图片
  DEFAULT_OG_IMAGE: 'https://369.heymanifestation.com/369-app-icon.png',
  
  // 组织信息
  ORGANIZATION: {
    name: {
      zh: '显化369团队',
      en: 'Manifestation 369 Team'
    },
    description: {
      zh: '专注于个人成长和愿望实现的专业团队',
      en: 'Professional team focused on personal growth and wish fulfillment'
    }
  }
};

// 生成规范化URL
export const generateCanonicalUrl = (path: string, language?: string): string => {
  // 移除尾随斜杠（除了根路径）
  let normalizedPath = path;
  if (path !== '/' && path.endsWith('/')) {
    normalizedPath = path.slice(0, -1);
  }
  
  // 移除重复斜杠
  normalizedPath = normalizedPath.replace(/\/+/g, '/');
  
  // 如果是英文版本，添加语言前缀
  if (language === 'en' && normalizedPath !== '/') {
    normalizedPath = `/en${normalizedPath}`;
  } else if (language === 'en' && normalizedPath === '/') {
    normalizedPath = '/en';
  }
  
  return `${SEO_CONFIG.DOMAIN}${normalizedPath}`;
};

// 生成页面关键词
export const generatePageKeywords = (page: string, language: string = 'zh'): string => {
  const keywords = SEO_CONFIG.PAGE_KEYWORDS[language as keyof typeof SEO_CONFIG.PAGE_KEYWORDS];
  return keywords?.[page as keyof typeof keywords] || keywords?.home || '';
};

// 生成多语言Hreflang链接
export const generateHreflangLinks = (pathname: string) => {
  const links = [];
  
  // 中文版本（默认）
  links.push({
    lang: 'zh',
    href: generateCanonicalUrl(pathname, 'zh')
  });
  
  // 英文版本
  links.push({
    lang: 'en', 
    href: generateCanonicalUrl(pathname, 'en')
  });
  
  // x-default指向中文版本
  links.push({
    lang: 'x-default',
    href: generateCanonicalUrl(pathname, 'zh')
  });
  
  return links;
};