import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MultiLanguageSEO } from '@/components/seo/MultiLanguageSEO';
import { SEOErrorBoundary } from '@/components/seo/SEOErrorBoundary';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';
import { 
  Sparkles, 
  ArrowLeft,
  Heart,
  Target,
  Users,
  BookOpen,
  Star,
  Award,
  CheckCircle
} from 'lucide-react';

const About = () => {
  const { t } = useTranslation(['common', 'about']);

  return (
    <>
      <SEOErrorBoundary>
        <MultiLanguageSEO 
          title={t('about:seo.title', 'About Us - The Story Behind Manifestation 369')}
          description={t('about:seo.description', 'Learn about our mission and story')}
          keywords={t('about:seo.keywords', 'about,manifestation,369 method')}
          type="article"
        />
      </SEOErrorBoundary>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('common:buttons.back', 'Back')}
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-8 h-8 text-blue-500" />
                <span className="text-2xl font-bold text-gray-900">{t('common:appName', '显化369')}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Link to="/auth">
                <Button>{t('common:buttons.getStarted', 'Get Started')}</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              About Manifestation 369
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Learn about our story, mission, and why we created Manifestation 369
            </p>
          </div>
        </section>

        {/* Founder Story */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
                <div className="space-y-6 text-gray-700 leading-relaxed">
                  <p>I'm 38 years old, and for most of my life, I've had a habit of self-blame that started in my childhood. Every mistake, every setback, I would automatically turn inward with harsh criticism. This mindset held me back in countless ways and created patterns of negative thinking that were difficult to break.</p>
                  
                  <p>Three years ago, I reached a breaking point. I knew I needed to change my mindset fundamentally if I was ever going to achieve the life I wanted. I began researching mindset shifts and discovered manifestation techniques.</p>
                  
                  <p>The problem was that there wasn't much practical, easy-to-follow guidance available. Most resources were either too vague or overly complicated. This frustration became my inspiration to create Manifestation 369.</p>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Professional Background</h3>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">15+ years of Internet product development experience</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">Deep research in personal growth & psychology</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">Expert in manifestation method practice & validation</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-16 h-16" />
                    </div>
                    <p className="text-xl font-semibold">Wang Haisheng</p>
                    <p className="text-white/80">Founder</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold mb-4">Join Our Community</h2>
            <p className="text-xl mb-6">Start your manifestation journey today</p>
            <p className="text-lg mb-8 opacity-90">Whether you're new to manifestation or an experienced practitioner, we have the tools for you</p>
            
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
                <Sparkles className="w-5 h-5 mr-2" />
                {t('common:buttons.getStarted', 'Get Started')}
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;