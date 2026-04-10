
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Bell, Clock, Target, Zap, Award } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('app');
  const [settings, setSettings] = useState<ReminderSettings>({
    practiceReminders: false,
    streakProtection: false,
    achievementNotifications: true,
    dailyMotivation: false,
    customTimes: ['09:00', '18:00']
  });

  const [permission, setPermission] = useState<NotificationPermission>({
    granted: false,
    supported: typeof window !== 'undefined' && 'Notification' in window
  });

  useEffect(() => {
    if (permission.supported) {
      setPermission(prev => ({
        ...prev,
        granted: Notification.permission === 'granted'
      }));
    }

    const savedSettings = localStorage.getItem('reminder-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!permission.supported) {
      toast.error(t('reminders.notSupported'));
      return;
    }

    try {
      const result = await Notification.requestPermission();
      const granted = result === 'granted';
      
      setPermission(prev => ({ ...prev, granted }));
      
      if (granted) {
        toast.success(t('reminders.permissionGranted'));
        showTestNotification();
      } else {
        toast.error(t('reminders.permissionDenied'));
      }
    } catch (error) {
      logger.error('Failed to request notification permission', error);
      toast.error(t('reminders.permissionFailed'));
    }
  };

  const showTestNotification = () => {
    if (permission.granted) {
      new Notification(t('reminders.testNotificationTitle'), {
        body: t('reminders.testNotificationBody'),
        icon: '/favicon.ico',
        tag: 'test-notification'
      });
    }
  };

  const updateSetting = (key: keyof ReminderSettings, value: boolean | string[]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('reminder-settings', JSON.stringify(newSettings));
    
    if (value && !permission.granted && permission.supported) {
      requestNotificationPermission();
    }
  };

  const scheduleReminders = () => {
    if (!permission.granted) return;
    logger.log('Setting reminder times', settings.customTimes);
    toast.success(t('reminders.remindersSaved'));
  };

  const reminderTypes = [
    {
      key: 'practiceReminders' as const,
      titleKey: 'reminders.practiceReminders',
      descriptionKey: 'reminders.practiceRemindersDesc',
      icon: <Target className="w-5 h-5" />,
      color: 'text-primary'
    },
    {
      key: 'streakProtection' as const,
      titleKey: 'reminders.streakProtection',
      descriptionKey: 'reminders.streakProtectionDesc',
      icon: <Zap className="w-5 h-5" />,
      color: 'text-warning'
    },
    {
      key: 'achievementNotifications' as const,
      titleKey: 'reminders.achievementNotifications',
      descriptionKey: 'reminders.achievementNotificationsDesc',
      icon: <Award className="w-5 h-5" />,
      color: 'text-success'
    },
    {
      key: 'dailyMotivation' as const,
      titleKey: 'reminders.dailyMotivation',
      descriptionKey: 'reminders.dailyMotivationDesc',
      icon: <Bell className="w-5 h-5" />,
      color: 'text-accent'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Permission status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            {t('reminders.notificationPermission')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!permission.supported ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">{t('reminders.notSupportedBrowser')}</p>
            </div>
          ) : permission.granted ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center text-success">
                <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                {t('reminders.permissionEnabled')}
              </div>
              <Button onClick={showTestNotification} variant="outline" size="sm">
                {t('reminders.testNotification')}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center text-warning">
                <div className="w-2 h-2 bg-warning rounded-full mr-2"></div>
                {t('reminders.needPermission')}
              </div>
              <Button onClick={requestNotificationPermission} className="w-full">
                {t('reminders.enablePermission')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reminder settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t('reminders.reminderSettings')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {reminderTypes.map((type) => (
            <div key={type.key} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={type.color}>{type.icon}</div>
                <div>
                  <h3 className="font-medium">{t(type.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground">{t(type.descriptionKey)}</p>
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

      {/* Reminder time settings */}
      {(settings.practiceReminders || settings.dailyMotivation) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              {t('reminders.reminderTime')}
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
                      className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
              <Button onClick={scheduleReminders} className="w-full" variant="outline">
                {t('reminders.saveReminderTime')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Smart reminder suggestions component
export const SmartReminderSuggestions = () => {
  const { t } = useTranslation('app');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const generateSuggestions = () => {
      const now = new Date();
      const hour = now.getHours();
      const suggestions = [];

      if (hour < 10) {
        suggestions.push(t('reminders.morningSuggestion'));
      }
      
      if (hour > 17) {
        suggestions.push(t('reminders.eveningSuggestion'));
      }

      const practiceHistory = JSON.parse(localStorage.getItem('practice-history') || '[]');
      if (practiceHistory.length > 0) {
        suggestions.push(t('reminders.historySuggestion'));
      }

      setSuggestions(suggestions);
    };

    generateSuggestions();
  }, [t]);

  if (suggestions.length === 0) return null;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-base">{t('reminders.smartSuggestions')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-muted-foreground">{suggestion}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
