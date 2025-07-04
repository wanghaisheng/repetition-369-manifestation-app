
import { useEffect } from 'react';

interface MicrosoftClarityProps {
  projectId: string;
}

export const MicrosoftClarity = ({ projectId }: MicrosoftClarityProps) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.innerHTML = `
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${projectId}");
    `;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [projectId]);

  return null;
};

// Custom hook for Clarity events
export const useMicrosoftClarity = () => {
  const trackEvent = (eventName: string, data?: Record<string, any>) => {
    if (typeof clarity !== 'undefined') {
      clarity('event', eventName, data);
    }
  };

  const identifyUser = (userId: string, userData?: Record<string, any>) => {
    if (typeof clarity !== 'undefined') {
      clarity('identify', userId, userData);
    }
  };

  return {
    trackEvent,
    identifyUser
  };
};

// TypeScript declaration
declare global {
  function clarity(...args: any[]): void;
}
