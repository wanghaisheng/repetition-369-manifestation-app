import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Target, 
  BookOpen, 
  TrendingUp, 
  Users, 
  HelpCircle,
  Info
} from 'lucide-react';

interface InternalLinkProps {
  to: string;
  title: string;
  description: string;
  icon: React.ElementType;
  className?: string;
}

const InternalLinkCard: React.FC<InternalLinkProps> = ({ 
  to, 
  title, 
  description, 
  icon: Icon, 
  className = '' 
}) => (
  <Link 
    to={to}
    className={`group block p-4 bg-card hover:bg-accent/50 rounded-lg border transition-all duration-200 hover:shadow-lg ${className}`}
  >
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  </Link>
);

export const EnhancedInternalLinks: React.FC<{ currentPage?: string }> = ({ currentPage }) => {
  const { t } = useTranslation(['common', 'app']);

  const allLinks = [
    {
      to: '/about',
      titleKey: 'nav.about',
      descriptionKey: 'nav.aboutDesc',
      icon: Info,
      page: 'about'
    },
    {
      to: '/faq',
      titleKey: 'nav.faq',  
      descriptionKey: 'nav.faqDesc',
      icon: HelpCircle,
      page: 'faq'
    }
  ];

  // 过滤掉当前页面的链接
  const relevantLinks = allLinks.filter(link => link.page !== currentPage);

  if (relevantLinks.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 mb-8">
      <div className="border-t pt-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          {t('common:nav.related')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {relevantLinks.map((link) => (
            <InternalLinkCard
              key={link.to}
              to={link.to}
              title={t(link.titleKey)}
              description={t(link.descriptionKey)}
              icon={link.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export const HomePageLinks: React.FC = () => {
  const { t } = useTranslation(['common', 'landing']);

  const homeLinks = [
    {
      to: '/about',
      title: t('common:nav.about'),
      description: t('common:nav.aboutDesc'),
      icon: Info
    },
    {
      to: '/faq', 
      title: t('common:nav.faq'),
      description: t('common:nav.faqDesc'),
      icon: HelpCircle
    }
  ];

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto max-w-4xl px-4">
        <h2 className="text-2xl font-bold text-center text-foreground mb-8">
          {t('landing:nav.moreInfo')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {homeLinks.map((link) => (
            <InternalLinkCard
              key={link.to}
              to={link.to}
              title={link.title}
              description={link.description}
              icon={link.icon}
              className="md:p-6"
            />
          ))}
        </div>
      </div>
    </section>
  );
};