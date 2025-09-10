import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Bell, TrendingUp, Users, Zap, Shield, Heart, Smartphone } from 'lucide-react';

export const OptimizedFeatures = () => {
  const { t } = useTranslation(['landing']);

  const features = t('features.list', { returnObjects: true }) as Array<{
    title: string;
    description: string;
  }>;

  const icons = [Target, Bell, TrendingUp, Users, Zap, Shield, Heart, Smartphone];
  const gradients = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-blue-500',
    'from-pink-500 to-rose-500',
    'from-emerald-500 to-teal-500',
    'from-yellow-500 to-orange-500'
  ];

  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            {t('features.badge')}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('features.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.slice(0, 8).map((feature, index) => {
            const Icon = icons[index] || Target;
            const gradient = gradients[index] || gradients[0];
            
            return (
              <Card 
                key={index} 
                className="group border-0 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:scale-105 bg-card/50 backdrop-blur-sm"
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-6 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-center text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Feature highlight section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {t('features.highlight.title')}
            </h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              {t('features.highlight.description')}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { icon: Zap, text: t('features.highlight.items.fast') },
                { icon: Shield, text: t('features.highlight.items.secure') },
                { icon: Heart, text: t('features.highlight.items.loved') },
                { icon: Smartphone, text: t('features.highlight.items.mobile') }
              ].map((item, index) => (
                <Badge key={index} variant="secondary" className="px-4 py-2 text-sm font-medium">
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.text}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};