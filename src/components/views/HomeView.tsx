
import { useState, useEffect } from 'react';
import { Sparkles, Target, Calendar, Users, Sunrise, Sun, Moon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { Tab } from '@/pages/Index';

interface HomeViewProps {
  onNavigate: (tab: Tab) => void;
}

export const HomeView = ({ onNavigate }: HomeViewProps) => {
  const [greeting, setGreeting] = useState('');
  const [timeIcon, setTimeIcon] = useState<React.ReactNode>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('早上好');
      setTimeIcon(<Sunrise className="w-6 h-6 text-manifest-warm-gold" />);
    } else if (hour < 18) {
      setGreeting('下午好');
      setTimeIcon(<Sun className="w-6 h-6 text-manifest-warm-gold" />);
    } else {
      setGreeting('晚上好');
      setTimeIcon(<Moon className="w-6 h-6 text-manifest-gold" />);
    }
  }, []);

  const quickActions = [
    {
      id: 'wishes',
      icon: Target,
      title: '设定愿望',
      subtitle: '创建新的显化目标',
      color: 'bg-gradient-to-br from-manifest-gold to-manifest-warm-gold',
      action: () => onNavigate('wishes')
    },
    {
      id: 'practice',
      icon: Calendar,
      title: '369练习',
      subtitle: '开始今日书写练习',
      color: 'bg-gradient-to-br from-ios-blue to-blue-600',
      action: () => onNavigate('practice')
    },
    {
      id: 'progress',
      icon: Sparkles,
      title: '查看进度',
      subtitle: '追踪显化历程',
      color: 'bg-gradient-to-br from-manifest-lavender to-purple-400',
      action: () => onNavigate('progress')
    },
    {
      id: 'community',
      icon: Users,
      title: '加入社区',
      subtitle: '与他人分享经验',
      color: 'bg-gradient-to-br from-manifest-sage-green to-green-500',
      action: () => onNavigate('community')
    }
  ];

  return (
    <div className="flex-1 bg-gradient-calm px-4 py-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          {timeIcon}
          <h1 className="text-2xl font-bold text-gray-800">{greeting}</h1>
        </div>
        <p className="text-gray-600">开始您的显化之旅</p>
      </div>

      {/* Today's Inspiration */}
      <Card className="mb-6 p-6 bg-white/80 ios-blur border-0 shadow-ios">
        <div className="flex items-center space-x-3 mb-3">
          <Sparkles className="w-6 h-6 text-manifest-gold" />
          <h3 className="text-lg font-semibold text-gray-800">今日启发</h3>
        </div>
        <p className="text-gray-700 leading-relaxed">
          "想象力比知识更重要。知识是有限的，而想象力拥抱整个世界。"
        </p>
        <p className="text-sm text-gray-500 mt-2">— 阿尔伯特·爱因斯坦</p>
      </Card>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">快速开始</h3>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.id}
                className="p-4 border-0 shadow-ios cursor-pointer transform transition-all duration-200 hover:scale-105 active:scale-95"
                onClick={action.action}
              >
                <div className={`w-12 h-12 rounded-ios flex items-center justify-center mb-3 ${action.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">{action.title}</h4>
                <p className="text-sm text-gray-600">{action.subtitle}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Today's Stats */}
      <Card className="mt-6 p-6 bg-white/80 ios-blur border-0 shadow-ios">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">今日统计</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-manifest-warm-gold">3</div>
            <div className="text-sm text-gray-600">早上书写</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-ios-blue">6</div>
            <div className="text-sm text-gray-600">下午书写</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-manifest-lavender">9</div>
            <div className="text-sm text-gray-600">晚上书写</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
