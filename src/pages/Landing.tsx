
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MultiLanguageSEO } from '@/components/seo/MultiLanguageSEO';
import { SEOErrorBoundary } from '@/components/seo/SEOErrorBoundary';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';
import { EnhancedInternalLinks } from "@/components/seo/EnhancedInternalLinks";
import { AdvancedStructuredData } from "@/components/seo/AdvancedStructuredData";
import { SocialMediaCards } from "@/components/seo/SocialMediaCards";
import { CriticalResourcePreloader } from "@/components/performance/CriticalResourcePreloader";
import { HeroOptimized } from '@/components/landing/HeroOptimized';
import { OptimizedFeatures } from '@/components/landing/OptimizedFeatures';
import { SocialProofSection } from '@/components/landing/SocialProofSection';
import { ConversionOptimizedCTA } from '@/components/landing/ConversionOptimizedCTA';
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

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold text-gray-900">{t('common:appName')}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Link to="/auth">
                <Button variant="outline">{t('common:buttons.signIn')}</Button>
              </Link>
              <Link to="/auth">
                <Button>{t('common:buttons.getStarted')}</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Optimized Hero Section */}
        <HeroOptimized />

        {/* Optimized Features Section */}
        <OptimizedFeatures />

        {/* About Founder Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('about.title')}</h2>
                <p className="text-xl text-gray-600 mb-6">{t('about.subtitle')}</p>
                <p className="text-gray-700 mb-8 leading-relaxed">{t('about.description')}</p>
                
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {i18n.language === 'zh' ? '专业背景：' : 'Professional Background:'}
                  </h3>
                  <ul className="space-y-2">
                    {(t('about.credentials', { returnObjects: true }) as string[]).map((credential, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <Star className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
                        {credential}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('about.socialTitle')}</h3>
                  <div className="flex space-x-4">
                    {socialLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <link.icon className="w-5 h-5" />
                        <span>{link.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">👨‍💻</span>
                    </div>
                    <p className="text-xl font-semibold">Wang Haisheng</p>
                    <p className="text-white/80">Full-Stack Developer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof and Testimonials */}
        <SocialProofSection />

        {/* Support Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('support.title')}</h2>
            <p className="text-xl text-gray-600 mb-6">{t('support.subtitle')}</p>
            <p className="text-gray-700 mb-8 max-w-2xl mx-auto">{t('support.description')}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              {supportLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-lg transition-colors"
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </a>
              ))}
            </div>
            
            <p className="text-gray-600 italic">{t('support.thanks')}</p>
          </div>
        </section>

        {/* Conversion Optimized CTA Section */}
        <ConversionOptimizedCTA />

        {/* Enhanced Internal Links */}
        <EnhancedInternalLinks currentPage="home" />

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                  <span className="text-xl font-bold">{t('common:appName')}</span>
                </div>
                <p className="text-gray-400 mb-4">{t('hero.subtitle')}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">{t('common:footer.support')}</h3>
                <div className="space-y-2">
                  {supportLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">{t('common:footer.contact')}</h3>
                <div className="space-y-2">
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center">
              <p className="text-gray-400">{t('common:footer.copyright')}</p>
              <div className="flex justify-center space-x-6 mt-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  {t('common:footer.privacy')}
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  {t('common:footer.terms')}
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Landing;
