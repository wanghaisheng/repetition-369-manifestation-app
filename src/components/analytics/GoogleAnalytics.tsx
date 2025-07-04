
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface GoogleAnalyticsProps {
  measurementId: string;
}

export const GoogleAnalytics = ({ measurementId }: GoogleAnalyticsProps) => {
  const location = useLocation();

  useEffect(() => {
    // 检查是否为有效的测量ID
    if (!measurementId || measurementId === 'G-XXXXXXXXXX') {
      console.log('Google Analytics: Invalid measurement ID provided');
      return;
    }

    // 检查是否已经加载了 Google Analytics
    if (document.querySelector(`script[src*="${measurementId}"]`)) {
      console.log('Google Analytics: Already loaded');
      return;
    }

    // Load Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}', {
        page_title: document.title,
        page_location: window.location.href
      });
    `;
    document.head.appendChild(script2);

    // 清理函数，避免重复加载
    return () => {
      // 只在组件卸载时移除脚本
      const existingScripts = document.querySelectorAll(`script[src*="${measurementId}"]`);
      existingScripts.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, [measurementId]);

  // Track page views
  useEffect(() => {
    if (!measurementId || measurementId === 'G-XXXXXXXXXX') {
      return;
    }

    if (typeof gtag !== 'undefined') {
      gtag('config', measurementId, {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname + location.search
      });
    }
  }, [location, measurementId]);

  return null;
};

// Custom hook for tracking events
export const useGoogleAnalytics = () => {
  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, parameters);
    }
  };

  const trackPurchase = (transactionId: string, value: number, currency = 'CNY') => {
    trackEvent('purchase', {
      transaction_id: transactionId,
      value: value,
      currency: currency
    });
  };

  const trackWishCreated = (category: string) => {
    trackEvent('wish_created', {
      event_category: 'engagement',
      event_label: category
    });
  };

  const trackPracticeCompleted = (duration: number) => {
    trackEvent('practice_completed', {
      event_category: 'engagement',
      event_label: 'practice_session',
      value: duration
    });
  };

  return {
    trackEvent,
    trackPurchase,
    trackWishCreated,
    trackPracticeCompleted
  };
};

// TypeScript declaration
declare global {
  function gtag(...args: any[]): void;
}
