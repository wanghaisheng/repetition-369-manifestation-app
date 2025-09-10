import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, PlayCircle, CheckCircle, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HeroOptimized = () => {
  const { t, i18n } = useTranslation(['landing', 'common']);

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background gradient with animated elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto text-center max-w-6xl relative z-10">
        {/* Trust badge */}
        <div className="flex justify-center mb-6">
          <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
            <CheckCircle className="w-4 h-4 mr-2" />
            {i18n.language === 'zh' ? '已帮助 5,000+ 用户实现愿望' : 'Trusted by 5,000+ Users Worldwide'}
          </Badge>
        </div>

        {/* Main headline with improved hierarchy */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 leading-tight tracking-tight">
          {t('hero.title')}
        </h1>
        
        {/* Subheadline with better contrast */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-6 max-w-3xl mx-auto font-medium">
          {t('hero.subtitle')}
        </p>
        
        {/* Value proposition */}
        <p className="text-lg text-muted-foreground/80 mb-8 max-w-4xl mx-auto leading-relaxed">
          {t('hero.description')}
        </p>

        {/* Social proof stats with improved design */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-1">5,247+</div>
            <div className="text-sm text-muted-foreground font-medium">
              {i18n.language === 'zh' ? '月活用户' : 'Monthly Users'}
            </div>
          </div>
          <div className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border">
            <div className="text-3xl md:text-4xl font-bold text-green-600 mb-1">73%</div>
            <div className="text-sm text-muted-foreground font-medium">
              {i18n.language === 'zh' ? '用户留存率' : 'User Retention'}
            </div>
          </div>
          <div className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border">
            <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-1">4.7/5</div>
            <div className="text-sm text-muted-foreground font-medium">
              {i18n.language === 'zh' ? '用户评分' : 'User Rating'}
            </div>
          </div>
          <div className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border">
            <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-1">56+</div>
            <div className="text-sm text-muted-foreground font-medium">
              {i18n.language === 'zh' ? '成功案例' : 'Success Stories'}
            </div>
          </div>
        </div>

        {/* Optimized CTA section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link to="/auth" className="group">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground px-8 py-6 text-lg font-semibold shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105"
            >
              <Sparkles className="w-5 h-5 mr-2 group-hover:animate-spin" />
              {t('hero.cta')}
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg" 
            className="px-8 py-6 text-lg font-semibold border-2 hover:bg-accent/10"
          >
            <PlayCircle className="w-5 h-5 mr-2" />
            {t('hero.watchDemo')}
          </Button>
        </div>

        {/* Urgency and scarcity elements */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            <span>{i18n.language === 'zh' ? '73 人今日注册' : '73 people signed up today'}</span>
          </div>
          <div className="flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            <span>{i18n.language === 'zh' ? '免费开始，随时升级' : 'Start free, upgrade anytime'}</span>
          </div>
        </div>
      </div>
    </section>
  );
};