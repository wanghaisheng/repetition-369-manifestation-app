
export class LocalStorage {
  private static getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting item from localStorage: ${key}`, error);
      return null;
    }
  }

  private static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item to localStorage: ${key}`, error);
    }
  }

  private static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from localStorage: ${key}`, error);
    }
  }

  // 愿望相关
  static getWishes(): any[] {
    return this.getItem('wishes') || [];
  }

  static setWishes(wishes: any[]): void {
    this.setItem('wishes', wishes);
  }

  // 练习记录相关
  static getPracticeSessions(): any[] {
    return this.getItem('practiceSessions') || [];
  }

  static setPracticeSessions(sessions: any[]): void {
    this.setItem('practiceSessions', sessions);
  }

  // 用户偏好相关
  static getUserPreferences(): any {
    return this.getItem('userPreferences') || {
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
    this.setItem('userPreferences', preferences);
  }

  // 进度统计相关
  static getProgress(): any {
    return this.getItem('progress') || {
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
    this.setItem('progress', progress);
  }
}
