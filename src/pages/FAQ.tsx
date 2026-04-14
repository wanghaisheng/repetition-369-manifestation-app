import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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

const FAQ = () => {
  const { t } = useTranslation(['common', 'faq']);

  const basicFaqItems = [
    { question: t('faq:basic.q1.question'), answer: t('faq:basic.q1.answer') },
    { question: t('faq:basic.q2.question'), answer: t('faq:basic.q2.answer') },
    { question: t('faq:basic.q3.question'), answer: t('faq:basic.q3.answer') },
    { question: t('faq:basic.q4.question'), answer: t('faq:basic.q4.answer') },
    { question: t('faq:basic.q5.question'), answer: t('faq:basic.q5.answer') },
    { question: t('faq:basic.q6.question'), answer: t('faq:basic.q6.answer') },
  ];

  const clarificationFaqItems = [
    { question: t('faq:clarifications.q1.question'), answer: t('faq:clarifications.q1.answer') },
    { question: t('faq:clarifications.q2.question'), answer: t('faq:clarifications.q2.answer') },
    { question: t('faq:clarifications.q3.question'), answer: t('faq:clarifications.q3.answer') },
    { question: t('faq:clarifications.q4.question'), answer: t('faq:clarifications.q4.answer') },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-storybook-cream/30 via-background to-storybook-blush/10">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('common:buttons.back', 'Back')}
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-8 h-8 text-storybook-honey" />
                <span className="text-2xl font-storybook font-bold text-foreground">{t('common:appName', '显化369')}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Link to="/auth">
                <Button className="rounded-storybook">{t('common:buttons.getStarted', 'Get Started')}</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4 paper-texture">
          <div className="container mx-auto text-center max-w-4xl">
            <div className="w-20 h-20 bg-gradient-to-br from-storybook-honey to-storybook-coral rounded-storybook-lg flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-storybook font-bold text-foreground mb-6 leading-tight">
              {t('faq:hero.h1', t('faq:hero.title'))}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('faq:hero.subtitle')}
            </p>
          </div>
        </section>

        {/* Basic FAQ Section */}
        <section className="py-20 px-4 bg-card">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-storybook font-bold text-foreground mb-4">{t('faq:basic.title')}</h2>
              <p className="text-lg text-muted-foreground">{t('faq:basic.subtitle')}</p>
            </div>
            
            <Accordion type="single" collapsible className="space-y-4">
              {basicFaqItems.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`basic-${index}`}
                  className="border border-border rounded-storybook px-6"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    <h3 className="text-lg font-medium text-foreground pr-4">
                      {faq.question}
                    </h3>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Clarifications FAQ Section */}
        <section className="py-20 px-4 bg-storybook-cream/30">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-storybook font-bold text-foreground mb-4">{t('faq:clarifications.title')}</h2>
              <p className="text-lg text-muted-foreground">{t('faq:clarifications.subtitle')}</p>
            </div>
            
            <Accordion type="single" collapsible className="space-y-4">
              {clarificationFaqItems.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`clarification-${index}`}
                  className="border border-storybook-honey/20 rounded-storybook px-6 bg-card"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    <h3 className="text-lg font-medium text-foreground pr-4">
                      {faq.question}
                    </h3>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <p className="text-muted-foreground leading-relaxed">
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
              <h2 className="text-4xl font-storybook font-bold text-foreground mb-4">{t('faq:support.title')}</h2>
              <p className="text-xl text-muted-foreground">{t('faq:support.subtitle')}</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: MessageCircle, title: t('faq:support.liveChat'), desc: t('faq:support.liveChat'), href: 'mailto:support@heymanifestation.com' },
                { icon: Mail, title: 'Email Support', desc: 'Get answers within 24 hours', href: 'mailto:support@heymanifestation.com' },
                { icon: ExternalLink, title: 'Community', desc: 'Connect with other users', href: 'https://github.com/wanghaisheng/369-manifestation-app/discussions' },
              ].map((item, index) => (
                <Card key={index} className="border-0 shadow-storybook hover:shadow-storybook-hover transition-shadow rounded-storybook-lg">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-storybook-honey to-storybook-coral rounded-storybook-lg flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-storybook">{item.title}</CardTitle>
                    <CardDescription>{item.desc}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-storybook-honey to-storybook-coral hover:opacity-90 text-white rounded-storybook transition-colors"
                    >
                      <span>Contact Us</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </CardContent>
                </Card>
              ))}
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
        <section className="py-20 px-4 bg-gradient-to-r from-storybook-honey to-storybook-coral text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-storybook font-bold mb-4">{t('faq:cta.title')}</h2>
            <p className="text-xl mb-6">{t('faq:cta.subtitle')}</p>
            <p className="text-lg mb-8 opacity-90">{t('faq:cta.description')}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="bg-white text-storybook-bark hover:bg-storybook-cream px-8 py-4 text-lg rounded-storybook-lg">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get Started
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg rounded-storybook-lg">
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
