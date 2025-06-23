
import { Progress, WeeklyStats, MonthlyStats } from '@/types';
import { LocalStorage } from '@/utils/storage';
import { PracticeService } from './PracticeService';

export class ProgressService {
  static async getUserProgress(userId: string): Promise<Progress> {
    const progress = LocalStorage.getProgress();
    
    // 如果没有进度数据，初始化一个
    if (!progress || progress.userId !== userId) {
      const initialProgress: Progress = {
        userId,
        totalSessions: 0,
        consecutiveDays: 0,
        longestStreak: 0,
        totalWishes: 0,
        achievedWishes: 0,
        lastPracticeDate: new Date(),
        weeklyStats: [],
        monthlyStats: []
      };
      LocalStorage.setProgress(initialProgress);
      return initialProgress;
    }
    
    return progress;
  }

  static async updateProgress(userId: string): Promise<void> {
    const practices = await PracticeService.getPracticeHistory(userId);
    const progress = await this.getUserProgress(userId);
    
    // 更新总练习次数
    progress.totalSessions = practices.length;
    
    // 计算连续天数
    progress.consecutiveDays = await this.getConsecutiveDays(userId);
    
    // 更新最长连续记录
    if (progress.consecutiveDays > progress.longestStreak) {
      progress.longestStreak = progress.consecutiveDays;
    }
    
    // 更新最后练习日期
    if (practices.length > 0) {
      progress.lastPracticeDate = new Date(practices[0].date);
    }
    
    LocalStorage.setProgress(progress);
  }

  static async getConsecutiveDays(userId: string): Promise<number> {
    const practices = await PracticeService.getPracticeHistory(userId);
    
    if (practices.length === 0) return 0;
    
    // 按日期分组
    const practicesByDate = new Map<string, any[]>();
    practices.forEach(practice => {
      const dateKey = new Date(practice.date).toDateString();
      if (!practicesByDate.has(dateKey)) {
        practicesByDate.set(dateKey, []);
      }
      practicesByDate.get(dateKey)!.push(practice);
    });
    
    // 计算连续天数
    let consecutiveDays = 0;
    const today = new Date();
    let currentDate = new Date(today);
    
    while (true) {
      const dateKey = currentDate.toDateString();
      if (practicesByDate.has(dateKey)) {
        consecutiveDays++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return consecutiveDays;
  }

  static async getWeeklyStats(userId: string, weeks: number): Promise<WeeklyStats[]> {
    const practices = await PracticeService.getPracticeHistory(userId);
    const weeklyStats: WeeklyStats[] = [];
    
    for (let i = 0; i < weeks; i++) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7));
      weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // 设置为周一
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      
      const weekPractices = practices.filter(practice => {
        const practiceDate = new Date(practice.date);
        return practiceDate >= weekStart && practiceDate <= weekEnd;
      });
      
      const sessionsCompleted = weekPractices.length;
      const targetSessions = 21; // 每周目标21次练习（每天3次）
      const averageMood = weekPractices.length > 0 
        ? weekPractices.reduce((sum, p) => sum + this.getMoodValue(p.mood), 0) / weekPractices.length
        : 0;
      
      weeklyStats.push({
        weekStart,
        sessionsCompleted,
        targetSessions,
        averageMood
      });
    }
    
    return weeklyStats.reverse();
  }

  static async getMonthlyStats(userId: string, months: number): Promise<MonthlyStats[]> {
    const practices = await PracticeService.getPracticeHistory(userId);
    const monthlyStats: MonthlyStats[] = [];
    
    for (let i = 0; i < months; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthPractices = practices.filter(practice => {
        const practiceDate = new Date(practice.date);
        return practiceDate >= monthStart && practiceDate <= monthEnd;
      });
      
      const monthName = date.toLocaleDateString('zh-CN', { month: 'long' });
      
      monthlyStats.push({
        month: monthName,
        practices: monthPractices.length,
        completed: monthPractices.filter(p => p.completedCount >= p.targetCount).length
      });
    }
    
    return monthlyStats.reverse();
  }

  private static getMoodValue(mood?: string): number {
    switch (mood) {
      case 'excellent': return 4;
      case 'good': return 3;
      case 'neutral': return 2;
      case 'poor': return 1;
      default: return 2;
    }
  }
}
