
import { useState, useEffect } from 'react';
import { StreakService, UserStreak, StreakMilestone } from '@/services/StreakService';

export const useStreak = (userId: string = 'default') => {
  const [userStreak, setUserStreak] = useState<UserStreak | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMilestones, setNewMilestones] = useState<StreakMilestone[]>([]);

  const loadStreak = async () => {
    try {
      setLoading(true);
      const streak = await StreakService.getUserStreak(userId);
      setUserStreak(streak);
    } catch (error) {
      console.error('Error loading streak:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStreak = async (): Promise<boolean> => {
    try {
      const result = await StreakService.updateStreak(userId);
      
      if (result.newMilestones.length > 0) {
        setNewMilestones(result.newMilestones);
      }
      
      await loadStreak(); // Reload latest data
      return result.streakUpdated;
    } catch (error) {
      console.error('Error updating streak:', error);
      return false;
    }
  };

  const dismissMilestoneNotification = () => {
    setNewMilestones([]);
  };

  const getStreakStats = () => {
    if (!userStreak) return null;
    
    const streakLevel = StreakService.getStreakLevel(userStreak.currentStreak);
    const nextMilestone = StreakService.getNextMilestone(userStreak.currentStreak);
    
    return {
      current: userStreak.currentStreak,
      longest: userStreak.longestStreak,
      level: streakLevel,
      nextMilestone,
      recentHistory: userStreak.streakHistory.slice(0, 7)
    };
  };

  useEffect(() => {
    loadStreak();
  }, [userId]);

  return {
    userStreak,
    loading,
    newMilestones,
    updateStreak,
    dismissMilestoneNotification,
    getStreakStats,
    refetch: loadStreak
  };
};
