
import { useState, useEffect } from 'react';
import { NotificationService, NotificationConfig, Notification } from '@/services/NotificationService';

export const useNotifications = (userId: string = 'default') => {
  const [config, setConfig] = useState<NotificationConfig | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
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
      
      // Load notifications
      const localNotifications = NotificationService.getNotifications();
      setNotifications(localNotifications);
    } catch (error) {
      console.error('Error loading notification config:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (newConfig: Partial<NotificationConfig>) => {
    try {
      await NotificationService.updateConfig(userId, newConfig);
      await loadConfig();
      
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
      // Reload notifications to show the new one
      const localNotifications = NotificationService.getNotifications();
      setNotifications(localNotifications);
    } catch (error) {
      console.error('Error sending achievement notification:', error);
    }
  };

  const sendStreakNotification = async (streakDays: number) => {
    try {
      await NotificationService.sendStreakNotification(userId, streakDays);
      // Reload notifications to show the new one
      const localNotifications = NotificationService.getNotifications();
      setNotifications(localNotifications);
    } catch (error) {
      console.error('Error sending streak notification:', error);
    }
  };

  const markAsRead = (notificationId: string) => {
    NotificationService.markAsRead(notificationId);
    // Update local state
    setNotifications(prev => 
      prev.map(notification =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      )
    );
  };

  const clearAll = () => {
    NotificationService.clearAll();
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    loadConfig();
  }, [userId]);

  return {
    config,
    notifications,
    unreadCount,
    hasPermission,
    loading,
    updateConfig,
    requestPermission,
    scheduleReminders,
    sendAchievementNotification,
    sendStreakNotification,
    markAsRead,
    clearAll,
    refetch: loadConfig
  };
};
