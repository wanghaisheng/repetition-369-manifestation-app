
import React from 'react';
import { Helmet } from 'react-helmet-async';

export const CriticalCSS = () => {
  const criticalStyles = `
    /* Critical above-the-fold styles */
    .ios-blur {
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }
    
    .safe-bottom {
      padding-bottom: env(safe-area-inset-bottom);
    }
    
    /* Prevent layout shift */
    .min-h-screen {
      min-height: 100vh;
      min-height: 100dvh;
    }
    
    /* Loading states */
    .skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;

  return (
    <Helmet>
      <style>{criticalStyles}</style>
      
      {/* Preload critical fonts */}
      <link
        rel="preload"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
        as="style"
        onLoad={(e) => {
          const target = e.target as HTMLLinkElement;
          target.onload = null;
          target.rel = 'stylesheet';
        }}
      />
      <noscript>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </noscript>
    </Helmet>
  );
};
