
import { useEffect } from 'react';

interface GoogleAdsenseProps {
  adClient: string;
  adSlot?: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  fullWidthResponsive?: boolean;
}

export const GoogleAdsense = ({
  adClient,
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true
}: GoogleAdsenseProps) => {
  useEffect(() => {
    // 检查是否为有效的广告客户端ID
    if (!adClient || adClient === 'ca-pub-XXXXXXXXXX') {
      console.log('Google AdSense: Invalid ad client provided');
      return;
    }

    // Load AdSense script if not already loaded
    if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    // Initialize ads
    try {
      if (typeof adsbygoogle !== 'undefined') {
        (adsbygoogle as any[]).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, [adClient]);

  if (!adSlot || adClient === 'ca-pub-XXXXXXXXXX') {
    return null;
  }

  return (
    <div className="adsense-container my-4">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
};

// Auto Ads component
export const GoogleAdsenseAuto = ({ adClient }: { adClient: string }) => {
  useEffect(() => {
    // 检查是否为有效的广告客户端ID
    if (!adClient || adClient === 'ca-pub-XXXXXXXXXX') {
      console.log('Google AdSense Auto: Invalid ad client provided');
      return;
    }

    // 检查是否已经加载了 AdSense
    if (document.querySelector(`script[src*="${adClient}"]`)) {
      console.log('Google AdSense: Already loaded');
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    return () => {
      // 清理脚本
      const existingScripts = document.querySelectorAll(`script[src*="${adClient}"]`);
      existingScripts.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, [adClient]);

  return null;
};

// TypeScript declaration
declare global {
  const adsbygoogle: any[];
}
