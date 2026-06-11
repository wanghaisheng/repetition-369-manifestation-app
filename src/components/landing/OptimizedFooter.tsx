import { m } from '@/paraglide/messages';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Sparkles,
  Github,
  Twitter,
  Linkedin,
  Coffee,
  Heart,
  Mail,
  Shield,
  FileText
} from 'lucide-react';
import { Link } from '@tanstack/react-router';

export const OptimizedFooter = () => {
  const socialLinks = [
    { name: 'Twitter', url: 'https://x.com/edwin_uestc', icon: Twitter },
    { name: 'GitHub', url: 'https://github.com/wanghaisheng', icon: Github },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/wanghaisheng/', icon: Linkedin }
  ];

  const supportLinks = [
    { name: m.landing_support_platforms_kofi(), url: 'https://ko-fi.com/tiktoka33697', icon: Coffee },
    { name: m.landing_support_platforms_patreon(), url: 'https://patreon.com/wanghaisheng', icon: Heart }
  ];

  const footerLinks = {
    product: [
      { name: m.common_footer_features(), href: '#features' },
      { name: m.common_footer_pricing(), href: '#pricing' },
      { name: m.common_footer_demo(), href: '#demo' }
    ],
    company: [
      { name: m.common_footer_about(), href: '/about' },
      { name: m.common_footer_blog(), href: '/blog' },
      { name: m.common_footer_stories(), href: '/user-stories' },
      { name: m.common_footer_contact(), href: 'mailto:support@369.heymanifestation.com' }
    ],
    support: [
      { name: m.common_footer_faq(), href: '/faq' },
      { name: m.common_footer_help(), href: '#help' },
      { name: m.common_footer_method369(), href: '/method369' },
      { name: m.common_footer_userGuide(), href: '#guide' }
    ],
    legal: [
      { name: m.common_footer_privacy(), href: '/privacy' },
      { name: m.common_footer_terms(), href: '/terms' }
    ]
  };

  return (
    <footer className="bg-storybook-cream/30 border-t border-border paper-texture">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-5 md:grid-cols-2 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-storybook-honey to-storybook-coral rounded-storybook flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-storybook font-bold text-foreground">{m.common_appName()}</span>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {m.landing_hero_subtitle()}
            </p>
            
            <div className="flex space-x-3">
              {socialLinks.map((link) => (
                <Button
                  key={link.name}
                  variant="outline"
                  size="icon"
                  className="hover:bg-storybook-honey hover:text-white hover:border-storybook-honey transition-colors rounded-storybook"
                  asChild
                >
                  <a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.name}>
                    <link.icon className="w-4 h-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-storybook font-semibold text-foreground mb-4">{m.common_footer_product()}</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-storybook font-semibold text-foreground mb-4">{m.common_footer_company()}</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  {link.href.startsWith('/') ? (
                    <Link to={link.href} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                      {link.name}
                    </Link>
                  ) : (
                    <a href={link.href} className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center space-x-1">
                      <span>{link.name}</span>
                      {link.href.includes('mailto:') && <Mail className="w-3 h-3" />}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-storybook font-semibold text-foreground mb-4">{m.common_footer_support()}</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  {link.href.startsWith('/') ? (
                    <Link to={link.href} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                      {link.name}
                    </Link>
                  ) : (
                    <a href={link.href} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Donation Links */}
          <div>
            <h3 className="font-storybook font-semibold text-foreground mb-4">{m.landing_support_title()}</h3>
            <div className="space-y-3 mb-6">
              {supportLinks.map((link) => (
                <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <link.icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </a>
              ))}
            </div>

            <h4 className="font-medium text-foreground mb-3 text-sm">{m.common_footer_legal()}</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-muted-foreground hover:text-foreground transition-colors text-xs flex items-center space-x-1">
                    <FileText className="w-3 h-3" />
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <p>{m.common_footer_copyright()}</p>
            <div className="flex items-center space-x-1">
              <Shield className="w-4 h-4" />
              <span>SSL Secured</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-xs text-muted-foreground">
            <span>Made with ❤️ by Wang Haisheng</span>
            <span>•</span>
            <span>Powered by Manifest369</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
