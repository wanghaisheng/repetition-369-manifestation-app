import { m } from '@/paraglide/messages';
import { structured } from '@/i18n/structured';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Bell, TrendingUp, Users, Zap, Shield, Heart, Smartphone } from 'lucide-react';

export const OptimizedFeatures = () => {
  const features = structured<Array<{ title: string; description: string }>>('landing_features_list');

  const icons = [Target, Bell, TrendingUp, Users, Zap, Shield, Heart, Smartphone];

  return (
    <section className="py-24 px-4 bg-storybook-cream/30 paper-texture">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2 rounded-storybook border-storybook-honey/30">
            {m.landing_features_badge()}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-storybook font-bold text-foreground mb-6">
            {m.landing_features_title()}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {m.landing_features_subtitle()}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.slice(0, 8).map((feature, index) => {
            const Icon = icons[index] || Target;
            
            return (
              <Card 
                key={index} 
                className="group border-0 shadow-storybook hover:shadow-storybook-hover transition-all duration-500 transform hover:scale-105 bg-card/80 backdrop-blur-sm rounded-storybook-lg"
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-storybook-honey to-storybook-coral rounded-storybook-lg flex items-center justify-center mx-auto mb-4 group-hover:rotate-6 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg font-storybook font-semibold text-foreground group-hover:text-storybook-honey transition-colors">
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
          <div className="bg-storybook-blush/30 rounded-storybook-lg p-8 md:p-12 border border-storybook-coral/10">
            <h3 className="text-2xl md:text-3xl font-storybook font-bold text-foreground mb-4">
              {m.landing_features_highlight_title()}
            </h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              {m.landing_features_highlight_description()}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { icon: Zap, text: m.landing_features_highlight_items_fast() },
                { icon: Shield, text: m.landing_features_highlight_items_secure() },
                { icon: Heart, text: m.landing_features_highlight_items_loved() },
                { icon: Smartphone, text: m.landing_features_highlight_items_mobile() }
              ].map((item, index) => (
                <Badge key={index} variant="secondary" className="px-4 py-2 text-sm font-medium rounded-storybook">
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
