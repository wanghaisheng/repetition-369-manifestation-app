
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
  const baseUrl = 'https://xianghua369.com';
  const normalizedPath = redirectToCanonical(path);
  return `${baseUrl}${normalizedPath}`;
};

export const enforceHttps = (): void => {
  if (typeof window !== 'undefined' && 
      location.protocol !== 'https:' && 
      !location.hostname.includes('localhost') &&
      !location.hostname.includes('127.0.0.1')) {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);
  }
};
