
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MultiLanguageSEO } from '@/components/seo/MultiLanguageSEO';
import { SEOErrorBoundary } from '@/components/seo/SEOErrorBoundary';
import { EnhancedInternalLinks } from "@/components/seo/EnhancedInternalLinks";
import { AdvancedStructuredData } from "@/components/seo/AdvancedStructuredData";
import { SocialMediaCards } from "@/components/seo/SocialMediaCards";
import { CriticalResourcePreloader } from "@/components/performance/CriticalResourcePreloader";
import { OptimizedHeader } from '@/components/landing/OptimizedHeader';
import { HeroOptimized } from '@/components/landing/HeroOptimized';
import { OptimizedFeatures } from '@/components/landing/OptimizedFeatures';
import { AboutFounderOptimized } from '@/components/landing/AboutFounderOptimized';
import { SocialProofSection } from '@/components/landing/SocialProofSection';
import { ConversionOptimizedCTA } from '@/components/landing/ConversionOptimizedCTA';
import { OptimizedFooter } from '@/components/landing/OptimizedFooter';
import { 
  Sparkles, 
  Star,
  Github,
  Twitter,
  Linkedin,
  Coffee,
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const { t, i18n } = useTranslation(['landing', 'common']);

  const socialLinks = [
    {
      name: 'Twitter',
      url: 'https://x.com/edwin_uestc',
      icon: Twitter,
      description: t('about.socialTitle')
    },
    {
      name: 'GitHub',
      url: 'https://github.com/wanghaisheng',
      icon: Github,
      description: 'Open Source'
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/wanghaisheng/',
      icon: Linkedin,
      description: 'Professional'
    }
  ];

  const supportLinks = [
    {
      name: t('support.platforms.kofi'),
      url: 'https://ko-fi.com/tiktoka33697',
      icon: Coffee,
      description: t('support.platforms.kofi')
    },
    {
      name: t('support.platforms.patreon'),
      url: 'https://patreon.com/wanghaisheng',
      icon: Heart,
      description: t('support.platforms.patreon')
    }
  ];

  const features = t('features.list', { returnObjects: true }) as Array<{
    title: string;
    description: string;
  }>;

  const testimonials = t('testimonials.list', { returnObjects: true }) as Array<{
    name: string;
    role: string;
    content: string;
    rating: number;
  }>;

  return (
    <>
      <CriticalResourcePreloader />
      <SEOErrorBoundary>
        <MultiLanguageSEO 
          title={t('hero.title')}
          description={t('hero.description')}
          keywords={i18n.language === 'zh' ? '显化369,愿望实现,吸引力法则,369方法,冥想练习,正念' : 'manifest369,manifestation,law of attraction,369 method,meditation,mindfulness'}
        />
      </SEOErrorBoundary>
      <AdvancedStructuredData 
        type="WebPage"
        title={t('hero.title')}
        description={t('hero.description')}
        image="/369-app-icon.png"
      />
      <SocialMediaCards 
        title={t('hero.title')}
        description={t('hero.description')}
        type="website"
        image="/369-app-icon.png"
      />

      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/5">
        {/* Optimized Header */}
        <OptimizedHeader />

        {/* Optimized Hero Section */}
        <HeroOptimized />

        {/* Optimized Features Section */}
        <OptimizedFeatures />

        {/* About Founder Optimized Section */}
        <AboutFounderOptimized />

        {/* Social Proof and Testimonials */}
        <SocialProofSection />

        {/* Conversion Optimized CTA Section */}
        <ConversionOptimizedCTA />

        {/* Enhanced Internal Links */}
        <EnhancedInternalLinks currentPage="home" />

        {/* Optimized Footer */}
        <OptimizedFooter />
      </div>
    </>
  );
};

export default Landing;
