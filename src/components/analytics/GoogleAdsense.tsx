
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

  if (!adSlot) {
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
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [adClient]);

  return null;
};

// TypeScript declaration
declare global {
  const adsbygoogle: any[];
}
