
export class LocalStorage {
  private static getItemInternal<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting item from localStorage: ${key}`, error);
      return null;
    }
  }

  private static setItemInternal<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item to localStorage: ${key}`, error);
    }
  }

  private static removeItemInternal(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from localStorage: ${key}`, error);
    }
  }

  // 公共通用方法
  static getItem<T>(key: string): T | null {
    return this.getItemInternal<T>(key);
  }

  static setItem<T>(key: string, value: T): void {
    this.setItemInternal(key, value);
  }

  static removeItem(key: string): void {
    this.removeItemInternal(key);
  }

  // 愿望相关
  static getWishes(): any[] {
    return this.getItemInternal('wishes') || [];
  }

  static setWishes(wishes: any[]): void {
    this.setItemInternal('wishes', wishes);
  }

  // 练习记录相关
  static getPracticeSessions(): any[] {
    return this.getItemInternal('practiceSessions') || [];
  }

  static setPracticeSessions(sessions: any[]): void {
    this.setItemInternal('practiceSessions', sessions);
  }

  // 用户偏好相关
  static getUserPreferences(): any {
    return this.getItemInternal('userPreferences') || {
      theme: 'light',
      notifications: {
        enabled: true,
        morningReminder: true,
        afternoonReminder: true,
        eveningReminder: true
      },
      reminderTimes: [],
      defaultCategory: 'personal'
    };
  }

  static setUserPreferences(preferences: any): void {
    this.setItemInternal('userPreferences', preferences);
  }

  // 进度统计相关
  static getProgress(): any {
    return this.getItemInternal('progress') || {
      userId: 'default',
      totalSessions: 0,
      consecutiveDays: 0,
      longestStreak: 0,
      totalWishes: 0,
      achievedWishes: 0,
      lastPracticeDate: new Date(),
      weeklyStats: [],
      monthlyStats: []
    };
  }

  static setProgress(progress: any): void {
    this.setItemInternal('progress', progress);
  }

  static getUserPoints(userId: string) {
    try {
      const data = localStorage.getItem(`points_${userId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading user points from localStorage:', error);
      return null;
    }
  }

  static setUserPoints(userId: string, points: any) {
    try {
      localStorage.setItem(`points_${userId}`, JSON.stringify(points));
    } catch (error) {
      console.error('Error saving user points to localStorage:', error);
    }
  }

  static clearUserPoints(userId: string) {
    try {
      localStorage.removeItem(`points_${userId}`);
    } catch (error) {
      console.error('Error clearing user points from localStorage:', error);
    }
  }
}
