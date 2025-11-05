
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { logger } from '@/utils/logger';

interface GoogleAdsenseProps {
  adClient: string;
  adSlot?: string;
}

export const GoogleAdsenseAuto = ({ adClient }: { adClient: string }) => {
  useEffect(() => {
    // Only load if adClient is provided and not placeholder
    if (!adClient || adClient.includes('XXXXXXXXXX')) {
      logger.warn('Google AdSense: Invalid or placeholder ad client');
      return;
    }

    // Load AdSense script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
      const existingScript = document.querySelector(`script[src*="${adClient}"]`);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [adClient]);

  // Don't render anything if no valid ad client
  if (!adClient || adClient.includes('XXXXXXXXXX')) {
    return null;
  }

  return (
    <Helmet>
      <script 
        async 
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
        crossOrigin="anonymous"
      />
    </Helmet>
  );
};

export const GoogleAdsense = ({ adClient, adSlot }: GoogleAdsenseProps) => {
  // Don't render anything if no valid ad client
  if (!adClient || adClient.includes('XXXXXXXXXX')) {
    return null;
  }

  return (
    <div>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};
