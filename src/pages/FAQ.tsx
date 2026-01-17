import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MultiLanguageSEO } from '@/components/seo/MultiLanguageSEO';
import { SEOErrorBoundary } from '@/components/seo/SEOErrorBoundary';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';
import { EnhancedInternalLinks } from '@/components/seo/EnhancedInternalLinks';
import { 
  Sparkles, 
  ArrowLeft,
  HelpCircle,
  MessageCircle,
  Mail,
  ExternalLink
} from 'lucide-react';
import { AdvancedStructuredData } from "@/components/seo/AdvancedStructuredData";
import { SocialMediaCards } from "@/components/seo/SocialMediaCards";

const FAQ = () => {
  const { t } = useTranslation(['common', 'faq']);

  // 基础知识FAQ
  const basicFaqItems = [
    { question: t('faq:basic.q1.question'), answer: t('faq:basic.q1.answer') },
    { question: t('faq:basic.q2.question'), answer: t('faq:basic.q2.answer') },
    { question: t('faq:basic.q3.question'), answer: t('faq:basic.q3.answer') },
    { question: t('faq:basic.q4.question'), answer: t('faq:basic.q4.answer') },
    { question: t('faq:basic.q5.question'), answer: t('faq:basic.q5.answer') },
    { question: t('faq:basic.q6.question'), answer: t('faq:basic.q6.answer') },
  ];

  // 常见误区澄清FAQ
  const clarificationFaqItems = [
    { question: t('faq:clarifications.q1.question'), answer: t('faq:clarifications.q1.answer') },
    { question: t('faq:clarifications.q2.question'), answer: t('faq:clarifications.q2.answer') },
    { question: t('faq:clarifications.q3.question'), answer: t('faq:clarifications.q3.answer') },
    { question: t('faq:clarifications.q4.question'), answer: t('faq:clarifications.q4.answer') },
  ];

  // 合并所有FAQ用于结构化数据
  const allFaqItems = [...basicFaqItems, ...clarificationFaqItems];

  return (
    <>
      <SEOErrorBoundary>
        <MultiLanguageSEO 
          title={t('faq:seo.title', 'FAQ - Manifestation 369 User Guide')}
          description={t('faq:seo.description', 'Find answers to frequently asked questions about Manifestation 369')}
          keywords={t('faq:seo.keywords', 'faq,manifestation 369,help,guide')}
        />
      </SEOErrorBoundary>
      <AdvancedStructuredData 
        type="FAQPage"
        title={t('faq:seo.title', 'FAQ - Manifestation 369 User Guide')}
        description={t('faq:seo.description', 'Find answers to frequently asked questions about Manifestation 369')}
        faqItems={allFaqItems}
        author="HeyManifestation"
      />
      <SocialMediaCards 
        title={t('faq:seo.title', 'FAQ - Manifestation 369 User Guide')}
        description={t('faq:seo.description', 'Find answers to frequently asked questions about Manifestation 369')}
        type="article"
        author="HeyManifestation"
      />

      {/* FAQ结构化数据 */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: allFaqItems.map(item => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer
            }
          }))
        })}
      </script>

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
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {t('faq:hero.h1', t('faq:hero.title'))}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {t('faq:hero.subtitle')}
            </p>
          </div>
        </section>

        {/* Basic FAQ Section */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('faq:basic.title')}</h2>
              <p className="text-lg text-gray-600">{t('faq:basic.subtitle')}</p>
            </div>
            
            <Accordion type="single" collapsible className="space-y-4">
              {basicFaqItems.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`basic-${index}`}
                  className="border border-gray-200 rounded-lg px-6"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    <h3 className="text-lg font-medium text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Clarifications FAQ Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('faq:clarifications.title')}</h2>
              <p className="text-lg text-gray-600">{t('faq:clarifications.subtitle')}</p>
            </div>
            
            <Accordion type="single" collapsible className="space-y-4">
              {clarificationFaqItems.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`clarification-${index}`}
                  className="border border-amber-200 rounded-lg px-6 bg-white"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    <h3 className="text-lg font-medium text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Support Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('faq:support.title')}</h2>
              <p className="text-xl text-gray-600">{t('faq:support.subtitle')}</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{t('faq:support.liveChat')}</CardTitle>
                  <CardDescription>{t('faq:support.liveChat')}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <a
                    href="mailto:support@heymanifestation.com"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-colors"
                  >
                    <span>Contact Us</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">Email Support</CardTitle>
                  <CardDescription>Get answers within 24 hours</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <a
                    href="mailto:support@heymanifestation.com"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-colors"
                  >
                    <span>Contact Us</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ExternalLink className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">Community</CardTitle>
                  <CardDescription>Connect with other users</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <a
                    href="https://github.com/wanghaisheng/369-manifestation-app/discussions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-colors"
                  >
                    <span>Contact Us</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Internal Links Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <EnhancedInternalLinks currentPage="faq" maxLinks={12} showClusterLabels />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold mb-4">{t('faq:cta.title')}</h2>
            <p className="text-xl mb-6">{t('faq:cta.subtitle')}</p>
            <p className="text-lg mb-8 opacity-90">{t('faq:cta.description')}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get Started
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default FAQ;