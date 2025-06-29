import { LocalStorage } from '@/utils/storage';

export interface UserPoints {
  userId: string;
  totalPoints: number;
  todayPoints: number;
  level: number;
  pointsToNextLevel: number;
  pointsHistory: PointsEntry[];
  lastUpdated: Date;
}

export interface PointsEntry {
  id: string;
  action: string;
  points: number;
  description: string;
  timestamp: Date;
  multiplier?: number;
}

export interface PointsAction {
  type: 'completeWriting' | 'dailyGoalAchieved' | 'weeklyGoalAchieved' | 'shareSuccess' | 'helpNewbie' | 'createContent';
  basePoints: number;
  description: string;
}

export class PointsService {
  private static readonly POINTS_ACTIONS: Record<string, PointsAction> = {
    completeWriting: { type: 'completeWriting', basePoints: 10, description: '完成书写练习' },
    dailyGoalAchieved: { type: 'dailyGoalAchieved', basePoints: 50, description: '达成每日目标' },
    weeklyGoalAchieved: { type: 'weeklyGoalAchieved', basePoints: 200, description: '达成每周目标' },
    shareSuccess: { type: 'shareSuccess', basePoints: 25, description: '分享成功故事' },
    helpNewbie: { type: 'helpNewbie', basePoints: 30, description: '帮助新手' },
    createContent: { type: 'createContent', basePoints: 50, description: '创建内容' }
  };

  private static readonly LEVEL_THRESHOLDS = [
    0, 500, 1500, 5000, 15000, 30000, 60000, 100000
  ];

  static async getUserPoints(userId: string): Promise<UserPoints> {
    const userPoints = LocalStorage.getItem<UserPoints>(`points_${userId}`);
    
    if (!userPoints) {
      const initialPoints: UserPoints = {
        userId,
        totalPoints: 0,
        todayPoints: 0,
        level: 1,
        pointsToNextLevel: 500,
        pointsHistory: [],
        lastUpdated: new Date()
      };
      LocalStorage.setItem(`points_${userId}`, initialPoints);
      return initialPoints;
    }
    
    // Reset today points if it's a new day
    const today = new Date().toDateString();
    const lastUpdated = new Date(userPoints.lastUpdated).toDateString();
    if (today !== lastUpdated) {
      userPoints.todayPoints = 0;
      userPoints.lastUpdated = new Date();
    }
    
    return userPoints;
  }

  static async addPoints(
    userId: string, 
    action: keyof typeof PointsService.POINTS_ACTIONS,
    multiplier: number = 1,
    customDescription?: string
  ): Promise<number> {
    const userPoints = await this.getUserPoints(userId);
    const actionConfig = this.POINTS_ACTIONS[action];
    
    if (!actionConfig) {
      throw new Error(`Unknown action: ${action}`);
    }
    
    const pointsToAdd = actionConfig.basePoints * multiplier;
    const entry: PointsEntry = {
      id: Date.now().toString(),
      action: actionConfig.type,
      points: pointsToAdd,
      description: customDescription || actionConfig.description,
      timestamp: new Date(),
      multiplier
    };
    
    userPoints.totalPoints += pointsToAdd;
    userPoints.todayPoints += pointsToAdd;
    userPoints.pointsHistory.unshift(entry);
    userPoints.lastUpdated = new Date();
    
    // Update level
    const newLevel = this.calculateLevel(userPoints.totalPoints);
    if (newLevel > userPoints.level) {
      userPoints.level = newLevel;
      // Add level up bonus
      const levelUpBonus = newLevel * 100;
      userPoints.totalPoints += levelUpBonus;
      userPoints.todayPoints += levelUpBonus;
      
      const levelUpEntry: PointsEntry = {
        id: `${Date.now()}_levelup`,
        action: 'levelUp',
        points: levelUpBonus,
        description: `升级到等级 ${newLevel}`,
        timestamp: new Date()
      };
      userPoints.pointsHistory.unshift(levelUpEntry);
    }
    
    userPoints.pointsToNextLevel = this.getPointsToNextLevel(userPoints.totalPoints, userPoints.level);
    
    // Keep only last 100 entries
    if (userPoints.pointsHistory.length > 100) {
      userPoints.pointsHistory = userPoints.pointsHistory.slice(0, 100);
    }
    
    LocalStorage.setItem(`points_${userId}`, userPoints);
    return pointsToAdd;
  }

  static async addStreakBonus(userId: string, streakDays: number): Promise<number> {
    const bonusMultiplier = Math.floor(streakDays / 7); // Every 7 days
    const bonusPoints = bonusMultiplier * 50;
    
    if (bonusPoints > 0) {
      await this.addPoints(userId, 'completeWriting', bonusPoints / 10, `${streakDays}天连击奖励`);
      return bonusPoints;
    }
    
    return 0;
  }

  static async getTodayPointsBreakdown(userId: string) {
    const userPoints = await this.getUserPoints(userId);
    const today = new Date().toDateString();
    
    const todayEntries = userPoints.pointsHistory.filter(entry => 
      new Date(entry.timestamp).toDateString() === today
    );
    
    const breakdown: Record<string, number> = {};
    let total = 0;
    
    todayEntries.forEach(entry => {
      breakdown[entry.action] = (breakdown[entry.action] || 0) + entry.points;
      total += entry.points;
    });
    
    return {
      total,
      breakdown,
      entries: todayEntries
    };
  }

  private static calculateLevel(totalPoints: number): number {
    for (let i = this.LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (totalPoints >= this.LEVEL_THRESHOLDS[i]) {
        return i + 1;
      }
    }
    return 1;
  }

  private static getPointsToNextLevel(totalPoints: number, currentLevel: number): number {
    if (currentLevel >= this.LEVEL_THRESHOLDS.length) {
      return 0; // Max level reached
    }
    
    const nextLevelThreshold = this.LEVEL_THRESHOLDS[currentLevel];
    return nextLevelThreshold - totalPoints;
  }

  static getLevelName(level: number): string {
    const levelNames = [
      '', '显化新手', '愿望探索者', '显化实践者', '愿望大师', 
      '显化导师', '显化宗师', '显化传奇', '显化至尊'
    ];
    return levelNames[level] || '显化至尊';
  }

  static getLevelColor(level: number): string {
    if (level >= 7) return 'text-manifest-gold';
    if (level >= 5) return 'text-manifest-lavender';
    if (level >= 3) return 'text-ios-blue';
    return 'text-ios-green';
  }
}
