import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LazySection } from "@/components/performance/LazySection";
import { OptimizedHeader } from '@/components/landing/OptimizedHeader';
import { HeroOptimized } from '@/components/landing/HeroOptimized';
import { OptimizedFeatures } from '@/components/landing/OptimizedFeatures';
import { AboutFounderOptimized } from '@/components/landing/AboutFounderOptimized';
import { SocialProofSection } from '@/components/landing/SocialProofSection';
import { ConversionOptimizedCTA } from '@/components/landing/ConversionOptimizedCTA';
import { OptimizedFooter } from '@/components/landing/OptimizedFooter';
import { AdminFloatingButton } from '@/components/admin/AdminFloatingButton';
import { HomePageLinks } from '@/components/seo/EnhancedInternalLinks';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/5">
      {/* Admin floating button */}
      <AdminFloatingButton />
      
      {/* Critical above-the-fold content */}
      <OptimizedHeader />
      <HeroOptimized />

      {/* Lazy-loaded sections for better performance */}
      <LazySection fallback={<div className="h-96 bg-muted/10 animate-pulse" />}>
        <OptimizedFeatures />
      </LazySection>

      <LazySection fallback={<div className="h-64 bg-muted/10 animate-pulse" />}>
        <AboutFounderOptimized />
      </LazySection>

      <LazySection fallback={<div className="h-80 bg-muted/10 animate-pulse" />}>
        <SocialProofSection />
      </LazySection>

      <LazySection fallback={<div className="h-96 bg-muted/10 animate-pulse" />}>
        <HomePageLinks />
      </LazySection>

      <LazySection fallback={<div className="h-48 bg-muted/10 animate-pulse" />}>
        <ConversionOptimizedCTA />
      </LazySection>

      <LazySection fallback={<div className="h-64 bg-muted/10 animate-pulse" />}>
        <OptimizedFooter />
      </LazySection>
    </div>
  );
};

export default Landing;
