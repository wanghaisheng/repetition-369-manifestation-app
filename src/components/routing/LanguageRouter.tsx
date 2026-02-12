import React, { useEffect } from 'react';
import { useLocation } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { getLanguageFromPath } from '@/utils/languageUrl';

interface LanguageRouterProps {
  children: React.ReactNode;
}

/**
 * 语言路由处理器
 * 根据URL路径自动同步i18n语言状态
 */
export const LanguageRouter: React.FC<LanguageRouterProps> = ({ children }) => {
  const location = useLocation();
  const { i18n } = useTranslation();
  
  useEffect(() => {
    // 从URL检测语言
    const pathLang = getLanguageFromPath(location.pathname);
    
    // 同步i18n语言状态
    if (i18n.language !== pathLang) {
      i18n.changeLanguage(pathLang);
    }
  }, [location.pathname, i18n]);
  
  return <>{children}</>;
};
