import React from 'react';
import { 
  Menu, 
  Home, 
  Heart, 
  Sparkles, 
  BarChart3, 
  Users, 
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { useTranslation } from 'react-i18next';

interface DrawerMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DrawerMenu = ({ activeTab, onTabChange }: DrawerMenuProps) => {
  const { t } = useTranslation('app');

  const appPages = [
    { id: 'home', icon: Home, labelKey: 'nav.home' },
    { id: 'wishes', icon: Heart, labelKey: 'nav.wishes' },
    { id: 'practice', icon: Sparkles, labelKey: 'nav.practice' },
    { id: 'progress', icon: BarChart3, labelKey: 'nav.progress' },
    { id: 'community', icon: Users, labelKey: 'nav.community' },
    { id: 'settings', icon: Settings, labelKey: 'nav.settings' },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="fixed top-3 left-3 z-50 bg-background/80 backdrop-blur-sm shadow-sm border border-border/50 rounded-full w-10 h-10"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="text-left">{t('nav.brandName')}</SheetTitle>
        </SheetHeader>
        
        <div className="p-3">
          {appPages.map((page) => (
            <SheetClose asChild key={page.id}>
              <Button
                variant={activeTab === page.id ? 'secondary' : 'ghost'}
                className="w-full justify-start mb-1"
                onClick={() => onTabChange(page.id)}
              >
                <page.icon className="w-4 h-4 mr-3" />
                {t(page.labelKey)}
              </Button>
            </SheetClose>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
