
import { useState, useEffect } from 'react';
import { Progress, WeeklyStats, MonthlyStats } from '@/types';
import { ProgressService } from '@/services/ProgressService';

export const useProgress = (userId: string = 'default') => {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      const progressData = await ProgressService.getUserProgress(userId);
      
      // Ensure dates are properly converted to Date objects
      if (progressData && progressData.lastPracticeDate) {
        progressData.lastPracticeDate = progressData.lastPracticeDate instanceof Date
          ? progressData.lastPracticeDate
          : new Date(progressData.lastPracticeDate);
      }
      
      setProgress(progressData);
    } catch (error) {
      console.error('Error loading progress:', error);
      setError('Failed to load progress data');
      // Set empty progress to prevent infinite loading
      setProgress({
        userId,
        totalSessions: 0,
        consecutiveDays: 0,
        longestStreak: 0,
        totalWishes: 0,
        achievedWishes: 0,
        lastPracticeDate: new Date(),
        weeklyStats: [],
        monthlyStats: []
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async () => {
    try {
      await ProgressService.updateProgress(userId);
      await loadProgress();
    } catch (error) {
      console.error('Error updating progress:', error);
      setError('Failed to update progress');
    }
  };

  const getTodayStats = () => {
    if (!progress) return { consecutiveDays: 0, totalSessions: 0, isToday: false };

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Ensure lastPracticeDate is a Date object
    const lastDate = progress.lastPracticeDate instanceof Date 
      ? progress.lastPracticeDate 
      : new Date(progress.lastPracticeDate);
    
    return {
      consecutiveDays: progress.consecutiveDays,
      totalSessions: progress.totalSessions,
      isToday: lastDate.toISOString().split('T')[0] === todayStr
    };
  };

  const getWeeklyStats = (): WeeklyStats | null => {
    if (!progress || progress.weeklyStats.length === 0) {
      return {
        weekStart: new Date(),
        sessionsCompleted: 0,
        targetSessions: 21,
        averageMood: 0
      };
    }
    return progress.weeklyStats[progress.weeklyStats.length - 1];
  };

  const getMonthlyStats = (): MonthlyStats[] => {
    if (!progress || !progress.monthlyStats) return [];
    return progress.monthlyStats.slice(-6);
  };

  useEffect(() => {
    if (userId) {
      loadProgress();
    } else {
      setLoading(false);
    }
  }, [userId]);

  return {
    progress,
    loading,
    error,
    updateProgress,
    getTodayStats,
    getWeeklyStats,
    getMonthlyStats,
    refetch: loadProgress
  };
};
