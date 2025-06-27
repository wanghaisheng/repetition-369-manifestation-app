
import { useState, useEffect } from 'react';
import { Achievement, AchievementService } from '@/services/AchievementService';

export const useAchievements = (userId: string = 'default') => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      const userAchievements = await AchievementService.getUserAchievements(userId);
      setAchievements(userAchievements.achievements);
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAchievements = async (): Promise<Achievement[]> => {
    try {
      const newlyUnlocked = await AchievementService.checkAndUnlockAchievements(userId);
      
      if (newlyUnlocked.length > 0) {
        await loadAchievements(); // 重新加载最新数据
        
        // 显示第一个新解锁的成就
        if (newlyUnlocked[0]) {
          setNewAchievement(newlyUnlocked[0]);
        }
      }
      
      return newlyUnlocked;
    } catch (error) {
      console.error('Error checking achievements:', error);
      return [];
    }
  };

  const dismissNotification = () => {
    setNewAchievement(null);
  };

  const getUnlockedAchievements = () => {
    return achievements.filter(a => a.unlocked);
  };

  const getAchievementsByCategory = (category: Achievement['category']) => {
    return achievements.filter(a => a.category === category);
  };

  const getAchievementProgress = () => {
    const total = achievements.length;
    const unlocked = achievements.filter(a => a.unlocked).length;
    const percentage = total > 0 ? (unlocked / total) * 100 : 0;
    
    return { total, unlocked, percentage };
  };

  useEffect(() => {
    loadAchievements();
  }, [userId]);

  return {
    achievements,
    loading,
    newAchievement,
    checkAchievements,
    dismissNotification,
    getUnlockedAchievements,
    getAchievementsByCategory,
    getAchievementProgress,
    refetch: loadAchievements
  };
};
