import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import founderPortrait from '@/assets/founder-portrait.jpg';
import { 
  Star,
  Github,
  Twitter,
  Linkedin,
  ExternalLink,
  Award,
  Code,
  Heart
} from 'lucide-react';

export const AboutFounderOptimized = () => {
  const { t, i18n } = useTranslation(['landing']);

  const socialLinks = [
    {
      name: 'Twitter',
      url: 'https://x.com/edwin_uestc',
      icon: Twitter,
      description: 'Follow for updates',
      color: 'text-blue-500'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/wanghaisheng',
      icon: Github,
      description: 'Open Source Projects',
      color: 'text-foreground'
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/wanghaisheng/',
      icon: Linkedin,
      description: 'Professional Network',
      color: 'text-blue-600'
    }
  ];

  const achievements = [
    {
      icon: Code,
      count: '15+',
      label: i18n.language === 'zh' ? '年开发经验' : 'Years of Development'
    },
    {
      icon: Award,
      count: '50+',
      label: i18n.language === 'zh' ? '开源项目' : 'Open Source Projects'
    },
    {
      icon: Heart,
      count: '5000+',
      label: i18n.language === 'zh' ? '用户信任' : 'Users Trust'
    }
  ];

  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            {i18n.language === 'zh' ? '创始人故事' : 'Founder Story'}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('about.title')}
          </h2>
          <h3 className="text-xl text-muted-foreground max-w-3xl mx-auto font-semibold">
            {t('about.subtitle')}
          </h3>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('about.description')}
            </p>

            {/* Achievement Stats */}
            <div className="grid grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <Card key={index} className="text-center bg-card/50 backdrop-blur-sm border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mx-auto mb-3">
                      <achievement.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">
                      {achievement.count}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      {achievement.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Credentials */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {i18n.language === 'zh' ? '专业背景' : 'Professional Background'}
              </h3>
              <div className="space-y-3">
                {(t('about.credentials', { returnObjects: true }) as string[]).map((credential, index) => (
                  <div key={index} className="flex items-center text-muted-foreground">
                    <Star className="w-4 h-4 text-yellow-500 mr-3 flex-shrink-0" />
                    <span>{credential}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {t('about.socialTitle')}
              </h3>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((link) => (
                  <Button
                    key={link.name}
                    variant="outline"
                    size="sm"
                    className="group"
                    asChild
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2"
                    >
                      <link.icon className={`w-4 h-4 ${link.color} group-hover:scale-110 transition-transform`} />
                      <span>{link.name}</span>
                      <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Founder Image/Avatar */}
          <div className="relative">
            <Card className="bg-card border shadow-xl">
              <CardContent className="p-12 text-center">
                <div className="relative mb-8">
                  <Avatar className="w-32 h-32 mx-auto border-4 border-border">
                    <AvatarImage src={founderPortrait} alt="Wang Haisheng - Founder" className="object-cover" />
                    <AvatarFallback className="bg-muted text-4xl">
                      WH
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-success rounded-full flex items-center justify-center">
                    <span className="text-success-foreground text-xs font-bold">✓</span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-2">Wang Haisheng</h3>
                <p className="text-muted-foreground mb-6">
                  {i18n.language === 'zh' ? '全栈开发者 & 显化实践者' : 'Full-Stack Developer & Manifestation Practitioner'}
                </p>
                
                <div className="bg-muted rounded-xl p-4">
                  <p className="text-sm text-muted-foreground italic">
                    "{i18n.language === 'zh' 
                      ? '技术改变生活，显化实现梦想' 
                      : 'Technology transforms life, manifestation realizes dreams'}"
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Floating elements */}
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-accent/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-primary/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};