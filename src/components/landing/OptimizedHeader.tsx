import { m } from '@/paraglide/messages';
import React from 'react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';
import { Sparkles } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export const OptimizedHeader = () => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/90 border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-storybook-honey to-storybook-coral rounded-storybook flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-storybook font-bold text-foreground">{m.common_appName()}</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          <Link to="/auth">
            <Button variant="outline" size="sm" className="rounded-storybook">
              {m.common_buttons_signIn()}
            </Button>
          </Link>
          <Link to="/auth">
            <Button size="sm" className="bg-gradient-to-r from-storybook-honey to-storybook-coral text-white hover:opacity-90 rounded-storybook">
              {m.common_buttons_getStarted()}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
