
// URL optimization utilities

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

export const generateCanonicalUrl = (path: string): string => {
  // 确保使用HTTPS和non-www域名
  const baseUrl = 'https://369.heymanifestation.com';
  let normalizedPath = redirectToCanonical(path);
  
  // 移除查询参数和哈希
  normalizedPath = normalizedPath.split('?')[0].split('#')[0];
  
  // 根路径返回纯域名，其他路径返回完整URL
  return normalizedPath === '/' ? baseUrl : `${baseUrl}${normalizedPath}`;
};

export const enforceHttps = (): void => {
  if (typeof window !== 'undefined' && 
      location.protocol !== 'https:' && 
      !location.hostname.includes('localhost') &&
      !location.hostname.includes('127.0.0.1')) {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);
  }
};
