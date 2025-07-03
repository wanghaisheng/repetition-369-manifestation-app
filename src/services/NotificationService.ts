
import { PracticeSession } from '@/types';

export interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
  type: string;
}

export interface NotificationConfig {
  enabled: boolean;
  practiceReminders: boolean;
  streakProtection: boolean;
  achievements: boolean;
  dailySummary: boolean;
  reminderTimes: { hour: number; minute: number }[];
}

export class NotificationService {
  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications.');
      return false;
    }

    if (Notification.permission !== 'granted') {
      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error('Error requesting notification permission:', error);
        return false;
      }
    }
    return true;
  }

  static hasPermission(): boolean {
    return 'Notification' in window && Notification.permission === 'granted';
  }

  static async getConfig(userId: string): Promise<NotificationConfig> {
    const stored = localStorage.getItem(`notification_config_${userId}`);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Default config
    const defaultConfig: NotificationConfig = {
      enabled: true,
      practiceReminders: true,
      streakProtection: true,
      achievements: true,
      dailySummary: true,
      reminderTimes: [{ hour: 10, minute: 0 }, { hour: 21, minute: 0 }]
    };
    
    localStorage.setItem(`notification_config_${userId}`, JSON.stringify(defaultConfig));
    return defaultConfig;
  }

  static async updateConfig(userId: string, newConfig: Partial<NotificationConfig>): Promise<void> {
    const currentConfig = await this.getConfig(userId);
    const updatedConfig = { ...currentConfig, ...newConfig };
    localStorage.setItem(`notification_config_${userId}`, JSON.stringify(updatedConfig));
  }

  static async scheduleReminders(userId: string): Promise<void> {
    const config = await this.getConfig(userId);
    if (!config.enabled || !config.practiceReminders) return;

    // Clear existing reminders
    await this.clearAllReminders();

    // Schedule new reminders based on config
    for (const time of config.reminderTimes) {
      await this.scheduleReminder({
        title: '🌟 练习提醒',
        body: '是时候开始您的369显化练习了！',
        time,
        type: 'practice_reminder'
      });
    }
  }

  static async scheduleReminder(reminder: {
    title: string;
    body: string;
    time: { hour: number; minute: number };
    type: string;
  }): Promise<void> {
    const reminderConfig = {
      ...reminder,
      id: Date.now().toString(),
      recurring: 'daily'
    };
    
    localStorage.setItem(
      `reminder_${reminderConfig.id}`,
      JSON.stringify(reminderConfig)
    );
  }

  static async clearAllReminders(): Promise<void> {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('reminder_'));
    keys.forEach(key => localStorage.removeItem(key));
  }

  static async sendAchievementNotification(userId: string, title: string, description: string): Promise<void> {
    if (!this.hasPermission()) return;

    const notification = new Notification(`🏆 ${title}`, {
      body: description,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'achievement',
      requireInteraction: true
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Also store in local notifications
    await this.addNotification({
      title: `🏆 ${title}`,
      body: description,
      type: 'achievement'
    });
  }

  static async sendStreakNotification(userId: string, streakDays: number): Promise<void> {
    if (!this.hasPermission()) return;

    const title = '🔥 连击保持！';
    const body = `您已经连续练习 ${streakDays} 天了！继续保持这个好习惯！`;

    const notification = new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'streak',
      requireInteraction: true
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    await this.addNotification({
      title,
      body,
      type: 'streak_warning'
    });
  }

  static async addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Promise<void> {
    const newNotification: Notification = {
      id: Date.now().toString(),
      title: notification.title,
      body: notification.body,
      timestamp: Date.now(),
      read: false,
      type: notification.type
    };

    let notifications = JSON.parse(localStorage.getItem('notifications') || '[]') as Notification[];
    notifications.unshift(newNotification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }

  static getNotifications(): Notification[] {
    return JSON.parse(localStorage.getItem('notifications') || '[]') as Notification[];
  }

  static markAsRead(notificationId: string): void {
    let notifications = JSON.parse(localStorage.getItem('notifications') || '[]') as Notification[];
    notifications = notifications.map(notification =>
      notification.id === notificationId ? { ...notification, read: true } : notification
    );
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }

  static clearAll(): void {
    localStorage.removeItem('notifications');
  }

  static async setupSmartReminders(userId: string, recommendations: {
    bestTimes: string[];
    riskLevel: 'low' | 'medium' | 'high';
    suggestions: string[];
  }): Promise<void> {
    try {
      await this.clearAllReminders();

      for (const timeSlot of recommendations.bestTimes) {
        const time = this.parseTimeSlot(timeSlot);
        if (time) {
          await this.scheduleReminder({
            title: '🌟 最佳练习时间到了',
            body: `现在是您的黄金练习时间，开始今天的369显化练习吧！`,
            time,
            type: 'practice_reminder'
          });
        }
      }

      if (recommendations.riskLevel === 'high') {
        await this.scheduleStreakProtectionReminders('aggressive');
      } else if (recommendations.riskLevel === 'medium') {
        await this.scheduleStreakProtectionReminders('moderate');
      } else {
        await this.scheduleStreakProtectionReminders('gentle');
      }

      await this.scheduleMotivationalReminders(recommendations.suggestions);
    } catch (error) {
      console.error('Error setting up smart reminders:', error);
      throw error;
    }
  }

  private static parseTimeSlot(timeSlot: string): { hour: number; minute: number } | null {
    const timeMatch = timeSlot.match(/(\d+):(\d+)/);
    if (timeMatch) {
      return {
        hour: parseInt(timeMatch[1]),
        minute: parseInt(timeMatch[2])
      };
    }
    return null;
  }

  private static async scheduleStreakProtectionReminders(intensity: 'gentle' | 'moderate' | 'aggressive'): Promise<void> {
    const reminderTimes = {
      gentle: [{ hour: 20, minute: 0 }],
      moderate: [
        { hour: 12, minute: 0 },
        { hour: 18, minute: 0 }
      ],
      aggressive: [
        { hour: 9, minute: 0 },
        { hour: 14, minute: 0 },
        { hour: 19, minute: 0 }
      ]
    };

    const times = reminderTimes[intensity];
    const messages = {
      gentle: '温馨提醒：别忘了今天的369练习哦 😊',
      moderate: '保持连击：今天还没有完成练习，快来续写你的显化故事！',
      aggressive: '连击警告：距离连击中断还有几小时，现在开始练习还来得及！'
    };

    for (const time of times) {
      await this.scheduleReminder({
        title: '🔥 连击保护提醒',
        body: messages[intensity],
        time,
        type: 'streak_warning'
      });
    }
  }

  private static async scheduleMotivationalReminders(suggestions: string[]): Promise<void> {
    const motivationalTimes = [
      { hour: 8, minute: 30, day: 1 },
      { hour: 15, minute: 0, day: 3 },
      { hour: 19, minute: 30, day: 5 }
    ];

    for (let i = 0; i < motivationalTimes.length && i < suggestions.length; i++) {
      const time = motivationalTimes[i];
      const suggestion = suggestions[i];
      
      await this.scheduleWeeklyReminder({
        title: '💪 个性化建议',
        body: suggestion,
        time,
        type: 'motivation'
      });
    }
  }

  private static async scheduleWeeklyReminder(reminder: {
    title: string;
    body: string;
    time: { hour: number; minute: number; day: number };
    type: string;
  }): Promise<void> {
    const reminderConfig = {
      ...reminder,
      id: Date.now().toString(),
      recurring: 'weekly'
    };
    
    localStorage.setItem(
      `reminder_${reminderConfig.id}`,
      JSON.stringify(reminderConfig)
    );
  }
}
