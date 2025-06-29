import { LocalStorage } from '@/utils/storage';
import { PracticeService } from './PracticeService';

export interface UserStreak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: Date;
  streakHistory: StreakEntry[];
  milestones: StreakMilestone[];
}

export interface StreakEntry {
  date: Date;
  practiceCount: number;
  completed: boolean;
}

export interface StreakMilestone {
  days: number;
  achieved: boolean;
  achievedDate?: Date;
  reward: {
    points: number;
    title: string;
  };
}

export class StreakService {
  private static readonly STREAK_MILESTONES: Omit<StreakMilestone, 'achieved' | 'achievedDate'>[] = [
    { days: 3, reward: { points: 50, title: '习惯萌芽' } },
    { days: 7, reward: { points: 150, title: '一周达人' } },
    { days: 21, reward: { points: 500, title: '三周大师' } },
    { days: 30, reward: { points: 1000, title: '月度传奇' } },
    { days: 60, reward: { points: 2500, title: '双月英雄' } },
    { days: 100, reward: { points: 5000, title: '百日显化' } }
  ];

  static async getUserStreak(userId: string): Promise<UserStreak> {
    const userStreak = LocalStorage.getItem<UserStreak>(`streak_${userId}`);
    
    if (!userStreak) {
      const initialStreak: UserStreak = {
        userId,
        currentStreak: 0,
        longestStreak: 0,
        lastPracticeDate: new Date(),
        streakHistory: [],
        milestones: this.STREAK_MILESTONES.map(m => ({
          ...m,
          achieved: false
        }))
      };
      LocalStorage.setItem(`streak_${userId}`, initialStreak);
      return initialStreak;
    }
    
    return userStreak;
  }

  static async updateStreak(userId: string): Promise<{ streakUpdated: boolean; newMilestones: StreakMilestone[] }> {
    const userStreak = await this.getUserStreak(userId);
    const practices = await PracticeService.getTodayPractices(userId);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastPracticeDate = new Date(userStreak.lastPracticeDate);
    lastPracticeDate.setHours(0, 0, 0, 0);
    
    // Check if user practiced today
    const todayPracticeCount = practices.reduce((sum, p) => sum + p.completedCount, 0);
    const todayCompleted = todayPracticeCount >= 18; // 3+6+9=18
    
    let streakUpdated = false;
    let newMilestones: StreakMilestone[] = [];
    
    if (todayCompleted) {
      // User practiced today
      if (lastPracticeDate.getTime() === yesterday.getTime()) {
        // Continuing streak
        userStreak.currentStreak += 1;
        streakUpdated = true;
      } else if (lastPracticeDate.getTime() < yesterday.getTime()) {
        // Starting new streak
        userStreak.currentStreak = 1;
        streakUpdated = true;
      }
      // If lastPracticeDate is today, streak already counted
      
      userStreak.lastPracticeDate = today;
      
      // Update longest streak
      if (userStreak.currentStreak > userStreak.longestStreak) {
        userStreak.longestStreak = userStreak.currentStreak;
      }
      
      // Check for new milestones
      newMilestones = await this.checkMilestones(userStreak);
      
    } else {
      // User didn't practice today
      if (lastPracticeDate.getTime() < yesterday.getTime()) {
        // Streak broken
        userStreak.currentStreak = 0;
        streakUpdated = true;
      }
    }
    
    // Add to history
    const todayEntry: StreakEntry = {
      date: today,
      practiceCount: todayPracticeCount,
      completed: todayCompleted
    };
    
    // Update or add today's entry
    const existingIndex = userStreak.streakHistory.findIndex(entry => 
      new Date(entry.date).toDateString() === today.toDateString()
    );
    
    if (existingIndex >= 0) {
      userStreak.streakHistory[existingIndex] = todayEntry;
    } else {
      userStreak.streakHistory.unshift(todayEntry);
    }
    
    // Keep only last 100 days
    if (userStreak.streakHistory.length > 100) {
      userStreak.streakHistory = userStreak.streakHistory.slice(0, 100);
    }
    
    LocalStorage.setItem(`streak_${userId}`, userStreak);
    
    return { streakUpdated, newMilestones };
  }

  private static async checkMilestones(userStreak: UserStreak): Promise<StreakMilestone[]> {
    const newMilestones: StreakMilestone[] = [];
    
    for (const milestone of userStreak.milestones) {
      if (!milestone.achieved && userStreak.currentStreak >= milestone.days) {
        milestone.achieved = true;
        milestone.achievedDate = new Date();
        newMilestones.push(milestone);
      }
    }
    
    return newMilestones;
  }

  static getStreakLevel(days: number): { level: string; color: string; bgColor: string } {
    if (days >= 100) return { level: 'legendary', color: 'text-manifest-gold', bgColor: 'from-manifest-gold to-yellow-500' };
    if (days >= 30) return { level: 'epic', color: 'text-manifest-lavender', bgColor: 'from-manifest-lavender to-purple-500' };
    if (days >= 21) return { level: 'rare', color: 'text-ios-blue', bgColor: 'from-ios-blue to-blue-600' };
    if (days >= 7) return { level: 'good', color: 'text-ios-green', bgColor: 'from-ios-green to-green-500' };
    if (days >= 3) return { level: 'starting', color: 'text-ios-orange', bgColor: 'from-ios-orange to-orange-500' };
    return { level: 'beginner', color: 'text-gray-600', bgColor: 'from-gray-400 to-gray-500' };
  }

  static getNextMilestone(currentStreak: number): StreakMilestone | null {
    return this.STREAK_MILESTONES.find(m => m.days > currentStreak) || null;
  }
}
