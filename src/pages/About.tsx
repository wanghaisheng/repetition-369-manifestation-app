import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MultiLanguageSEO } from '@/components/seo/MultiLanguageSEO';
import { SEOErrorBoundary } from '@/components/seo/SEOErrorBoundary';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';
import { EnhancedInternalLinks } from '@/components/seo/EnhancedInternalLinks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import founderPortrait from '@/assets/founder-portrait.jpg';
import { 
  Sparkles, 
  ArrowLeft,
  Brain,
  Target,
  Users,
  Zap,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Rocket,
  ExternalLink,
  Twitter,
  Github,
  Linkedin
} from 'lucide-react';

const About = () => {
  const { t, i18n } = useTranslation(['common', 'about']);
  const isZh = i18n.language === 'zh';

  const socialLinks = [
    { name: 'Twitter', url: 'https://x.com/edwin_uestc', icon: Twitter },
    { name: 'GitHub', url: 'https://github.com/wanghaisheng', icon: Github },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/wanghaisheng/', icon: Linkedin }
  ];

  const credentials = [
    { key: 'science', icon: Brain },
    { key: 'structure', icon: Target },
    { key: 'gamification', icon: Zap },
    { key: 'bilingual', icon: Users },
    { key: 'community', icon: BookOpen }
  ];

  const clarifications = [
    { key: 'notMagic', type: 'info' },
    { key: 'needAction', type: 'info' },
    { key: 'noGuarantee', type: 'info' },
    { key: 'toolNotResult', type: 'info' }
  ];

  return (
    <>
      <SEOErrorBoundary>
        <MultiLanguageSEO 
          title={t('about:seo.title')}
          description={t('about:seo.description')}
          keywords={t('about:seo.keywords')}
          type="article"
        />
      </SEOErrorBoundary>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('common:buttons.back')}
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-8 h-8 text-primary" />
                <span className="text-2xl font-bold text-foreground">{t('common:appName')}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Link to="/auth">
                <Button>{t('common:buttons.getStarted')}</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section with Brand Anchor */}
        <section className="py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto text-center max-w-4xl">
            <Badge variant="outline" className="mb-6 px-4 py-2">
              {t('about:brand.anchor')}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              {t('about:hero.h1')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              {t('about:hero.subtitle')}
            </p>
            
            {/* Key Metrics */}
            <div className="flex justify-center items-center flex-wrap gap-8 text-sm">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">33-45</div>
                <div className="text-muted-foreground">{t('about:metrics.practiceDay')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">3-6-9</div>
                <div className="text-muted-foreground">{isZh ? '每日练习次数' : 'Daily Practice'}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">2</div>
                <div className="text-muted-foreground">{t('about:metrics.languages')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">5+</div>
                <div className="text-muted-foreground">{t('about:metrics.features')}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Founder Story - Full Narrative */}
        <section className="py-20 px-4 bg-card">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-5 gap-12 items-start">
              {/* Story Content - 3 columns */}
              <div className="lg:col-span-3 space-y-8">
                <div>
                  <Badge className="mb-4">{isZh ? '创始人故事' : 'Founder Story'}</Badge>
                  <h2 className="text-3xl font-bold text-foreground mb-4">{t('about:story.title')}</h2>
                  <p className="text-lg text-primary font-medium mb-6">{t('about:story.intro')}</p>
                </div>
                
                <div className="space-y-6 text-muted-foreground leading-relaxed">
                  <p>{t('about:story.personal')}</p>
                  <p>{t('about:story.turning')}</p>
                  <p>{t('about:story.problem')}</p>
                  <p>{t('about:story.solution')}</p>
                  <p>{t('about:story.discovery')}</p>
                  <p>{t('about:story.creation')}</p>
                </div>

                {/* Brand Anchor Repetition */}
                <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg">
                  <p className="text-foreground font-medium">
                    {t('about:brand.anchor')}
                  </p>
                  <p className="text-muted-foreground mt-2">
                    {t('about:brand.tagline')}
                  </p>
                </div>
              </div>
              
              {/* Founder Card - 2 columns */}
              <div className="lg:col-span-2">
                <Card className="sticky top-24 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <Avatar className="w-28 h-28 mx-auto mb-6 border-4 border-primary/20">
                      <AvatarImage src={founderPortrait} alt="Founder" className="object-cover" />
                      <AvatarFallback className="bg-primary/10 text-2xl">WH</AvatarFallback>
                    </Avatar>
                    
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {isZh ? 'HeyManifestation 创始人' : 'Founder of HeyManifestation'}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {isZh ? '显化实践者 & 产品开发者' : 'Manifestation Practitioner & Product Developer'}
                    </p>
                    
                    <div className="bg-muted rounded-lg p-4 mb-6">
                      <p className="text-sm text-muted-foreground italic">
                        "{isZh 
                          ? '通过显化练习，曾经主导我思想的自我批评已大大消解，取而代之的是自我同情和积极的人生观。' 
                          : 'Through manifestation practice, the self-blame that once dominated my thoughts has largely dissolved, replaced by self-compassion and a positive outlook.'}"
                      </p>
                    </div>
                    
                    {/* Social Links */}
                    <div className="flex justify-center gap-3">
                      {socialLinks.map((link) => (
                        <Button key={link.name} variant="outline" size="icon" asChild>
                          <a href={link.url} target="_blank" rel="noopener noreferrer">
                            <link.icon className="w-4 h-4" />
                          </a>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Science Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">{isZh ? '科学基础' : 'Scientific Foundation'}</Badge>
              <h2 className="text-3xl font-bold text-foreground mb-4">{t('about:method.title')}</h2>
              <p className="text-muted-foreground">{t('about:method.origin')}</p>
            </div>
            
            <Card className="mb-8">
              <CardContent className="p-8">
                <p className="text-muted-foreground mb-6">{t('about:method.science')}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {(t('about:method.principles', { returnObjects: true }) as string[]).map((principle, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground text-sm">{principle}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Clarification Section - Important for E-E-A-T */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">{isZh ? '透明声明' : 'Transparency'}</Badge>
              <h2 className="text-3xl font-bold text-foreground mb-4">{t('about:clarification.title')}</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {clarifications.map((item, index) => (
                <Card key={index} className="border-primary/20">
                  <CardContent className="p-6 flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-foreground">{t(`about:clarification.${item.key}`)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">{t('about:credentials.title')}</h2>
            </div>
            
            <div className="grid md:grid-cols-5 gap-6">
              {credentials.map((cred, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <cred.icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">{t(`about:credentials.${cred.key}`)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 px-4 bg-card">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">{t('about:mission.title')}</h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{t('about:mission.description')}</p>
            <p className="text-lg text-muted-foreground leading-relaxed">{t('about:mission.goal')}</p>
          </div>
        </section>

        {/* Future Plans */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-8 flex items-start gap-6">
                <Rocket className="w-10 h-10 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{t('about:future.title')}</h3>
                  <p className="text-muted-foreground">{t('about:future.description')}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Internal Links Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <EnhancedInternalLinks currentPage="about" maxLinks={12} showClusterLabels />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold mb-4">{t('about:cta.title')}</h2>
            <p className="text-xl mb-4 opacity-90">{t('about:cta.subtitle')}</p>
            <p className="text-lg mb-8 opacity-80 max-w-2xl mx-auto">{t('about:cta.description')}</p>
            
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="px-8 py-6 text-lg">
                <Sparkles className="w-5 h-5 mr-2" />
                {t('common:buttons.getStarted')}
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer Brand Anchor */}
        <section className="py-8 px-4 bg-muted/50 text-center">
          <p className="text-sm text-muted-foreground">
            {t('about:brand.anchor')} — {t('about:brand.tagline')}
          </p>
        </section>
      </div>
    </>
  );
};

export default About;