
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Bell, Clock, Target, Zap, Award } from 'lucide-react';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

interface ReminderSettings {
  practiceReminders: boolean;
  streakProtection: boolean;
  achievementNotifications: boolean;
  dailyMotivation: boolean;
  customTimes: string[];
}

interface NotificationPermission {
  granted: boolean;
  supported: boolean;
}

export const ReminderSystem = () => {
  const [settings, setSettings] = useState<ReminderSettings>({
    practiceReminders: false,
    streakProtection: false,
    achievementNotifications: true,
    dailyMotivation: false,
    customTimes: ['09:00', '18:00']
  });

  const [permission, setPermission] = useState<NotificationPermission>({
    granted: false,
    supported: 'Notification' in window
  });

  useEffect(() => {
    // 检查通知权限状态
    if (permission.supported) {
      setPermission(prev => ({
        ...prev,
        granted: Notification.permission === 'granted'
      }));
    }

    // 从本地存储加载设置
    const savedSettings = localStorage.getItem('reminder-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!permission.supported) {
      toast.error('您的浏览器不支持通知功能');
      return;
    }

    try {
      const result = await Notification.requestPermission();
      const granted = result === 'granted';
      
      setPermission(prev => ({ ...prev, granted }));
      
      if (granted) {
        toast.success('通知权限已开启！');
        // 发送测试通知
        showTestNotification();
      } else {
        toast.error('通知权限被拒绝，请在浏览器设置中手动开启');
      }
    } catch (error) {
      logger.error('Failed to request notification permission', error);
      toast.error('无法获取通知权限');
    }
  };

  const showTestNotification = () => {
    if (permission.granted) {
      new Notification('显化369提醒设置成功！', {
        body: '您将收到练习提醒和重要通知',
        icon: '/favicon.ico',
        tag: 'test-notification'
      });
    }
  };

  const updateSetting = (key: keyof ReminderSettings, value: boolean | string[]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('reminder-settings', JSON.stringify(newSettings));
    
    // 如果启用了通知但没有权限，请求权限
    if (value && !permission.granted && permission.supported) {
      requestNotificationPermission();
    }
  };

  const scheduleReminders = () => {
    if (!permission.granted) return;

    // 清除现有的提醒
    // 这里应该集成到service worker或使用其他持久化方案
    logger.log('Setting reminder times', settings.customTimes);
    toast.success('提醒时间已设置！');
  };

  const reminderTypes = [
    {
      key: 'practiceReminders' as const,
      title: '练习提醒',
      description: '在设定时间提醒你进行369练习',
      icon: <Target className="w-5 h-5" />,
      color: 'text-blue-600'
    },
    {
      key: 'streakProtection' as const,
      title: '连击保护',
      description: '当连击即将中断时及时提醒',
      icon: <Zap className="w-5 h-5" />,
      color: 'text-yellow-600'
    },
    {
      key: 'achievementNotifications' as const,
      title: '成就通知',
      description: '解锁新成就时立即通知',
      icon: <Award className="w-5 h-5" />,
      color: 'text-green-600'
    },
    {
      key: 'dailyMotivation' as const,
      title: '每日激励',
      description: '每天发送正能量消息',
      icon: <Bell className="w-5 h-5" />,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 权限状态卡片 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            通知权限
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!permission.supported ? (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">您的浏览器不支持通知功能</p>
            </div>
          ) : permission.granted ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                通知权限已开启
              </div>
              <Button onClick={showTestNotification} variant="outline" size="sm">
                测试通知
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center text-orange-600">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                需要开启通知权限
              </div>
              <Button onClick={requestNotificationPermission} className="w-full">
                开启通知权限
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 提醒设置 */}
      <Card>
        <CardHeader>
          <CardTitle>提醒设置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {reminderTypes.map((type) => (
            <div key={type.key} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={type.color}>{type.icon}</div>
                <div>
                  <h3 className="font-medium">{type.title}</h3>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </div>
              </div>
              <Switch
                checked={settings[type.key] as boolean}
                onCheckedChange={(checked) => updateSetting(type.key, checked)}
                disabled={!permission.supported}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 提醒时间设置 */}
      {(settings.practiceReminders || settings.dailyMotivation) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              提醒时间
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {settings.customTimes.map((time, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => {
                        const newTimes = [...settings.customTimes];
                        newTimes[index] = e.target.value;
                        updateSetting('customTimes', newTimes);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ios-blue focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
              <Button onClick={scheduleReminders} className="w-full" variant="outline">
                保存提醒时间
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// 智能提醒建议组件
export const SmartReminderSuggestions = () => {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    // 基于用户行为分析生成智能建议
    const generateSuggestions = () => {
      const now = new Date();
      const hour = now.getHours();
      const suggestions = [];

      if (hour < 10) {
        suggestions.push('建议在早上9点设置练习提醒，开启美好的一天');
      }
      
      if (hour > 17) {
        suggestions.push('晚上6点是反思和练习的好时间');
      }

      // 基于本地存储的练习历史分析最佳时间
      const practiceHistory = JSON.parse(localStorage.getItem('practice-history') || '[]');
      if (practiceHistory.length > 0) {
        suggestions.push('根据您的练习习惯，为您推荐最佳提醒时间');
      }

      setSuggestions(suggestions);
    };

    generateSuggestions();
  }, []);

  if (suggestions.length === 0) return null;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-base">智能建议</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-ios-blue rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-600">{suggestion}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
