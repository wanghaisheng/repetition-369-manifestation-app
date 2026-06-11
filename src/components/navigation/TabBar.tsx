
import { Home, Heart, Edit3, TrendingUp, Users } from 'lucide-react';

type Tab = 'home' | 'wishes' | 'practice' | 'progress' | 'community' | 'settings';

interface TabBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const TabBar = ({ activeTab, onTabChange }: TabBarProps) => {
  const tabs = [
    { id: 'home' as Tab, icon: Home, labelKey: 'nav.home' },
    { id: 'wishes' as Tab, icon: Heart, labelKey: 'nav.wishes' },
    { id: 'practice' as Tab, icon: Edit3, labelKey: 'nav.practice' },
    { id: 'progress' as Tab, icon: TrendingUp, labelKey: 'nav.progress' },
    { id: 'community' as Tab, icon: Users, labelKey: 'nav.community' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 ios-blur border-t border-ios-gray-medium safe-bottom">
      <div className="flex justify-around items-center py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-2 px-4 transition-colors duration-200 ${
                isActive ? 'text-ios-blue' : 'text-ios-gray'
              }`}
            >
              <Icon 
                size={24} 
                className={`mb-1 ${isActive ? 'fill-current' : ''}`}
              />
              <span className="text-xs font-medium">{t(tab.labelKey)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
