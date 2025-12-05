import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Home, 
  Heart, 
  Sparkles, 
  BarChart3, 
  Users, 
  Settings,
  Info,
  HelpCircle,
  BookOpen,
  MessageSquare,
  Shield,
  FileText,
  X
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
import { Separator } from '@/components/ui/separator';

interface DrawerMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DrawerMenu = ({ activeTab, onTabChange }: DrawerMenuProps) => {
  const navigate = useNavigate();

  const appPages = [
    { id: 'home', icon: Home, label: '首页', path: '/app/home' },
    { id: 'wishes', icon: Heart, label: '愿望', path: '/app/wishes' },
    { id: 'practice', icon: Sparkles, label: '练习', path: '/app/practice' },
    { id: 'progress', icon: BarChart3, label: '进度', path: '/app/progress' },
    { id: 'community', icon: Users, label: '社区', path: '/app/community' },
    { id: 'settings', icon: Settings, label: '设置', path: '/app/settings' },
  ];

  const infoPages = [
    { icon: Info, label: '关于我们', path: '/about' },
    { icon: BookOpen, label: '369方法', path: '/method369' },
    { icon: HelpCircle, label: '常见问题', path: '/faq' },
    { icon: MessageSquare, label: '用户故事', path: '/user-stories' },
    { icon: FileText, label: '博客', path: '/blog' },
  ];

  const legalPages = [
    { icon: Shield, label: '隐私政策', path: '/privacy' },
    { icon: FileText, label: '服务条款', path: '/terms' },
  ];

  const handleNavigate = (path: string, isAppPage: boolean = false) => {
    if (isAppPage) {
      const tab = path.split('/').pop();
      onTabChange(tab || 'home');
    } else {
      navigate(path);
    }
  };

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
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="text-left">显化369</SheetTitle>
        </SheetHeader>
        
        <div className="overflow-y-auto h-[calc(100vh-60px)]">
          {/* App Pages */}
          <div className="p-2">
            <p className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              应用页面
            </p>
            {appPages.map((page) => (
              <SheetClose asChild key={page.id}>
                <Button
                  variant={activeTab === page.id ? 'secondary' : 'ghost'}
                  className="w-full justify-start mb-1"
                  onClick={() => handleNavigate(page.path, true)}
                >
                  <page.icon className="w-4 h-4 mr-3" />
                  {page.label}
                </Button>
              </SheetClose>
            ))}
          </div>

          <Separator />

          {/* Info Pages */}
          <div className="p-2">
            <p className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              了解更多
            </p>
            {infoPages.map((page) => (
              <SheetClose asChild key={page.path}>
                <Button
                  variant="ghost"
                  className="w-full justify-start mb-1"
                  onClick={() => handleNavigate(page.path)}
                >
                  <page.icon className="w-4 h-4 mr-3" />
                  {page.label}
                </Button>
              </SheetClose>
            ))}
          </div>

          <Separator />

          {/* Legal Pages */}
          <div className="p-2">
            <p className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              法律信息
            </p>
            {legalPages.map((page) => (
              <SheetClose asChild key={page.path}>
                <Button
                  variant="ghost"
                  className="w-full justify-start mb-1 text-muted-foreground"
                  onClick={() => handleNavigate(page.path)}
                >
                  <page.icon className="w-4 h-4 mr-3" />
                  {page.label}
                </Button>
              </SheetClose>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
