import { PracticeSession } from '@/types';

export interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
  type: string;
}

export class NotificationService {
  static async requestPermission(): Promise<void> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications.');
      return;
    }

    if (Notification.permission !== 'granted') {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    }
  }

  static hasPermission(): boolean {
    return 'Notification' in window && Notification.permission === 'granted';
  }

  static async schedulePracticeReminders(): Promise<void> {
    // Clear existing reminders
    await this.clearAllReminders();

    // Get optimal reminder time
    const optimalTime = await this.getOptimalReminderTime('default'); // Replace 'default' with actual userId

    // Schedule morning reminder
    await this.scheduleReminder({
      title: '☀️ 早安，369显化练习时间到啦！',
      body: '新的一天，从积极的显化练习开始，让梦想照进现实！',
      time: optimalTime,
      type: 'practice_reminder'
    });

    // Schedule evening reminder
    await this.scheduleReminder({
      title: '🌙 晚上好，别忘了今天的369练习哦！',
      body: '在睡前完成练习，让愿望在潜意识中生根发芽，加速实现！',
      time: { hour: 21, minute: 0 },
      type: 'practice_reminder'
    });
  }

  static async scheduleReminder(reminder: {
    title: string;
    body: string;
    time: { hour: number; minute: number };
    type: string;
  }): Promise<void> {
    // This would typically integrate with a more sophisticated scheduling system
    // For now, we'll store the reminder configuration
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
    // Clear all stored reminders
    const keys = Object.keys(localStorage).filter(key => key.startsWith('reminder_'));
    keys.forEach(key => localStorage.removeItem(key));
  }

  static async getOptimalReminderTime(userId: string): Promise<{ hour: number; minute: number }> {
    try {
      // const analytics = await AnalyticsService.getAnalytics(userId, 30);
      // const { morning, afternoon, evening } = analytics.timePatterns;
      
      // Find the time slot with highest activity
      // if (morning >= afternoon && morning >= evening) {
      //   return { hour: 9, minute: 0 }; // 9 AM
      // } else if (afternoon >= evening) {
      //   return { hour: 14, minute: 0 }; // 2 PM
      // } else {
      //   return { hour: 19, minute: 0 }; // 7 PM
      // }
      return { hour: 10, minute: 0 }; // Default to 10 AM
    } catch (error) {
      console.error('Error getting optimal reminder time:', error);
      return { hour: 10, minute: 0 }; // Default to 10 AM
    }
  }

  static async sendAchievementNotification(achievement: {
    title: string;
    description: string;
    points: number;
  }): Promise<void> {
    if (!this.hasPermission()) return;

    const notification = new Notification(`🏆 ${achievement.title}`, {
      body: `${achievement.description}\n获得 ${achievement.points} 点数！`,
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
      title: `🏆 ${achievement.title}`,
      body: `${achievement.description}\n获得 ${achievement.points} 点数！`,
      type: 'achievement'
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
    notifications.unshift(newNotification); // Add to the beginning
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
      // Clear existing reminders
      await this.clearAllReminders();

      // Set up practice reminders based on best times
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

      // Set up streak protection based on risk level
      if (recommendations.riskLevel === 'high') {
        // More frequent reminders for high risk
        await this.scheduleStreakProtectionReminders('aggressive');
      } else if (recommendations.riskLevel === 'medium') {
        await this.scheduleStreakProtectionReminders('moderate');
      } else {
        await this.scheduleStreakProtectionReminders('gentle');
      }

      // Schedule motivational notifications
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
      gentle: [{ hour: 20, minute: 0 }], // 只在晚上8点提醒
      moderate: [
        { hour: 12, minute: 0 }, // 中午12点
        { hour: 18, minute: 0 }  // 晚上6点
      ],
      aggressive: [
        { hour: 9, minute: 0 },  // 早上9点
        { hour: 14, minute: 0 }, // 下午2点
        { hour: 19, minute: 0 }  // 晚上7点
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
    // Schedule weekly motivational messages based on suggestions
    const motivationalTimes = [
      { hour: 8, minute: 30, day: 1 }, // Monday morning
      { hour: 15, minute: 0, day: 3 }, // Wednesday afternoon
      { hour: 19, minute: 30, day: 5 }  // Friday evening
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
    // This would typically integrate with a more sophisticated scheduling system
    // For now, we'll store the reminder configuration
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

  private static async clearAllReminders(): Promise<void> {
    // Clear all stored reminders
    const keys = Object.keys(localStorage).filter(key => key.startsWith('reminder_'));
    keys.forEach(key => localStorage.removeItem(key));
  }

  static async getOptimalReminderTime(userId: string): Promise<{ hour: number; minute: number }> {
    try {
      // const analytics = await AnalyticsService.getAnalytics(userId, 30);
      // const { morning, afternoon, evening } = analytics.timePatterns;
      
      // Find the time slot with highest activity
      // if (morning >= afternoon && morning >= evening) {
      //   return { hour: 9, minute: 0 }; // 9 AM
      // } else if (afternoon >= evening) {
      //   return { hour: 14, minute: 0 }; // 2 PM
      // } else {
      //   return { hour: 19, minute: 0 }; // 7 PM
      // }
      return { hour: 10, minute: 0 }; // Default to 10 AM
    } catch (error) {
      console.error('Error getting optimal reminder time:', error);
      return { hour: 10, minute: 0 }; // Default to 10 AM
    }
  }

  static async sendAchievementNotification(achievement: {
    title: string;
    description: string;
    points: number;
  }): Promise<void> {
    if (!this.hasPermission()) return;

    const notification = new Notification(`🏆 ${achievement.title}`, {
      body: `${achievement.description}\n获得 ${achievement.points} 点数！`,
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
      title: `🏆 ${achievement.title}`,
      body: `${achievement.description}\n获得 ${achievement.points} 点数！`,
      type: 'achievement'
    });
  }
}
