
import { useState, useEffect } from 'react';
import { PracticeSession } from '@/types';
import { PracticeService } from '@/services/PracticeService';

export const usePractice = (userId: string = 'default') => {
  const [todayPractices, setTodayPractices] = useState<PracticeSession[]>([]);
  const [practiceHistory, setPracticeHistory] = useState<PracticeSession[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTodayPractices = async () => {
    try {
      const practices = await PracticeService.getTodayPractices(userId);
      setTodayPractices(practices);
    } catch (error) {
      console.error('Error loading today practices:', error);
    }
  };

  const loadPracticeHistory = async (limit?: number) => {
    try {
      setLoading(true);
      const history = await PracticeService.getPracticeHistory(userId, limit);
      setPracticeHistory(history);
    } catch (error) {
      console.error('Error loading practice history:', error);
    } finally {
      setLoading(false);
    }
  };

  const recordPractice = async (sessionData: Omit<PracticeSession, 'id'>) => {
    try {
      const newSession = await PracticeService.recordPractice({
        ...sessionData,
        userId
      });
      setTodayPractices(prev => [...prev, newSession]);
      setPracticeHistory(prev => [newSession, ...prev]);
      return newSession;
    } catch (error) {
      console.error('Error recording practice:', error);
      throw error;
    }
  };

  const checkTodayCompleted = async (wishId: string) => {
    return await PracticeService.isTodayCompleted(userId, wishId);
  };

  useEffect(() => {
    loadTodayPractices();
    loadPracticeHistory(50); // 加载最近50条记录
  }, [userId]);

  return {
    todayPractices,
    practiceHistory,
    loading,
    recordPractice,
    checkTodayCompleted,
    refetch: () => {
      loadTodayPractices();
      loadPracticeHistory(50);
    }
  };
};
