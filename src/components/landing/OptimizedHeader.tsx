import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const OptimizedHeader = () => {
  const { t } = useTranslation(['common']);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/90 border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">{t('appName')}</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          <Link to="/auth">
            <Button variant="outline" size="sm">
              {t('buttons.signIn')}
            </Button>
          </Link>
          <Link to="/auth">
            <Button size="sm" className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90">
              {t('buttons.getStarted')}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};