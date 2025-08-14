import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ANALYTICS_CONFIG } from '@/config/analytics';

export const SearchConsoleVerification = () => {
  return (
    <Helmet>
      {/* Google Search Console验证 */}
      {ANALYTICS_CONFIG.GSC_VERIFICATION && (
        <meta name="google-site-verification" content={ANALYTICS_CONFIG.GSC_VERIFICATION} />
      )}
      
      {/* Bing网站管理员工具验证 */}
      {ANALYTICS_CONFIG.BING_VERIFICATION && (
        <meta name="msvalidate.01" content={ANALYTICS_CONFIG.BING_VERIFICATION} />
      )}
      
      {/* Google AdSense验证 */}
      {ANALYTICS_CONFIG.ADSENSE_CLIENT_ID && !ANALYTICS_CONFIG.ADSENSE_CLIENT_ID.includes('PLACEHOLDER') && (
        <meta name="google-adsense-account" content={ANALYTICS_CONFIG.ADSENSE_CLIENT_ID} />
      )}
      
      {/* 其他搜索引擎验证标签 */}
      <meta name="yandex-verification" content="your-yandex-verification-code" />
      <meta name="baidu-site-verification" content="your-baidu-verification-code" />
      
      {/* DNS预取优化 */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
      <link rel="dns-prefetch" href="//www.clarity.ms" />
      <link rel="dns-prefetch" href="//c.bing.com" />
      
      {/* 预连接关键资源 */}
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
    </Helmet>
  );
};