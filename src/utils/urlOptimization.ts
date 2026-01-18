// URL optimization utilities - 使用统一配置
import { 
  SEO_CONFIG, 
  generateCanonicalUrl as configGenerateCanonicalUrl 
} from '@/config/seo';

export const redirectToCanonical = (path: string): string => {
  // Remove trailing slashes except for root
  if (path !== '/' && path.endsWith('/')) {
    return path.slice(0, -1);
  }
  
  // Remove duplicate slashes
  const cleanPath = path.replace(/\/+/g, '/');
  
  // Handle common redirect patterns
  const redirectMap: Record<string, string> = {
    '/home': '/',
    '/index': '/',
    '/main': '/',
  };
  
  return redirectMap[cleanPath] || cleanPath;
};

// Re-export from config for backwards compatibility
export const generateCanonicalUrl = configGenerateCanonicalUrl;

export const enforceHttps = (): void => {
  if (typeof window !== 'undefined' && 
      location.protocol !== 'https:' && 
      !location.hostname.includes('localhost') &&
      !location.hostname.includes('127.0.0.1')) {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);
  }
};
