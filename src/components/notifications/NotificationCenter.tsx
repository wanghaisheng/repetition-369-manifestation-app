
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Settings, X, Clock, Target, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationService } from '@/services/NotificationService';

export const NotificationCenter = () => {
  const { t } = useTranslation('app');
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    practiceReminders: true,
    streakProtection: true,
    achievements: true,
    dailySummary: true
  });

  const { notifications, unreadCount, markAsRead, clearAll, config, updateConfig } = useNotifications();

  useEffect(() => {
    // Request notification permission on component mount
    NotificationService.requestPermission();
  }, []);

  useEffect(() => {
    // Update local settings when config loads
    if (config) {
      setSettings({
        practiceReminders: config.practiceReminders,
        streakProtection: config.streakProtection,
        achievements: config.achievements,
        dailySummary: config.dailySummary
      });
    }
  }, [config]);

  const handleSettingChange = async (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Update the notification config
    await updateConfig({ [key]: value });
    
    if (key === 'practiceReminders' && value) {
      await NotificationService.scheduleReminders('default');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'practice_reminder':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'streak_warning':
        return <Target className="w-4 h-4 text-orange-500" />;
      case 'achievement':
        return <Award className="w-4 h-4 text-yellow-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">通知中心</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {!notifications || notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {t('notifications.empty')}
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {notification.body}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Settings Section */}
          <div className="p-4 border-t bg-gray-50">
            <h4 className="text-sm font-medium text-gray-900 mb-3">通知设置</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">练习提醒</span>
                <Switch
                  checked={settings.practiceReminders}
                  onCheckedChange={(checked) => 
                    handleSettingChange('practiceReminders', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">连击保护</span>
                <Switch
                  checked={settings.streakProtection}
                  onCheckedChange={(checked) => 
                    handleSettingChange('streakProtection', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">成就通知</span>
                <Switch
                  checked={settings.achievements}
                  onCheckedChange={(checked) => 
                    handleSettingChange('achievements', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">每日总结</span>
                <Switch
                  checked={settings.dailySummary}
                  onCheckedChange={(checked) => 
                    handleSettingChange('dailySummary', checked)
                  }
                />
              </div>
            </div>
            
            {notifications && notifications.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                className="w-full mt-3"
              >
                清空所有通知
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
