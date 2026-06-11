import { m } from '@/paraglide/messages';

import React, { useState, useEffect } from 'react';
import { Bell, X, Clock, Target, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationService } from '@/services/NotificationService';

export const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    practiceReminders: true, streakProtection: true, achievements: true, dailySummary: true
  });

  const { notifications, unreadCount, markAsRead, clearAll, config, updateConfig } = useNotifications();

  useEffect(() => { NotificationService.requestPermission(); }, []);

  useEffect(() => {
    if (config) setSettings({
      practiceReminders: config.practiceReminders, streakProtection: config.streakProtection,
      achievements: config.achievements, dailySummary: config.dailySummary
    });
  }, [config]);

  const handleSettingChange = async (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    await updateConfig({ [key]: value });
    if (key === 'practiceReminders' && value) await NotificationService.scheduleReminders('default');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'practice_reminder': return <Clock className="w-4 h-4 text-storybook-honey" />;
      case 'streak_warning': return <Target className="w-4 h-4 text-storybook-coral" />;
      case 'achievement': return <Award className="w-4 h-4 text-storybook-honey" />;
      default: return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="relative">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-card rounded-storybook-lg shadow-storybook-hover border border-border z-50">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-storybook font-semibold text-foreground">{m.app_notifications_title()}</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {!notifications || notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">{m.app_notifications_empty()}</div>
            ) : (
              notifications.map(notification => (
                <div key={notification.id}
                  className={`p-3 border-b border-border hover:bg-muted/50 cursor-pointer ${!notification.read ? 'bg-storybook-honey/5' : ''}`}
                  onClick={() => markAsRead(notification.id)}>
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{notification.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.body}</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">{new Date(notification.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-border bg-muted/30">
            <h4 className="text-sm font-medium text-foreground mb-3">{m.app_notifications_settings()}</h4>
            <div className="space-y-3">
              {[
                { key: 'practiceReminders' as const, label: m.app_notifications_practiceReminders() },
                { key: 'streakProtection' as const, label: m.app_notifications_streakProtection() },
                { key: 'achievements' as const, label: m.app_notifications_achievements() },
                { key: 'dailySummary' as const, label: m.app_notifications_dailySummary() },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <Switch checked={settings[item.key]} onCheckedChange={(checked) => handleSettingChange(item.key, checked)} />
                </div>
              ))}
            </div>
            {notifications && notifications.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearAll} className="w-full mt-3 rounded-storybook">
                {m.app_notifications_clearAll()}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
