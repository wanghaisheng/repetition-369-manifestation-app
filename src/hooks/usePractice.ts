
import { useState, useEffect } from 'react';
import { PracticeSession } from '@/types';
import { PracticeService } from '@/services/PracticeService';
import { useAuth } from '@/contexts/AuthContext';

export const usePractice = () => {
  const [todayPractices, setTodayPractices] = useState<PracticeSession[]>([]);
  const [practiceHistory, setPracticeHistory] = useState<PracticeSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  const loadTodayPractices = async () => {
    if (!isAuthenticated || !user) {
      setTodayPractices([]);
      return;
    }

    try {
      const practices = await PracticeService.getTodayPractices(user.id);
      setTodayPractices(practices || []);
    } catch (error) {
      console.error('Error loading today practices:', error);
      setTodayPractices([]);
    }
  };

  const loadPracticeHistory = async (limit?: number) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!isAuthenticated || !user) {
        setPracticeHistory([]);
        return;
      }

      const history = await PracticeService.getPracticeHistory(user.id, limit);
      setPracticeHistory(history || []);
    } catch (error) {
      console.error('Error loading practice history:', error);
      setError('Failed to load practice history');
      setPracticeHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const recordPractice = async (sessionData: Omit<PracticeSession, 'id'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const newSession = await PracticeService.recordPractice({
        ...sessionData,
        userId: user.id
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
    if (!user) return false;
    try {
      return await PracticeService.isTodayCompleted(user.id, wishId);
    } catch (error) {
      console.error('Error checking today completed:', error);
      return false;
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      loadTodayPractices();
      loadPracticeHistory(50);
    } else {
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  return {
    todayPractices,
    practiceHistory,
    loading,
    error,
    recordPractice,
    checkTodayCompleted,
    refetch: () => {
      loadTodayPractices();
      loadPracticeHistory(50);
    }
  };
};
