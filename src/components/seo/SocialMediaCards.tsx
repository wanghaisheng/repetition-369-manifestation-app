import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

interface SocialMediaCardsProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  siteName?: string;
}

export const SocialMediaCards: React.FC<SocialMediaCardsProps> = ({
  title,
  description,
  image,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  siteName = '显化369 - 愿望成真的神奇力量'
}) => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const baseUrl = 'https://369.heymanifestation.com';
  const currentUrl = `${baseUrl}${location.pathname}`;
  
  // 默认图片
  const defaultImage = `${baseUrl}/369-app-icon.png`;
  const cardImage = image ? 
    (image.startsWith('http') ? image : `${baseUrl}${image}`) : 
    defaultImage;

  // 默认描述
  const defaultDescription = i18n.language === 'zh' 
    ? '使用科学验证的369方法实现愿望显化，已帮助5,247+用户成功达成目标。开始你的显化之旅！'
    : 'Manifest your desires using the scientifically-backed 369 method. Join 5,247+ users who have successfully achieved their goals!';

  return (
    <Helmet>
      {/* Open Graph (Facebook, LinkedIn, WhatsApp) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title || siteName} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={cardImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title || siteName} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={i18n.language === 'zh' ? 'zh_CN' : 'en_US'} />
      
      {/* 文章类型的额外信息 */}
      {type === 'article' && author && (
        <>
          <meta property="article:author" content={author} />
          <meta property="article:section" content="显化方法" />
        </>
      )}
      
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      
      {modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || siteName} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={cardImage} />
      <meta name="twitter:image:alt" content={title || siteName} />
      <meta name="twitter:site" content="@369manifestation" />
      <meta name="twitter:creator" content="@369manifestation" />

      {/* 微信分享优化 */}
      <meta name="twitter:app:name:iphone" content="显化369" />
      <meta name="twitter:app:name:ipad" content="显化369" />
      <meta name="twitter:app:name:googleplay" content="显化369" />

      {/* Pinterest */}
      <meta name="pinterest:description" content={description || defaultDescription} />
      <meta name="pinterest:image" content={cardImage} />

      {/* LinkedIn特殊优化 */}
      <meta property="linkedin:owner" content="显化369团队" />

      {/* 微博分享优化 */}
      <meta name="weibo:title" content={title || siteName} />
      <meta name="weibo:description" content={description || defaultDescription} />
      <meta name="weibo:image" content={cardImage} />

      {/* WhatsApp优化 */}
      <meta property="og:image:type" content="image/png" />
      
      {/* Telegram优化 */}
      <meta name="telegram:channel" content="@369manifestation" />
    </Helmet>
  );
};