import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MultiLanguageSEO } from '@/components/seo/MultiLanguageSEO';
import { SEOErrorBoundary } from '@/components/seo/SEOErrorBoundary';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { EnhancedInternalLinks } from '@/components/seo/EnhancedInternalLinks';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';
import { 
  Sparkles, 
  ArrowLeft,
  Clock,
  Calendar,
  Target,
  BookOpen,
  Lightbulb,
  Users,
  TrendingUp,
  CheckCircle,
  Star
} from 'lucide-react';
import { AdvancedStructuredData } from "@/components/seo/AdvancedStructuredData";
import { SocialMediaCards } from "@/components/seo/SocialMediaCards";
import { Helmet } from 'react-helmet-async';

const Method369 = () => {
  const { t, i18n } = useTranslation(['common', 'method369']);

  // 结构化数据
  const howToStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: t('method369:seo.title'),
    description: t('method369:seo.description'),
    totalTime: 'P45D', // 33-45 days (using upper bound)
    supply: [
      { '@type': 'HowToSupply', name: t('method369:supplies.journal') },
      { '@type': 'HowToSupply', name: t('method369:supplies.pen') },
      { '@type': 'HowToSupply', name: t('method369:supplies.app') }
    ],
    step: [
      {
        '@type': 'HowToStep',
        name: t('method369:steps.step1.title'),
        text: t('method369:steps.step1.description')
      },
      {
        '@type': 'HowToStep',  
        name: t('method369:steps.step2.title'),
        text: t('method369:steps.step2.description')
      },
      {
        '@type': 'HowToStep',
        name: t('method369:steps.step3.title'),
        text: t('method369:steps.step3.description')
      }
    ]
  };

  const howToSteps = [
    { name: t('method369:steps.step1.title'), text: t('method369:steps.step1.description') },
    { name: t('method369:steps.step2.title'), text: t('method369:steps.step2.description') },
    { name: t('method369:steps.step3.title'), text: t('method369:steps.step3.description') },
  ];

  // 辟谣声明点
  const disclaimerPoints = [
    t('method369:disclaimer.points.0'),
    t('method369:disclaimer.points.1'),
    t('method369:disclaimer.points.2'),
    t('method369:disclaimer.points.3'),
    t('method369:disclaimer.points.4'),
  ];

  return (
    <>
      <SEOErrorBoundary>
        <MultiLanguageSEO 
          title={t('method369:seo.title')}
          description={t('method369:seo.description')}
          keywords={t('method369:seo.keywords')}
          type="article"
        />
      </SEOErrorBoundary>
      <AdvancedStructuredData 
        type="HowTo"
        title={t('method369:seo.title')}
        description={t('method369:seo.description')}
        howToSteps={howToSteps}
        author="HeyManifestation"
        image="/369-app-icon.png"
      />
      <SocialMediaCards 
        title={t('method369:seo.title')}
        description={t('method369:seo.description')}
        type="article"
        author="HeyManifestation"
        image="/369-app-icon.png"
      />

      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(howToStructuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('common:buttons.back')}
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-8 h-8 text-blue-500" />
                <span className="text-2xl font-bold text-gray-900">{t('common:appName')}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Link to="/auth">
                <Button>{t('common:buttons.getStarted')}</Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs />
          
          {/* Hero Section */}
          <section className="py-12">
            <div className="text-center max-w-4xl mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {t('method369:hero.h1', t('method369:hero.title'))}
              </h1>
              <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
                {t('method369:hero.subtitle')}
              </p>
              <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
                {t('method369:hero.description')}
              </p>
            </div>
          </section>

          {/* What is 369 Method */}
          <section className="py-16 bg-white rounded-2xl mb-12">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                {t('method369:what.title')}
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <p className="mb-6">
                  {t('method369:what.description1')}
                </p>
                <p className="mb-6">
                  {t('method369:what.description2')}
                </p>
                <blockquote className="border-l-4 border-blue-500 pl-6 italic text-blue-800 bg-blue-50 p-4 rounded-r-lg mb-6">
                  "{t('method369:what.teslaQuote')}" - Nikola Tesla
                </blockquote>
                {/* 重要澄清声明 */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-amber-800 font-medium">
                    {t('method369:what.clarification')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How it Works */}
          <section className="py-16">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                {t('method369:howto.title')}
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{t('method369:steps.step1.title')}</CardTitle>
                    <CardDescription className="text-orange-600 font-medium">
                      {t('method369:steps.step1.time')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 text-center leading-relaxed">
                      {t('method369:steps.step1.description')}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{t('method369:steps.step2.title')}</CardTitle>
                    <CardDescription className="text-blue-600 font-medium">
                      {t('method369:steps.step2.time')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 text-center leading-relaxed">
                      {t('method369:steps.step2.description')}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{t('method369:steps.step3.title')}</CardTitle>
                    <CardDescription className="text-purple-600 font-medium">
                      {t('method369:steps.step3.time')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 text-center leading-relaxed">
                      {t('method369:steps.step3.description')}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Timeline */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                  {t('method369:timeline.title')}
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  {t('method369:timeline.subtitle')}
                </p>
                <div className="max-w-2xl mx-auto">
                  <div className="space-y-4">
                    {[
                      { day: '1-14', title: t('method369:timeline.week1.title'), desc: t('method369:timeline.week1.desc') },
                      { day: '15-28', title: t('method369:timeline.week2.title'), desc: t('method369:timeline.week2.desc') },
                      { day: '29-45', title: t('method369:timeline.week3.title'), desc: t('method369:timeline.week3.desc') }
                    ].map((phase, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-16 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {phase.day}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{phase.title}</h4>
                          <p className="text-gray-600">{phase.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Scientific Background - 三大科学原理 */}
          <section className="py-16 bg-white rounded-2xl mb-12">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                {t('method369:science.title')}
              </h2>
              <p className="text-lg text-gray-600 text-center mb-8">
                {t('method369:science.subtitle')}
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Lightbulb className="w-6 h-6 text-yellow-500 mr-2" />
                    {t('method369:science.neuroplasticity.title')}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {t('method369:science.neuroplasticity.description')}
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="w-6 h-6 text-green-500 mr-2" />
                    {t('method369:science.positivePhychology.title')}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {t('method369:science.positivePhychology.description')}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <BookOpen className="w-6 h-6 text-purple-500 mr-2" />
                    {t('method369:science.mindfulness.title')}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {t('method369:science.mindfulness.description')}
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('method369:science.research.title')}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t('method369:science.research.description')}
                </p>
              </div>
            </div>
          </section>

          {/* Disclaimer Section */}
          <section className="py-12 mb-12">
            <div className="max-w-4xl mx-auto px-6">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  {t('method369:disclaimer.title')}
                </h2>
                <ul className="space-y-3">
                  {disclaimerPoints.map((point, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Success Stories */}
          <section className="py-16">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                {t('method369:success.title')}
              </h2>
              <p className="text-xl text-gray-600 mb-12 text-center max-w-2xl mx-auto">
                {t('method369:success.subtitle')}
              </p>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { name: t('method369:success.story1.name'), goal: t('method369:success.story1.goal'), result: t('method369:success.story1.result') },
                  { name: t('method369:success.story2.name'), goal: t('method369:success.story2.goal'), result: t('method369:success.story2.result') },
                  { name: t('method369:success.story3.name'), goal: t('method369:success.story3.goal'), result: t('method369:success.story3.result') }
                ].map((story, index) => (
                  <Card key={index} className="border-0 shadow-lg">
                    <CardHeader>
                      <div className="flex items-center space-x-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <CardTitle className="text-lg">{story.name}</CardTitle>
                      <CardDescription>{story.goal}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 italic">"{story.result}"</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl mb-12">
            <div className="text-center max-w-4xl mx-auto px-6">
              <h2 className="text-4xl font-bold mb-4">{t('method369:cta.title')}</h2>
              <p className="text-xl mb-8 opacity-90">{t('method369:cta.description')}</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth">
                  <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
                    <Sparkles className="w-5 h-5 mr-2" />
                    {t('method369:cta.startNow')}
                  </Button>
                </Link>
                <Link to="/faq">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
                    {t('method369:cta.learnMore')}
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          <EnhancedInternalLinks currentPage="method369" />
        </div>
      </div>
    </>
  );
};

export default Method369;