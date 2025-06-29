
export interface NotificationConfig {
  enabled: boolean;
  morningReminder: boolean;
  afternoonReminder: boolean;
  eveningReminder: boolean;
  streakReminder: boolean;
  achievementNotifications: boolean;
}

export interface ScheduledNotification {
  id: string;
  type: 'practice' | 'streak' | 'achievement';
  title: string;
  body: string;
  scheduledTime: Date;
  userId: string;
}

export class NotificationService {
  private static readonly DEFAULT_CONFIG: NotificationConfig = {
    enabled: true,
    morningReminder: true,
    afternoonReminder: true,
    eveningReminder: true,
    streakReminder: true,
    achievementNotifications: true
  };

  private static readonly REMINDER_MESSAGES = {
    morning: [
      '🌅 美好的一天开始了！来写下您的晨间愿望吧',
      '☀️ 新的一天，新的开始！让我们一起显化您的梦想',
      '🌸 早安！用积极的肯定句开启美好的一天'
    ],
    afternoon: [
      '🌞 午间时光，让我们继续保持专注和动力',
      '💫 下午好！是时候为您的愿望注入新的能量了',
      '✨ 午间练习时间到！保持您的显化之旅'
    ],
    evening: [
      '🌙 晚上好！让我们带着感恩的心结束今天',
      '⭐ 夜晚时光，回顾今天的收获，展望明天的美好',
      '🌜 晚安前的最后一次练习，为明天种下希望的种子'
    ]
  };

  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  static async getConfig(userId: string): Promise<NotificationConfig> {
    const config = localStorage.getItem(`notification_config_${userId}`);
    return config ? JSON.parse(config) : this.DEFAULT_CONFIG;
  }

  static async updateConfig(userId: string, config: Partial<NotificationConfig>): Promise<void> {
    const currentConfig = await this.getConfig(userId);
    const newConfig = { ...currentConfig, ...config };
    localStorage.setItem(`notification_config_${userId}`, JSON.stringify(newConfig));
  }

  static async scheduleReminders(userId: string): Promise<void> {
    const config = await this.getConfig(userId);
    if (!config.enabled) return;

    const hasPermission = await this.requestPermission();
    if (!hasPermission) return;

    // Clear existing reminders
    this.clearReminders(userId);

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Schedule morning reminder (8:00 AM)
    if (config.morningReminder) {
      const morningTime = new Date(tomorrow);
      morningTime.setHours(8, 0, 0, 0);
      this.scheduleNotification({
        id: `morning_${userId}`,
        type: 'practice',
        title: '晨间显化练习',
        body: this.getRandomMessage('morning'),
        scheduledTime: morningTime,
        userId
      });
    }

    // Schedule afternoon reminder (2:00 PM)
    if (config.afternoonReminder) {
      const afternoonTime = new Date(tomorrow);
      afternoonTime.setHours(14, 0, 0, 0);
      this.scheduleNotification({
        id: `afternoon_${userId}`,
        type: 'practice',
        title: '午间显化练习',
        body: this.getRandomMessage('afternoon'),
        scheduledTime: afternoonTime,
        userId
      });
    }

    // Schedule evening reminder (8:00 PM)
    if (config.eveningReminder) {
      const eveningTime = new Date(tomorrow);
      eveningTime.setHours(20, 0, 0, 0);
      this.scheduleNotification({
        id: `evening_${userId}`,
        type: 'practice',
        title: '晚间显化练习',
        body: this.getRandomMessage('evening'),
        scheduledTime: eveningTime,
        userId
      });
    }
  }

  private static scheduleNotification(notification: ScheduledNotification): void {
    const delay = notification.scheduledTime.getTime() - Date.now();
    if (delay > 0) {
      setTimeout(() => {
        this.showNotification(notification.title, notification.body);
      }, delay);
    }
  }

  private static showNotification(title: string, body: string): void {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'manifestation-reminder',
        renotify: true
      });
    }
  }

  private static getRandomMessage(type: keyof typeof NotificationService.REMINDER_MESSAGES): string {
    const messages = this.REMINDER_MESSAGES[type];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  static clearReminders(userId: string): void {
    // In a real implementation, we'd store timeout IDs and clear them
    // For now, this is a placeholder for the clear functionality
    console.log(`Clearing reminders for user ${userId}`);
  }

  static async sendAchievementNotification(userId: string, title: string, description: string): Promise<void> {
    const config = await this.getConfig(userId);
    if (!config.enabled || !config.achievementNotifications) return;

    const hasPermission = await this.requestPermission();
    if (!hasPermission) return;

    this.showNotification(`🎉 ${title}`, description);
  }

  static async sendStreakNotification(userId: string, streakDays: number): Promise<void> {
    const config = await this.getConfig(userId);
    if (!config.enabled || !config.streakReminder) return;

    const hasPermission = await this.requestPermission();
    if (!hasPermission) return;

    this.showNotification(
      `🔥 ${streakDays}天连击！`,
      `恭喜您已连续练习${streakDays}天！继续保持这个好习惯吧！`
    );
  }
}
