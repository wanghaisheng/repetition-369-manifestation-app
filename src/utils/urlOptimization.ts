
// URL optimization utilities
export const cleanUrl = (url: string): string => {
  // Remove trailing slashes except for root
  if (url.length > 1 && url.endsWith('/')) {
    return url.slice(0, -1);
  }
  return url;
};

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single
    .trim();
};

export const buildUrl = (path: string, params?: Record<string, string>): string => {
  const cleanPath = cleanUrl(path);
  if (!params || Object.keys(params).length === 0) {
    return cleanPath;
  }
  
  const searchParams = new URLSearchParams(params);
  return `${cleanPath}?${searchParams.toString()}`;
};

export const redirectToCanonical = (currentPath: string): string => {
  const canonicalPath = cleanUrl(currentPath);
  
  // Handle common redirect patterns
  const redirectMap: Record<string, string> = {
    '/home': '/',
    '/index': '/',
    '/login': '/auth',
    '/register': '/auth',
    '/signin': '/auth',
    '/signup': '/auth'
  };
  
  return redirectMap[canonicalPath] || canonicalPath;
};
