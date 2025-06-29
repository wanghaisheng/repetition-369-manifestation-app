
import { useState, useEffect } from 'react';
import { NotificationService, NotificationConfig } from '@/services/NotificationService';

export const useNotifications = (userId: string = 'default') => {
  const [config, setConfig] = useState<NotificationConfig | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const notificationConfig = await NotificationService.getConfig(userId);
      setConfig(notificationConfig);
      
      // Check permission status
      const permission = await NotificationService.requestPermission();
      setHasPermission(permission);
    } catch (error) {
      console.error('Error loading notification config:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (newConfig: Partial<NotificationConfig>) => {
    try {
      await NotificationService.updateConfig(userId, newConfig);
      await loadConfig(); // Reload config
      
      // Reschedule reminders if enabled
      if (newConfig.enabled !== false) {
        await NotificationService.scheduleReminders(userId);
      }
    } catch (error) {
      console.error('Error updating notification config:', error);
    }
  };

  const requestPermission = async () => {
    try {
      const granted = await NotificationService.requestPermission();
      setHasPermission(granted);
      return granted;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const scheduleReminders = async () => {
    try {
      await NotificationService.scheduleReminders(userId);
    } catch (error) {
      console.error('Error scheduling reminders:', error);
    }
  };

  const sendAchievementNotification = async (title: string, description: string) => {
    try {
      await NotificationService.sendAchievementNotification(userId, title, description);
    } catch (error) {
      console.error('Error sending achievement notification:', error);
    }
  };

  const sendStreakNotification = async (streakDays: number) => {
    try {
      await NotificationService.sendStreakNotification(userId, streakDays);
    } catch (error) {
      console.error('Error sending streak notification:', error);
    }
  };

  useEffect(() => {
    loadConfig();
  }, [userId]);

  return {
    config,
    hasPermission,
    loading,
    updateConfig,
    requestPermission,
    scheduleReminders,
    sendAchievementNotification,
    sendStreakNotification,
    refetch: loadConfig
  };
};
