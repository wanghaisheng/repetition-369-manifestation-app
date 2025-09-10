import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, ArrowRight, Clock, Users, Gift, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ConversionOptimizedCTA = () => {
  const { t, i18n } = useTranslation(['landing', 'common']);
  const [email, setEmail] = useState('');

  const benefits = [
    {
      icon: Gift,
      text: i18n.language === 'zh' ? '永久免费使用基础功能' : 'Free Forever Plan'
    },
    {
      icon: CheckCircle,
      text: i18n.language === 'zh' ? '无需信用卡' : 'No Credit Card Required'
    },
    {
      icon: Users,
      text: i18n.language === 'zh' ? '加入 5,000+ 用户社区' : 'Join 5,000+ Happy Users'
    }
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-primary via-primary/90 to-accent text-primary-foreground relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-5xl text-center relative z-10">
        {/* Urgency badge */}
        <div className="flex justify-center mb-6">
          <Badge variant="secondary" className="bg-white/20 text-primary-foreground border-white/30 px-4 py-2">
            <Clock className="w-4 h-4 mr-2" />
            {i18n.language === 'zh' ? '限时优惠：今日免费注册' : 'Limited Time: Sign Up Free Today'}
          </Badge>
        </div>

        <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          {t('cta.title')}
        </h2>
        
        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto font-medium">
          {t('cta.subtitle')}
        </p>

        <p className="text-lg mb-12 opacity-80 max-w-4xl mx-auto leading-relaxed">
          {t('cta.description')}
        </p>

        {/* Primary CTA */}
        <div className="mb-12">
          <Link to="/auth" className="group inline-block">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-primary hover:bg-gray-100 px-12 py-6 text-xl font-bold shadow-2xl group-hover:shadow-3xl transition-all duration-300 transform group-hover:scale-105"
            >
              <Sparkles className="w-6 h-6 mr-3 group-hover:animate-spin" />
              {t('common:buttons.getStarted')}
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Benefits list */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center justify-center space-x-3 text-primary-foreground/90">
              <benefit.icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{benefit.text}</span>
            </div>
          ))}
        </div>

        {/* Email capture alternative */}
        <Card className="max-w-md mx-auto bg-white/10 border-white/20 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-primary-foreground mb-4">
              {i18n.language === 'zh' ? '或者订阅我们的更新' : 'Or Subscribe for Updates'}
            </h3>
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder={i18n.language === 'zh' ? '输入您的邮箱' : 'Enter your email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/20 border-white/30 text-primary-foreground placeholder:text-primary-foreground/60"
              />
              <Button 
                variant="secondary" 
                className="bg-white text-primary hover:bg-gray-100 px-6"
              >
                {i18n.language === 'zh' ? '订阅' : 'Subscribe'}
              </Button>
            </div>
            <p className="text-xs text-primary-foreground/70 mt-3">
              {i18n.language === 'zh' 
                ? '我们承诺不会发送垃圾邮件，您可以随时取消订阅。' 
                : 'No spam. Unsubscribe at any time.'}
            </p>
          </CardContent>
        </Card>

        {/* Social proof */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-primary-foreground/80">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>{i18n.language === 'zh' ? '127 人今日注册' : '127 people signed up today'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>{i18n.language === 'zh' ? '平均 2 分钟完成设置' : 'Setup in 2 minutes'}</span>
          </div>
        </div>
      </div>
    </section>
  );
};