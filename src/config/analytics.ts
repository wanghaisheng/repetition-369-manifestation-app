// 分析和追踪配置
export const ANALYTICS_CONFIG = {
  // Google Analytics 4
  GA4_MEASUREMENT_ID: process.env.NODE_ENV === 'production' ? 'G-2YQPNKD8CM' : 'G-PLACEHOLDER',
  
  // Google AdSense (需要申请)
  ADSENSE_CLIENT_ID: process.env.NODE_ENV === 'production' ? 'ca-pub-7095251669575818' : 'ca-pub-PLACEHOLDER',
  
  // Microsoft Clarity
  CLARITY_PROJECT_ID: process.env.NODE_ENV === 'production' ? 'ot8undrpd8' : 'PLACEHOLDER',
  
  // Google Search Console验证
  GSC_VERIFICATION: 'your-google-search-console-verification-code',
  
  // Bing网站管理员工具验证
  BING_VERIFICATION: 'your-bing-webmaster-verification-code',
  
  // 启用开发环境调试
  DEBUG_MODE: process.env.NODE_ENV === 'development',
};

// 检查是否为有效的分析ID
export const isValidAnalyticsId = (id: string): boolean => {
  return !(!id || id.includes('PLACEHOLDER') || id.includes('XXXXXXXXXX'));
};

// 追踪自定义事件
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...parameters,
      timestamp: Date.now(),
    });
  }
};

// 追踪页面浏览
export const trackPageView = (path: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', ANALYTICS_CONFIG.GA4_MEASUREMENT_ID, {
      page_path: path,
      page_title: title || document.title,
      page_location: window.location.href,
    });
  }
};

// 追踪用户行为
export const trackUserAction = (action: string, category: string, label?: string, value?: number) => {
  trackEvent('user_action', {
    event_category: category,
    event_label: label,
    value: value,
    custom_action: action,
  });
};

// 追踪性能指标
export const trackWebVitals = (metric: any) => {
  trackEvent('web_vitals', {
    metric_name: metric.name,
    metric_value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    metric_id: metric.id,
    metric_rating: metric.rating,
  });
};