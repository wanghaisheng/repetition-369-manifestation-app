
import { useTranslation } from '@/i18n/compat';
import { m } from '@/paraglide/messages';
import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Target, TrendingUp, Users, Heart } from 'lucide-react';

interface RelatedPage {
  titleKey: string;
  descriptionKey: string;
  href: string;
  icon: React.ReactNode;
  relevance: number;
}

interface InternalLinksProps {
  currentPage: string;
  maxLinks?: number;
}

export const InternalLinks = ({ currentPage, maxLinks = 4 }: InternalLinksProps) => {
  const { t, i18n } = useTranslation('app');
  const allPages: Record<string, RelatedPage[]> = {
    '/': [
      {
        titleKey: 'internalLinks.wishManagement',
        descriptionKey: 'internalLinks.wishManagementDesc',
        href: '/wishes',
        icon: <Heart className="w-4 h-4" />,
        relevance: 0.9
      },
      {
        titleKey: 'internalLinks.startPractice',
        descriptionKey: 'internalLinks.startPracticeDesc',
        href: '/practice',
        icon: <Target className="w-4 h-4" />,
        relevance: 0.85
      },
      {
        titleKey: 'internalLinks.viewProgress',
        descriptionKey: 'internalLinks.viewProgressDesc',
        href: '/progress',
        icon: <TrendingUp className="w-4 h-4" />,
        relevance: 0.8
      },
      {
        titleKey: 'internalLinks.communityShare',
        descriptionKey: 'internalLinks.communityShareDesc',
        href: '/community',
        icon: <Users className="w-4 h-4" />,
        relevance: 0.7
      }
    ],
    '/wishes': [
      {
        titleKey: 'internalLinks.startPractice',
        descriptionKey: 'internalLinks.usePractice',
        href: '/practice',
        icon: <Target className="w-4 h-4" />,
        relevance: 0.95
      },
      {
        titleKey: 'internalLinks.viewProgress',
        descriptionKey: 'internalLinks.trackWishProgress',
        href: '/progress',
        icon: <TrendingUp className="w-4 h-4" />,
        relevance: 0.85
      },
      {
        titleKey: 'nav.home',
        descriptionKey: 'internalLinks.backToHome',
        href: '/',
        icon: <Heart className="w-4 h-4" />,
        relevance: 0.6
      }
    ],
    '/practice': [
      {
        titleKey: 'internalLinks.wishManagement',
        descriptionKey: 'internalLinks.adjustWishes',
        href: '/wishes',
        icon: <Heart className="w-4 h-4" />,
        relevance: 0.9
      },
      {
        titleKey: 'internalLinks.viewProgress',
        descriptionKey: 'internalLinks.viewProgressDesc',
        href: '/progress',
        icon: <TrendingUp className="w-4 h-4" />,
        relevance: 0.85
      },
      {
        titleKey: 'internalLinks.communityShare',
        descriptionKey: 'internalLinks.sharePractice',
        href: '/community',
        icon: <Users className="w-4 h-4" />,
        relevance: 0.7
      }
    ],
    '/progress': [
      {
        titleKey: 'internalLinks.continuePractice',
        descriptionKey: 'internalLinks.continuePracticeDesc',
        href: '/practice',
        icon: <Target className="w-4 h-4" />,
        relevance: 0.9
      },
      {
        titleKey: 'internalLinks.wishManagement',
        descriptionKey: 'internalLinks.adjustWishes',
        href: '/wishes',
        icon: <Heart className="w-4 h-4" />,
        relevance: 0.8
      },
      {
        titleKey: 'internalLinks.communityShare',
        descriptionKey: 'internalLinks.shareSuccess',
        href: '/community',
        icon: <Users className="w-4 h-4" />,
        relevance: 0.75
      }
    ],
    '/community': [
      {
        titleKey: 'internalLinks.myProgress',
        descriptionKey: 'internalLinks.myProgressDesc',
        href: '/progress',
        icon: <TrendingUp className="w-4 h-4" />,
        relevance: 0.8
      },
      {
        titleKey: 'internalLinks.startPractice',
        descriptionKey: 'internalLinks.inspired',
        href: '/practice',
        icon: <Target className="w-4 h-4" />,
        relevance: 0.75
      },
      {
        titleKey: 'internalLinks.wishManagement',
        descriptionKey: 'internalLinks.createNew',
        href: '/wishes',
        icon: <Heart className="w-4 h-4" />,
        relevance: 0.7
      }
    ]
  };

  const relatedPages = allPages[currentPage] || [];
  const sortedPages = relatedPages
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, maxLinks);

  if (sortedPages.length === 0) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">{m.app_internalLinks_relatedPages()}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {sortedPages.map((page) => (
            <Link
              key={page.href}
              to={page.href}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/10 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="text-primary">{page.icon}</div>
                <div>
                  <h4 className="font-medium text-foreground group-hover:text-primary">
                    {t(page.titleKey)}
                  </h4>
                  <p className="text-sm text-muted-foreground">{t(page.descriptionKey)}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Related links for page footer
export const RelatedLinks = ({ exclude = [] }: { exclude?: string[] }) => {
  const { t } = useTranslation('common');
  const location = useLocation();
  const quickLinks = [
    { titleKey: 'nav.home', href: '/', descriptionKey: 'internalLinks.backToHome' },
    { titleKey: 'internalLinks.wishManagement', href: '/wishes', descriptionKey: 'internalLinks.wishManagementDesc' },
    { titleKey: 'internalLinks.practiceCenter', href: '/practice', descriptionKey: 'internalLinks.practiceStartDesc' },
    { titleKey: 'internalLinks.progressTracking', href: '/progress', descriptionKey: 'internalLinks.progressTrackingDesc' },
    { titleKey: 'internalLinks.communityShare', href: '/community', descriptionKey: 'internalLinks.communityExchange' }
  ].filter(link => !exclude.includes(link.href) && link.href !== location.pathname);

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <h3 className="text-lg font-semibold mb-4">{m.app_internalLinks_quickNav()}</h3>
      <div className="grid grid-cols-2 gap-4">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className="flex flex-col p-3 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <span className="font-medium text-foreground hover:text-primary">
              {t(link.titleKey)}
            </span>
            <span className="text-sm text-muted-foreground mt-1">
              {t(link.descriptionKey)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
