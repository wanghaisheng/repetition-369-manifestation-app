
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface GoogleAnalyticsProps {
  measurementId: string;
}

export const GoogleAnalytics = ({ measurementId }: GoogleAnalyticsProps) => {
  const location = useLocation();

  useEffect(() => {
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

    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, [measurementId]);

  // Track page views
  useEffect(() => {
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
