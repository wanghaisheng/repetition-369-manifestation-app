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

interface DrawerMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DrawerMenu = ({ activeTab, onTabChange }: DrawerMenuProps) => {
  const appPages = [
    { id: 'home', icon: Home, label: '首页' },
    { id: 'wishes', icon: Heart, label: '愿望' },
    { id: 'practice', icon: Sparkles, label: '练习' },
    { id: 'progress', icon: BarChart3, label: '进度' },
    { id: 'community', icon: Users, label: '社区' },
    { id: 'settings', icon: Settings, label: '设置' },
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
          <SheetTitle className="text-left">显化369</SheetTitle>
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
                {page.label}
              </Button>
            </SheetClose>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
