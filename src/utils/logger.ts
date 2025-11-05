/**
 * Unified logging utility for the application
 * - Development logs are only shown in development mode
 * - Production errors are always logged for monitoring
 */

const isDevelopment = import.meta.env.DEV;

export const logger = {
  /**
   * Development-only logs
   * Will not appear in production builds
   */
  log: (message: string, data?: any) => {
    if (isDevelopment) {
      console.log(`[APP] ${message}`, data !== undefined ? data : '');
    }
  },

  /**
   * Development-only warnings
   */
  warn: (message: string, data?: any) => {
    if (isDevelopment) {
      console.warn(`[APP] ${message}`, data !== undefined ? data : '');
    }
  },

  /**
   * Error logging - always logged for monitoring
   * In production, these could be sent to error tracking services
   */
  error: (message: string, error?: any) => {
    console.error(`[APP ERROR] ${message}`, error || '');
    
    // TODO: Integrate with error tracking service (e.g., Sentry)
    // if (!isDevelopment) {
    //   sendToErrorTracking(message, error);
    // }
  },

  /**
   * Performance metrics - development only
   */
  performance: (label: string, duration: number) => {
    if (isDevelopment) {
      console.log(`[PERF] ${label}: ${duration.toFixed(2)}ms`);
    }
  },

  /**
   * Authentication flow logs - development only
   */
  auth: (message: string, data?: any) => {
    if (isDevelopment) {
      console.log(`[AUTH] ${message}`, data !== undefined ? data : '');
    }
  },
};
