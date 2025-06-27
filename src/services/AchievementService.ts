
import { LocalStorage } from '@/utils/storage';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'practice' | 'social' | 'milestone' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  unlockCondition: AchievementCondition;
  reward: {
    points: number;
    unlocks?: string[];
    badge?: string;
  };
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface AchievementCondition {
  type: 'wishCreated' | 'streak' | 'totalPractices' | 'dailyGoal' | 'weeklyGoal' | 'monthlyGoal' | 'perfectWeek';
  count: number;
  timeframe?: 'daily' | 'weekly' | 'monthly';
}

export interface UserAchievements {
  userId: string;
  achievements: Achievement[];
  lastChecked: Date;
}

export class AchievementService {
  private static readonly ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
    {
      id: "first-wish",
      name: "第一个愿望",
      description: "创建你的第一个显化愿望",
      category: "milestone",
      rarity: "common",
      icon: "🌟",
      unlockCondition: { type: "wishCreated", count: 1 },
      reward: { points: 50 }
    },
    {
      id: "first-practice",
      name: "初次体验",
      description: "完成第一次369练习",
      category: "practice",
      rarity: "common",
      icon: "✨",
      unlockCondition: { type: "totalPractices", count: 1 },
      reward: { points: 30 }
    },
    {
      id: "week-warrior",
      name: "一周勇士",
      description: "连续练习7天",
      category: "practice",
      rarity: "rare",
      icon: "🔥",
      unlockCondition: { type: "streak", count: 7 },
      reward: { points: 200, unlocks: ["高级统计"] }
    },
    {
      id: "practice-master",
      name: "练习大师",
      description: "累计完成100次练习",
      category: "practice",
      rarity: "epic",
      icon: "🏆",
      unlockCondition: { type: "totalPractices", count: 100 },
      reward: { points: 500 }
    },
    {
      id: "daily-champion",
      name: "每日冠军",
      description: "连续7天完成每日目标",
      category: "practice",
      rarity: "rare",
      icon: "👑",
      unlockCondition: { type: "dailyGoal", count: 7 },
      reward: { points: 300 }
    },
    {
      id: "dedication-legend",
      name: "坚持传奇",
      description: "连续练习30天",
      category: "practice",
      rarity: "legendary",
      icon: "💎",
      unlockCondition: { type: "streak", count: 30 },
      reward: { points: 1000, unlocks: ["专属称号"] }
    },
    {
      id: "perfect-week",
      name: "完美一周",
      description: "一周内每天都完成所有练习",
      category: "practice",
      rarity: "epic",
      icon: "⭐",
      unlockCondition: { type: "perfectWeek", count: 1 },
      reward: { points: 400 }
    }
  ];

  static async getUserAchievements(userId: string): Promise<UserAchievements> {
    const achievements = LocalStorage.getItem<UserAchievements>(`achievements_${userId}`);
    
    if (!achievements) {
      const initialAchievements: UserAchievements = {
        userId,
        achievements: this.ACHIEVEMENTS.map(achievement => ({
          ...achievement,
          unlocked: false
        })),
        lastChecked: new Date()
      };
      LocalStorage.setItem(`achievements_${userId}`, initialAchievements);
      return initialAchievements;
    }
    
    return achievements;
  }

  static async checkAndUnlockAchievements(userId: string): Promise<Achievement[]> {
    const userAchievements = await this.getUserAchievements(userId);
    const newlyUnlocked: Achievement[] = [];
    
    // 获取用户数据
    const wishes = LocalStorage.getWishes().filter(w => w.userId === userId);
    const practices = LocalStorage.getPracticeSessions().filter(p => p.userId === userId);
    const progress = LocalStorage.getProgress();
    
    // 检查每个未解锁的成就
    for (const achievement of userAchievements.achievements) {
      if (!achievement.unlocked && this.checkCondition(achievement.unlockCondition, { wishes, practices, progress })) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date();
        newlyUnlocked.push(achievement);
        
        console.log(`Achievement unlocked: ${achievement.name}`);
      }
    }
    
    if (newlyUnlocked.length > 0) {
      userAchievements.lastChecked = new Date();
      LocalStorage.setItem(`achievements_${userId}`, userAchievements);
    }
    
    return newlyUnlocked;
  }

  private static checkCondition(
    condition: AchievementCondition, 
    data: { wishes: any[], practices: any[], progress: any }
  ): boolean {
    const { wishes, practices, progress } = data;
    
    switch (condition.type) {
      case 'wishCreated':
        return wishes.length >= condition.count;
        
      case 'totalPractices':
        return practices.length >= condition.count;
        
      case 'streak':
        return progress.consecutiveDays >= condition.count;
        
      case 'dailyGoal':
        // 检查连续完成每日目标的天数
        return this.checkConsecutiveDailyGoals(practices, condition.count);
        
      case 'perfectWeek':
        return this.checkPerfectWeek(practices);
        
      default:
        return false;
    }
  }

  private static checkConsecutiveDailyGoals(practices: any[], targetDays: number): boolean {
    // 简化实现：检查最近的练习记录
    const recentDays = this.getRecentDays(practices, targetDays);
    return recentDays.length >= targetDays && recentDays.every(day => day.completed);
  }

  private static checkPerfectWeek(practices: any[]): boolean {
    // 检查最近7天是否每天都完成了所有练习（3+6+9=18次）
    const last7Days = this.getRecentDays(practices, 7);
    return last7Days.length === 7 && last7Days.every(day => day.totalCount >= 18);
  }

  private static getRecentDays(practices: any[], days: number) {
    const today = new Date();
    const recentDays = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayPractices = practices.filter(p => 
        new Date(p.date).toISOString().split('T')[0] === dateStr
      );
      
      const totalCount = dayPractices.reduce((sum, p) => sum + p.completedCount, 0);
      const completed = totalCount >= 18; // 3+6+9
      
      recentDays.push({ date: dateStr, totalCount, completed });
    }
    
    return recentDays.reverse();
  }

  static async getUnlockedAchievements(userId: string): Promise<Achievement[]> {
    const userAchievements = await this.getUserAchievements(userId);
    return userAchievements.achievements.filter(a => a.unlocked);
  }

  static async getAchievementsByCategory(userId: string, category: Achievement['category']): Promise<Achievement[]> {
    const userAchievements = await this.getUserAchievements(userId);
    return userAchievements.achievements.filter(a => a.category === category);
  }

  static getRarityColor(rarity: Achievement['rarity']): string {
    switch (rarity) {
      case 'common': return 'text-gray-600 border-gray-300';
      case 'rare': return 'text-ios-blue border-ios-blue';
      case 'epic': return 'text-manifest-lavender border-manifest-lavender';
      case 'legendary': return 'text-manifest-gold border-manifest-gold';
      default: return 'text-gray-600 border-gray-300';
    }
  }
}
