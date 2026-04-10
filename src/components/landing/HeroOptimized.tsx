import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Sparkles, PlayCircle, Users, TrendingUp } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export const HeroOptimized = () => {
  const { t } = useTranslation(['landing', 'common']);

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background gradient with animated elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto text-center max-w-6xl relative z-10">
        {/* Enhanced Trust Badge with Scarcity */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="flex items-center px-6 py-3 bg-badge-trust border border-badge-trust-border rounded-full animate-fade-in">
            <div className="flex items-center space-x-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full border-2 border-background animate-pulse"></div>
                <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-full border-2 border-background"></div>
                <div className="w-8 h-8 bg-gradient-to-br from-primary/80 to-accent/80 rounded-full border-2 border-background"></div>
              </div>
              <span className="text-badge-trust-text font-medium">
                {t('hero.trustBadge')}
              </span>
            </div>
          </div>
          
          {/* Early User Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-badge-highlight border border-badge-highlight-border rounded-full animate-fade-in">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
              <span className="text-badge-highlight-text font-semibold text-sm">
                {t('hero.earlyUserBadge')}
              </span>
            </div>
          </div>
        </div>

        {/* Main headline */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 leading-tight tracking-tight">
          {t('hero.h1', t('hero.title'))}
        </h1>
        
        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-6 max-w-3xl mx-auto font-medium">
          {t('hero.subtitle')}
        </p>
        
        {/* Value proposition */}
        <p className="text-lg text-muted-foreground/80 mb-8 max-w-4xl mx-auto leading-relaxed">
          {t('hero.description')}
        </p>

        {/* Enhanced Social Proof Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 max-w-4xl mx-auto">
          <div className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover-scale transition-all duration-300">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-1 animate-fade-in">5,247+</div>
            <div className="text-sm text-muted-foreground font-medium">
              {t('hero.monthlyUsers')}
            </div>
            <div className="text-xs text-muted-foreground/60 mt-1">
              {t('hero.monthlyUsersGrowth')}
            </div>
          </div>
          <div className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover-scale transition-all duration-300">
            <div className="text-3xl md:text-4xl font-bold text-success mb-1 animate-fade-in">89%</div>
            <div className="text-sm text-muted-foreground font-medium">
              {t('hero.successRate')}
            </div>
            <div className="text-xs text-muted-foreground/60 mt-1">
              {t('hero.successRateNote')}
            </div>
          </div>
          <div className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover-scale transition-all duration-300">
            <div className="text-3xl md:text-4xl font-bold text-accent mb-1 animate-fade-in">4.9/5</div>
            <div className="text-sm text-muted-foreground font-medium">
              {t('hero.userRating')}
            </div>
            <div className="text-xs text-muted-foreground/60 mt-1">
              {t('hero.userRatingNote')}
            </div>
          </div>
          <div className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover-scale transition-all duration-300">
            <div className="text-3xl md:text-4xl font-bold text-warning mb-1 animate-fade-in">18</div>
            <div className="text-sm text-muted-foreground font-medium">
              {t('hero.averageDays')}
            </div>
            <div className="text-xs text-muted-foreground/60 mt-1">
              {t('hero.averageDaysNote')}
            </div>
          </div>
        </div>
        
        {/* Real-time Activity Indicator */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-badge-success border border-badge-success-border rounded-full animate-fade-in">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-badge-success-text text-sm font-medium">
                {t('hero.realtimeActivity')}
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link to="/auth" className="group animate-scale-in">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground px-8 py-6 text-lg font-semibold shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105"
            >
              <Sparkles className="w-5 h-5 mr-2 group-hover:animate-spin" />
              {t('hero.cta')}
              <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                {t('hero.free')}
              </span>
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg" 
            className="px-8 py-6 text-lg font-semibold border-2 hover:bg-accent/10 hover-scale animate-scale-in"
          >
            <PlayCircle className="w-5 h-5 mr-2" />
            {t('hero.watchDemo')}
          </Button>
        </div>

        {/* Enhanced Urgency & Scarcity */}
        <div className="flex flex-col items-center gap-3 text-sm animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 bg-badge-urgent border border-badge-urgent-border rounded-full">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
              <span className="text-badge-urgent-text font-medium">
                {t('hero.urgencyBadge')}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-muted-foreground">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <span>
                {t('hero.newUsersJoined')}
                <span className="font-semibold text-primary animate-pulse">+127</span>
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
    </section>
  );
};
