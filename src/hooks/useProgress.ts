
import { useState, useEffect } from 'react';
import { Progress, WeeklyStats, MonthlyStats } from '@/types';
import { ProgressService } from '@/services/ProgressService';

export const useProgress = (userId: string = 'default') => {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProgress = async () => {
    try {
      setLoading(true);
      const progressData = await ProgressService.getUserProgress(userId);
      setProgress(progressData);
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async () => {
    try {
      await ProgressService.updateProgress(userId);
      await loadProgress(); // 重新加载最新数据
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const getTodayStats = () => {
    if (!progress) return null;

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    return {
      consecutiveDays: progress.consecutiveDays,
      totalSessions: progress.totalSessions,
      isToday: progress.lastPracticeDate.toISOString().split('T')[0] === todayStr
    };
  };

  const getWeeklyStats = (): WeeklyStats | null => {
    if (!progress || progress.weeklyStats.length === 0) return null;
    return progress.weeklyStats[progress.weeklyStats.length - 1];
  };

  const getMonthlyStats = (): MonthlyStats[] => {
    if (!progress) return [];
    return progress.monthlyStats.slice(-6); // 最近6个月
  };

  useEffect(() => {
    loadProgress();
  }, [userId]);

  return {
    progress,
    loading,
    updateProgress,
    getTodayStats,
    getWeeklyStats,
    getMonthlyStats,
    refetch: loadProgress
  };
};
