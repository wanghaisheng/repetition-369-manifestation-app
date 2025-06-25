
import { LocalStorage } from '@/utils/storage';

export interface UserPoints {
  userId: string;
  totalPoints: number;
  todayPoints: number;
  lastUpdated: Date;
  pointsHistory: PointsEntry[];
}

export interface PointsEntry {
  id: string;
  action: string;
  points: number;
  timestamp: Date;
  description: string;
}

export class PointsService {
  private static readonly POINTS_CONFIG = {
    completeWriting: 10,
    dailyGoalAchieved: 50,
    weeklyGoalAchieved: 200,
    streakBonus: {
      3: 20,
      7: 100,
      21: 500,
      30: 1000
    },
    shareSuccess: 25,
    helpNewbie: 30,
    createContent: 50
  };

  static async getUserPoints(userId: string): Promise<UserPoints> {
    const points = LocalStorage.getUserPoints(userId);
    
    if (!points) {
      const initialPoints: UserPoints = {
        userId,
        totalPoints: 0,
        todayPoints: 0,
        lastUpdated: new Date(),
        pointsHistory: []
      };
      LocalStorage.setUserPoints(userId, initialPoints);
      return initialPoints;
    }
    
    // 检查是否是新的一天，重置今日点数
    const today = new Date().toDateString();
    const lastUpdated = new Date(points.lastUpdated).toDateString();
    
    if (today !== lastUpdated) {
      points.todayPoints = 0;
      points.lastUpdated = new Date();
      LocalStorage.setUserPoints(userId, points);
    }
    
    return points;
  }

  static async addPoints(
    userId: string, 
    action: keyof typeof PointsService.POINTS_CONFIG, 
    multiplier: number = 1,
    customDescription?: string
  ): Promise<number> {
    const userPoints = await this.getUserPoints(userId);
    const basePoints = this.POINTS_CONFIG[action] as number;
    const pointsToAdd = Math.round(basePoints * multiplier);
    
    const pointsEntry: PointsEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      action,
      points: pointsToAdd,
      timestamp: new Date(),
      description: customDescription || this.getActionDescription(action)
    };
    
    userPoints.totalPoints += pointsToAdd;
    userPoints.todayPoints += pointsToAdd;
    userPoints.lastUpdated = new Date();
    userPoints.pointsHistory.unshift(pointsEntry);
    
    // 只保留最近100条记录
    if (userPoints.pointsHistory.length > 100) {
      userPoints.pointsHistory = userPoints.pointsHistory.slice(0, 100);
    }
    
    LocalStorage.setUserPoints(userId, userPoints);
    
    console.log(`Added ${pointsToAdd} points for ${action}. Total: ${userPoints.totalPoints}`);
    
    return pointsToAdd;
  }

  static async addStreakBonus(userId: string, streakDays: number): Promise<number> {
    const bonusPoints = this.POINTS_CONFIG.streakBonus[streakDays as keyof typeof this.POINTS_CONFIG.streakBonus];
    
    if (!bonusPoints) return 0;
    
    const userPoints = await this.getUserPoints(userId);
    
    const pointsEntry: PointsEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      action: 'streakBonus',
      points: bonusPoints,
      timestamp: new Date(),
      description: `连续练习 ${streakDays} 天奖励`
    };
    
    userPoints.totalPoints += bonusPoints;
    userPoints.todayPoints += bonusPoints;
    userPoints.lastUpdated = new Date();
    userPoints.pointsHistory.unshift(pointsEntry);
    
    LocalStorage.setUserPoints(userId, userPoints);
    
    console.log(`Added ${bonusPoints} streak bonus for ${streakDays} days. Total: ${userPoints.totalPoints}`);
    
    return bonusPoints;
  }

  static async getTodayPointsBreakdown(userId: string) {
    const userPoints = await this.getUserPoints(userId);
    const today = new Date().toDateString();
    
    const todayEntries = userPoints.pointsHistory.filter(entry => 
      new Date(entry.timestamp).toDateString() === today
    );
    
    const breakdown = todayEntries.reduce((acc, entry) => {
      acc[entry.action] = (acc[entry.action] || 0) + entry.points;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total: userPoints.todayPoints,
      breakdown,
      entries: todayEntries
    };
  }

  private static getActionDescription(action: string): string {
    const descriptions = {
      completeWriting: '完成书写练习',
      dailyGoalAchieved: '达成日目标',
      weeklyGoalAchieved: '达成周目标',
      shareSuccess: '分享成功故事',
      helpNewbie: '帮助新手',
      createContent: '创建内容'
    };
    
    return descriptions[action as keyof typeof descriptions] || action;
  }
}
