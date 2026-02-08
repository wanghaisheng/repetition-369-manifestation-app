import React from 'react';
import { useTranslation } from 'react-i18next';
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
import { Link } from 'react-router-dom';

export const OptimizedFooter = () => {
  const { t } = useTranslation(['landing', 'common']);

  const socialLinks = [
    {
      name: 'Twitter',
      url: 'https://x.com/edwin_uestc',
      icon: Twitter
    },
    {
      name: 'GitHub',
      url: 'https://github.com/wanghaisheng',
      icon: Github
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/wanghaisheng/',
      icon: Linkedin
    }
  ];

  const supportLinks = [
    {
      name: t('support.platforms.kofi'),
      url: 'https://ko-fi.com/tiktoka33697',
      icon: Coffee
    },
    {
      name: t('support.platforms.patreon'),
      url: 'https://patreon.com/wanghaisheng',
      icon: Heart
    }
  ];

  const footerLinks = {
    product: [
      { name: t('common:footer.features'), href: '#features' },
      { name: t('common:footer.pricing'), href: '#pricing' },
      { name: t('common:footer.demo'), href: '#demo' }
    ],
    company: [
      { name: t('common:footer.about'), href: '/about' },
      { name: t('common:footer.blog'), href: '/blog' },
      { name: t('common:footer.stories'), href: '/user-stories' },
      { name: t('common:footer.contact'), href: 'mailto:support@369.heymanifestation.com' }
    ],
    support: [
      { name: t('common:footer.faq'), href: '/faq' },
      { name: t('common:footer.help'), href: '#help' },
      { name: t('common:footer.method369'), href: '/method369' },
      { name: t('common:footer.userGuide'), href: '#guide' }
    ],
    legal: [
      { name: t('common:footer.privacy'), href: '/privacy' },
      { name: t('common:footer.terms'), href: '/terms' }
      // Removed dead links: /cookies and /security (pages don't exist)
    ]
  };

  return (
    <footer className="bg-section-alt border-t border-border">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-5 md:grid-cols-2 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">{t('common:appName')}</span>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {t('hero.subtitle')}
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((link) => (
                <Button
                  key={link.name}
                  variant="outline"
                  size="icon"
                  className="hover:bg-primary hover:text-primary-foreground transition-colors"
                  asChild
                >
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.name}
                  >
                    <link.icon className="w-4 h-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              {t('common:footer.product')}
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              {t('common:footer.company')}
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  {link.href.startsWith('/') ? (
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center space-x-1"
                    >
                      <span>{link.name}</span>
                      {link.href.includes('mailto:') && <Mail className="w-3 h-3" />}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Help */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              {t('common:footer.support')}
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  {link.href.startsWith('/') ? (
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Donation Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              {t('landing:support.title')}
            </h3>
            <div className="space-y-3 mb-6">
              {supportLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </a>
              ))}
            </div>

            <h4 className="font-medium text-foreground mb-3 text-sm">
              {t('common:footer.legal')}
            </h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-xs flex items-center space-x-1"
                  >
                    <FileText className="w-3 h-3" />
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <p>{t('common:footer.copyright')}</p>
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
