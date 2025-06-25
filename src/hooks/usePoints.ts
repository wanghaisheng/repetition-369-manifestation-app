
import { useState, useEffect } from 'react';
import { PointsService, UserPoints } from '@/services/PointsService';

export const usePoints = (userId: string = 'default') => {
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPoints = async () => {
    try {
      setLoading(true);
      const points = await PointsService.getUserPoints(userId);
      setUserPoints(points);
    } catch (error) {
      console.error('Error loading points:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPoints = async (
    action: 'completeWriting' | 'dailyGoalAchieved' | 'weeklyGoalAchieved' | 'shareSuccess' | 'helpNewbie' | 'createContent',
    multiplier: number = 1,
    customDescription?: string
  ): Promise<number> => {
    try {
      const pointsAdded = await PointsService.addPoints(userId, action, multiplier, customDescription);
      await loadPoints(); // 重新加载最新数据
      return pointsAdded;
    } catch (error) {
      console.error('Error adding points:', error);
      return 0;
    }
  };

  const addStreakBonus = async (streakDays: number): Promise<number> => {
    try {
      const bonusPoints = await PointsService.addStreakBonus(userId, streakDays);
      await loadPoints(); // 重新加载最新数据
      return bonusPoints;
    } catch (error) {
      console.error('Error adding streak bonus:', error);
      return 0;
    }
  };

  const getTodayBreakdown = async () => {
    try {
      return await PointsService.getTodayPointsBreakdown(userId);
    } catch (error) {
      console.error('Error getting today breakdown:', error);
      return { total: 0, breakdown: {}, entries: [] };
    }
  };

  useEffect(() => {
    loadPoints();
  }, [userId]);

  return {
    userPoints,
    loading,
    addPoints,
    addStreakBonus,
    getTodayBreakdown,
    refetch: loadPoints
  };
};
