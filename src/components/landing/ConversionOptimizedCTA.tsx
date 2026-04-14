import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, ArrowRight, Users, Gift, CheckCircle, Share2, Copy } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';
import { SEO_CONFIG } from '@/config/seo';

export const ConversionOptimizedCTA = () => {
  const { t } = useTranslation(['landing', 'common']);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');

  const handleShare = async () => {
    const shareData = {
      title: t('cta.shareData.title'),
      text: t('cta.shareData.text'),
      url: typeof window !== 'undefined' ? window.location.origin : SEO_CONFIG.DOMAIN
    };
    
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      toast.success(t('cta.copiedToClipboard'));
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="py-24 px-4 bg-storybook-cream/30 paper-texture relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 bg-storybook-honey rounded-blob blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-storybook-coral rounded-blob blur-3xl" />
      </div>

      <div className="container mx-auto max-w-5xl text-center relative z-10">
        {/* Enhanced urgency badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center px-4 py-2 bg-storybook-blush border border-storybook-coral/20 rounded-storybook animate-fade-in">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-storybook-coral rounded-full animate-pulse" />
              <span className="text-storybook-bark font-semibold text-sm">
                {t('landing:hero.urgencyBadge')}
              </span>
            </div>
          </div>
        </div>

        <h2 className="text-4xl md:text-6xl font-storybook font-bold mb-6 leading-tight text-foreground">
          {t('cta.title')}
        </h2>
        
        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto font-medium text-muted-foreground">
          {t('cta.subtitle')}
        </p>

        <p className="text-lg mb-12 opacity-80 max-w-4xl mx-auto leading-relaxed text-muted-foreground">
          {t('cta.description')}
        </p>

        {/* Enhanced Primary CTA */}
        <div className="mb-12">
          <Link to="/auth" className="group inline-block animate-scale-in">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-storybook-honey to-storybook-coral text-white hover:opacity-90 px-12 py-6 text-xl font-storybook font-bold shadow-storybook-hover transition-all duration-300 transform group-hover:scale-105 rounded-storybook-lg"
            >
              <Sparkles className="w-6 h-6 mr-3" />
              {t('common:buttons.getStarted')}
              <span className="ml-3 text-sm bg-white/20 px-3 py-1 rounded-full">
                {t('cta.foreverFree')}
              </span>
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Enhanced benefits list */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="flex flex-col items-center justify-center space-y-2 text-foreground transition-all duration-300">
            <Gift className="w-8 h-8 mb-2 text-storybook-honey" />
            <span className="font-medium text-center">{t('cta.freePlan')}</span>
            <div className="text-xs text-muted-foreground">{t('cta.freePlanProof')}</div>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2 text-foreground transition-all duration-300">
            <CheckCircle className="w-8 h-8 mb-2 text-storybook-sage" />
            <span className="font-medium text-center">{t('cta.noCreditCard')}</span>
            <div className="text-xs text-muted-foreground">{t('cta.noCreditCardProof')}</div>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2 text-foreground transition-all duration-300">
            <Users className="w-8 h-8 mb-2 text-storybook-coral" />
            <span className="font-medium text-center">{t('cta.joinCommunity')}</span>
            <div className="text-xs text-muted-foreground">{t('cta.joinCommunityProof')}</div>
          </div>
        </div>

        {/* Email capture */}
        <Card className="max-w-md mx-auto bg-card border shadow-storybook rounded-storybook-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-storybook font-semibold text-foreground mb-4">
              {t('cta.subscribeTitle')}
            </h3>
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder={t('cta.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background border-input rounded-storybook"
              />
              <Button className="bg-storybook-honey text-white hover:bg-storybook-honey/90 px-6 rounded-storybook">
                {t('cta.subscribe')}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">{t('cta.noSpam')}</p>
          </CardContent>
        </Card>

        {/* Share section */}
        <div className="mt-12 space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-storybook font-semibold text-foreground mb-3">
              {t('cta.shareTitle')}
            </h3>
            <Button 
              onClick={handleShare}
              variant="outline" 
              className="border-border hover:bg-storybook-cream rounded-storybook transition-all duration-300"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2 text-storybook-sage" />
                  {t('cta.linkCopied')}
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 mr-2" />
                  {t('cta.shareLink')}
                </>
              )}
            </Button>
          </div>
          
          {/* Real-time social proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-storybook-sage rounded-full animate-pulse" />
              <span>{t('cta.usersJoined')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>{t('cta.setupTime')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
