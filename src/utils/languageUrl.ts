// URL语言管理工具函数

import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, type SupportedLanguage } from '@/config/routes';

/**
 * 从URL路径中提取语言代码
 * @param path - 当前路径
 * @returns 语言代码 (zh/en)
 */
export function getLanguageFromPath(path: string): SupportedLanguage {
  const segments = path.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  // 检查第一个段是否为支持的语言（且不是默认语言）
  if (SUPPORTED_LANGUAGES.includes(firstSegment as SupportedLanguage)) {
    return firstSegment as SupportedLanguage;
  }
  
  return DEFAULT_LANGUAGE;
}

/**
 * 移除URL路径中的语言前缀
 * @param path - 当前路径
 * @returns 移除语言前缀后的路径
 */
export function removeLanguagePrefix(path: string): string {
  const segments = path.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  // 如果第一个段是支持的语言，移除它
  if (SUPPORTED_LANGUAGES.includes(firstSegment as SupportedLanguage)) {
    const remainingPath = segments.slice(1).join('/');
    return remainingPath ? `/${remainingPath}` : '';
  }
  
  return path;
}

/**
 * 获取指定语言的本地化路径
 * @param currentPath - 当前路径
 * @param targetLang - 目标语言
 * @returns 本地化后的路径
 */
export function getLocalizedPath(currentPath: string, targetLang: SupportedLanguage): string {
  // 移除现有语言前缀，获取纯路径
  const pathWithoutLang = removeLanguagePrefix(currentPath);
  
  // 如果是默认语言(zh)，不添加前缀
  if (targetLang === DEFAULT_LANGUAGE) {
    return pathWithoutLang || '/';
  }
  
  // 其他语言添加前缀
  return `/${targetLang}${pathWithoutLang || ''}`;
}

/**
 * 添加语言前缀到路径（如果需要）
 * @param path - 基础路径
 * @param lang - 语言代码
 * @returns 带语言前缀的路径
 */
export function addLanguagePrefix(path: string, lang: SupportedLanguage): string {
  // 默认语言不添加前缀
  if (lang === DEFAULT_LANGUAGE) {
    return path || '/';
  }
  
  // 确保路径以/开头
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // 根路径特殊处理
  if (normalizedPath === '/') {
    return `/${lang}`;
  }
  
  return `/${lang}${normalizedPath}`;
}

/**
 * 检查路径是否为营销页面（需要多语言支持）
 * @param path - 路径
 * @returns 是否为营销页面
 */
export function isMarketingPage(path: string): boolean {
  const pathWithoutLang = removeLanguagePrefix(path);
  const cleanPath = pathWithoutLang.replace(/^\//, '').split('/')[0];
  
  const marketingPaths = [
    '', // landing
    'about',
    'faq', 
    'method369',
    'blog',
    'user-stories',
    'privacy',
    'terms'
  ];
  
  return marketingPaths.includes(cleanPath);
}

/**
 * 规范化URL路径
 * @param path - 路径
 * @returns 规范化后的路径
 */
export function normalizePath(path: string): string {
  let normalized = path;
  
  // 移除尾随斜杠（除了根路径）
  if (normalized !== '/' && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }
  
  // 移除重复斜杠
  normalized = normalized.replace(/\/+/g, '/');
  
  return normalized;
}
