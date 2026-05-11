import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Sparkles, PlayCircle, Users, TrendingUp } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export const HeroOptimized = () => {
  const { t } = useTranslation(['landing', 'common']);

  return (
    <section className="relative py-24 px-4 overflow-hidden paper-texture">
      {/* Soft watercolor background blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-16 left-8 w-80 h-80 bg-storybook-honey/10 rounded-blob blur-3xl animate-float-gentle" />
        <div className="absolute bottom-16 right-8 w-96 h-96 bg-storybook-coral/8 rounded-blob blur-3xl animate-float-gentle" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-storybook-sage/5 rounded-blob blur-3xl" />
      </div>

      <div className="container mx-auto text-center max-w-6xl relative z-10">
        {/* Trust Badge — storybook style */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="inline-flex items-center px-5 py-2.5 bg-storybook-cream border border-storybook-honey/20 rounded-storybook-lg shadow-storybook animate-fade-in">
            <div className="flex items-center space-x-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-storybook-honey to-storybook-coral rounded-full border-2 border-background" />
                <div className="w-8 h-8 bg-gradient-to-br from-storybook-coral to-storybook-sage rounded-full border-2 border-background" />
                <div className="w-8 h-8 bg-gradient-to-br from-storybook-sage to-storybook-honey rounded-full border-2 border-background" />
              </div>
              <span className="text-storybook-bark font-storybook font-medium">
                {t('hero.trustBadge')}
              </span>
            </div>
          </div>

          {/* Early User Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-storybook-blush border border-storybook-coral/20 rounded-storybook shadow-storybook animate-fade-in">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-storybook-honey rounded-full animate-pulse" />
              <span className="text-storybook-bark font-storybook font-semibold text-sm">
                {t('hero.earlyUserBadge')}
              </span>
            </div>
          </div>
        </div>

        {/* Main headline — warm serif */}
        <h1 className="font-storybook text-5xl md:text-6xl lg:text-7xl font-bold text-storybook-bark mb-6 leading-tight tracking-tight">
          {t('hero.h1', t('hero.title'))}
        </h1>

        {/* Subheadline */}
        <p className="font-storybook text-xl md:text-2xl text-storybook-bark/70 mb-6 max-w-3xl mx-auto font-medium">
          {t('hero.subtitle')}
        </p>

        {/* Value proposition */}
        <p className="text-lg text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
          {t('hero.description')}
        </p>

        {/* Social Proof Stats — storybook cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8 max-w-4xl mx-auto">
          {[
            { value: '5,247+', label: t('hero.monthlyUsers'), note: t('hero.monthlyUsersGrowth'), color: 'text-storybook-honey' },
            { value: '89%', label: t('hero.successRate'), note: t('hero.successRateNote'), color: 'text-storybook-sage' },
            { value: '4.9/5', label: t('hero.userRating'), note: t('hero.userRatingNote'), color: 'text-storybook-coral' },
            { value: '18', label: t('hero.averageDays'), note: t('hero.averageDaysNote'), color: 'text-storybook-honey' },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center p-4 rounded-storybook-lg bg-card/60 backdrop-blur-sm border border-storybook-honey/10 shadow-storybook hover:shadow-storybook-hover transition-all duration-300"
            >
              <div className={`text-3xl md:text-4xl font-storybook font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              <div className="text-xs text-muted-foreground/60 mt-1">{stat.note}</div>
            </div>
          ))}
        </div>

        {/* Real-time Activity */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-storybook-sage/10 border border-storybook-sage/20 rounded-storybook animate-fade-in">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-storybook-sage rounded-full animate-pulse" />
              <span className="text-storybook-bark/80 text-sm font-medium">
                {t('hero.realtimeActivity')}
              </span>
            </div>
          </div>
        </div>

        {/* CTA — warm gradient */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link to="/auth" className="group animate-scale-in">
            <Button
              size="lg"
              className="bg-gradient-to-r from-storybook-honey to-storybook-coral hover:from-storybook-honey/90 hover:to-storybook-coral/90 text-white px-8 py-6 text-lg font-storybook font-semibold shadow-storybook-hover rounded-storybook-lg transition-all duration-300 transform group-hover:scale-105"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {t('hero.cta')}
              <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                {t('hero.free')}
              </span>
            </Button>
          </Link>
          <Link to="/try" className="group animate-scale-in">
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-6 text-lg font-storybook font-semibold border-2 border-storybook-honey/40 text-storybook-bark hover:bg-storybook-cream rounded-storybook-lg"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              {t('hero.tryNoSignup')}
            </Button>
          </Link>
        </div>

        {/* Urgency — soft storybook treatment */}
        <div className="flex flex-col items-center gap-3 text-sm animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 bg-storybook-coral/10 border border-storybook-coral/20 rounded-storybook">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-storybook-coral rounded-full animate-pulse" />
              <span className="text-storybook-bark/80 font-medium">
                {t('hero.urgencyBadge')}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-muted-foreground">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <span>
                {t('hero.newUsersJoined')}
                <span className="font-semibold text-storybook-honey animate-pulse">+127</span>
                {t('hero.newUsersJoinedSuffix')}
              </span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              <span>{t('hero.earlyBadgeReward')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Watercolor edge at bottom */}
      <div className="watercolor-edge absolute bottom-0 left-0 right-0 h-8" />
    </section>
  );
};
