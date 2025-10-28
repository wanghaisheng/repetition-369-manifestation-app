import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Quote, CheckCircle, Users, Award, Shield } from 'lucide-react';
import { useSiteStats } from '@/hooks/useSiteStats';

export const SocialProofSection = () => {
  const { t, i18n } = useTranslation(['landing']);
  const { getStatByKey } = useSiteStats();

  const testimonials = t('testimonials.list', { returnObjects: true }) as Array<{
    name: string;
    role: string;
    content: string;
    rating: number;
    avatar?: string;
    verified?: boolean;
  }>;

  const successMetrics = [
    {
      icon: Users,
      value: getStatByKey('monthly_users') + '+',
      label: i18n.language === 'zh' ? '月活跃用户' : 'Monthly Users',
      growth: `+${getStatByKey('weekly_increase')} ${i18n.language === 'zh' ? '本周' : 'this week'}`
    },
    {
      icon: Star,
      value: `${getStatByKey('user_rating')}/5`,
      label: i18n.language === 'zh' ? '用户评分' : 'User Rating',
      growth: i18n.language === 'zh' ? 'App Store 评分' : 'App Store Rating'
    },
    {
      icon: CheckCircle,
      value: `${getStatByKey('success_rate')}%`,
      label: i18n.language === 'zh' ? '成功率' : 'Success Rate',
      growth: i18n.language === 'zh' ? '30天内' : 'Within 30 days'
    },
    {
      icon: Award,
      value: getStatByKey('average_days'),
      label: i18n.language === 'zh' ? '平均天数' : 'Average Days',
      growth: i18n.language === 'zh' ? '实现目标' : 'To manifest goals'
    }
  ];

  return (
    <section className="py-24 px-4 bg-card/30">
      <div className="container mx-auto max-w-7xl">
        {/* Success Metrics */}
        <div className="text-center mb-20">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            {i18n.language === 'zh' ? '用户成果' : 'Proven Results'}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('testimonials.title')}
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            {t('testimonials.subtitle')}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {successMetrics.map((metric, index) => (
              <Card key={index} className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                      <metric.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">{metric.value}</div>
                  <div className="text-sm text-muted-foreground font-medium mb-2">{metric.label}</div>
                  <Badge variant="secondary" className="text-xs">
                    {metric.growth}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.slice(0, 6).map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold">
                      {testimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-base font-semibold text-foreground">
                        {testimonial.name}
                      </CardTitle>
                      {testimonial.verified && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <CardDescription className="text-sm">{testimonial.role}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="relative">
                  <Quote className="w-6 h-6 text-muted-foreground/30 absolute -top-2 -left-1" />
                  <p className="text-muted-foreground italic leading-relaxed pl-4">
                    "{testimonial.content}"
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-6 p-6 bg-muted/50 rounded-2xl">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-muted-foreground">
                {i18n.language === 'zh' ? '100% 安全可靠' : '100% Secure & Safe'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-muted-foreground">
                {i18n.language === 'zh' ? '数据隐私保护' : 'Privacy Protected'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-muted-foreground">
                {i18n.language === 'zh' ? '全球用户信赖' : 'Trusted Globally'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};