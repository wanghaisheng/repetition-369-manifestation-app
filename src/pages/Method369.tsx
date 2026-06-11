import { m } from '@/paraglide/messages';
import React from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { EnhancedInternalLinks } from '@/components/seo/EnhancedInternalLinks';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';
import { 
  Sparkles, 
  ArrowLeft,
  Clock,
  Calendar,
  Target,
  BookOpen,
  Lightbulb,
  Users,
  TrendingUp,
  CheckCircle,
  Star
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Method369 = () => {
  const howToStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: m.method369_seo_title(),
    description: m.method369_seo_description(),
    totalTime: 'P45D',
    supply: [
      { '@type': 'HowToSupply', name: m.method369_supplies_journal() },
      { '@type': 'HowToSupply', name: m.method369_supplies_pen() },
      { '@type': 'HowToSupply', name: m.method369_supplies_app() }
    ],
    step: [
      {
        '@type': 'HowToStep',
        name: m.method369_steps_step1_title(),
        text: m.method369_steps_step1_description()
      },
      {
        '@type': 'HowToStep',  
        name: m.method369_steps_step2_title(),
        text: m.method369_steps_step2_description()
      },
      {
        '@type': 'HowToStep',
        name: m.method369_steps_step3_title(),
        text: m.method369_steps_step3_description()
      }
    ]
  };

  const disclaimerPoints = [
    t('method369:disclaimer.points.0'),
    t('method369:disclaimer.points.1'),
    t('method369:disclaimer.points.2'),
    t('method369:disclaimer.points.3'),
    t('method369:disclaimer.points.4'),
  ];

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(howToStructuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-storybook-cream via-background to-storybook-blush">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {m.common_buttons_back()}
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-8 h-8 text-primary" />
                <span className="text-2xl font-bold text-foreground">{m.common_appName()}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Link to="/auth">
                <Button>{m.common_buttons_getStarted()}</Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs />
          
          {/* Hero Section */}
          <section className="py-12">
            <div className="text-center max-w-4xl mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-primary-foreground" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                {t('method369:hero.h1', m.method369_hero_title())}
              </h1>
              <p className="text-xl text-muted-foreground mb-4 max-w-3xl mx-auto">
                {m.method369_hero_subtitle()}
              </p>
              <p className="text-lg text-muted-foreground/80 mb-8 max-w-2xl mx-auto">
                {m.method369_hero_description()}
              </p>
            </div>
          </section>

          {/* What is 369 Method */}
          <section className="py-16 bg-card rounded-2xl mb-12">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
                {m.method369_what_title()}
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
                <p className="mb-6">
                  {m.method369_what_description1()}
                </p>
                <p className="mb-6">
                  {m.method369_what_description2()}
                </p>
                <blockquote className="border-l-4 border-primary pl-6 italic text-primary bg-primary/5 p-4 rounded-r-lg mb-6">
                  "{m.method369_what_teslaQuote()}" - Nikola Tesla
                </blockquote>
                <div className="bg-storybook-honey/10 border border-storybook-honey/30 rounded-lg p-4">
                  <p className="text-storybook-bark font-medium">
                    {m.method369_what_clarification()}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How it Works */}
          <section className="py-16">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
                {m.method369_howto_title()}
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-storybook-honey to-storybook-coral rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl">{m.method369_steps_step1_title()}</CardTitle>
                    <CardDescription className="text-storybook-honey font-medium">
                      {m.method369_steps_step1_time()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center leading-relaxed">
                      {m.method369_steps_step1_description()}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-storybook-sage to-storybook-sage/70 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl">{m.method369_steps_step2_title()}</CardTitle>
                    <CardDescription className="text-storybook-sage font-medium">
                      {m.method369_steps_step2_time()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center leading-relaxed">
                      {m.method369_steps_step2_description()}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/70 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl">{m.method369_steps_step3_title()}</CardTitle>
                    <CardDescription className="text-accent font-medium">
                      {m.method369_steps_step3_time()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center leading-relaxed">
                      {m.method369_steps_step3_description()}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Timeline */}
              <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-foreground mb-2 text-center">
                  {m.method369_timeline_title()}
                </h3>
                <p className="text-muted-foreground text-center mb-6">
                  {m.method369_timeline_subtitle()}
                </p>
                <div className="max-w-2xl mx-auto">
                  <div className="space-y-4">
                    {[
                      { day: '1-14', title: m.method369_timeline_week1_title(), desc: m.method369_timeline_week1_desc() },
                      { day: '15-28', title: m.method369_timeline_week2_title(), desc: m.method369_timeline_week2_desc() },
                      { day: '29-45', title: m.method369_timeline_week3_title(), desc: m.method369_timeline_week3_desc() }
                    ].map((phase, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-16 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                          {phase.day}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-foreground">{phase.title}</h4>
                          <p className="text-muted-foreground">{phase.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Scientific Background */}
          <section className="py-16 bg-card rounded-2xl mb-12">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
                {m.method369_science_title()}
              </h2>
              <p className="text-lg text-muted-foreground text-center mb-8">
                {m.method369_science_subtitle()}
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-storybook-honey/10 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                    <Lightbulb className="w-6 h-6 text-storybook-honey mr-2" />
                    {m.method369_science_neuroplasticity_title()}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {m.method369_science_neuroplasticity_description()}
                  </p>
                </div>
                
                <div className="bg-storybook-sage/10 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                    <TrendingUp className="w-6 h-6 text-storybook-sage mr-2" />
                    {m.method369_science_positivePhychology_title()}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {m.method369_science_positivePhychology_description()}
                  </p>
                </div>

                <div className="bg-accent/10 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                    <BookOpen className="w-6 h-6 text-accent mr-2" />
                    {m.method369_science_mindfulness_title()}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {m.method369_science_mindfulness_description()}
                  </p>
                </div>
              </div>
              
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {m.method369_science_research_title()}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {m.method369_science_research_description()}
                </p>
              </div>
            </div>
          </section>

          {/* Disclaimer Section */}
          <section className="py-12 mb-12">
            <div className="max-w-4xl mx-auto px-6">
              <div className="bg-storybook-honey/10 border border-storybook-honey/30 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                  {m.method369_disclaimer_title()}
                </h2>
                <ul className="space-y-3">
                  {disclaimerPoints.map((point, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-storybook-honey mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Success Stories */}
          <section className="py-16">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
                {m.method369_success_title()}
              </h2>
              <p className="text-xl text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
                {m.method369_success_subtitle()}
              </p>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { name: m.method369_success_story1_name(), goal: m.method369_success_story1_goal(), result: m.method369_success_story1_result() },
                  { name: m.method369_success_story2_name(), goal: m.method369_success_story2_goal(), result: m.method369_success_story2_result() },
                  { name: m.method369_success_story3_name(), goal: m.method369_success_story3_goal(), result: m.method369_success_story3_result() }
                ].map((story, index) => (
                  <Card key={index} className="border-0 shadow-lg">
                    <CardHeader>
                      <div className="flex items-center space-x-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-storybook-honey text-storybook-honey" />
                        ))}
                      </div>
                      <CardTitle className="text-lg">{story.name}</CardTitle>
                      <CardDescription>{story.goal}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground italic">"{story.result}"</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-2xl mb-12">
            <div className="text-center max-w-4xl mx-auto px-6">
              <h2 className="text-4xl font-bold mb-4">{m.method369_cta_title()}</h2>
              <p className="text-xl mb-8 opacity-90">{m.method369_cta_description()}</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth">
                  <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
                    <Sparkles className="w-5 h-5 mr-2" />
                    {m.method369_cta_startNow()}
                  </Button>
                </Link>
                <Link to="/faq">
                  <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 px-8 py-4 text-lg">
                    {m.method369_cta_learnMore()}
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          <EnhancedInternalLinks currentPage="method369" />
        </div>
      </div>
    </>
  );
};

export default Method369;
