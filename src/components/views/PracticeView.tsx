import React, { useState, useMemo, useEffect } from 'react';
import { Sun, Sunset, Moon, BarChart3, Star } from 'lucide-react';
import { useWishes } from '@/hooks/useWishes';
import { usePractice } from '@/hooks/usePractice';
import { usePoints } from '@/hooks/usePoints';
import { useStreak } from '@/hooks/useStreak';
import { useAchievements } from '@/hooks/useAchievements';
import { useNotifications } from '@/hooks/useNotifications';
import { logger } from '@/utils/logger';
import { PracticeStats } from '@/components/practice/PracticeStats';
import { PracticeCard } from '@/components/practice/PracticeCard';
import { FocusMode } from '@/components/practice/FocusMode';
import { WishSelector } from '@/components/practice/WishSelector';
import { EmptyState } from '@/components/practice/EmptyState';
import { PointsDisplay } from '@/components/gamification/PointsDisplay';
import { StreakCounter } from '@/components/gamification/StreakCounter';
import { LevelProgress } from '@/components/gamification/LevelProgress';
import { AchievementNotification } from '@/components/gamification/AchievementNotification';
import { MilestoneNotification } from '@/components/gamification/MilestoneNotification';
import { TimeSlot, Mood } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { ShareModal } from '@/components/social/ShareModal';
import { AdvancedPracticeModal } from '@/components/practice/AdvancedPracticeModal';
import { Button } from '@/components/ui/button';

export const PracticeView = () => {
  const { wishes, loading: wishesLoading } = useWishes();
  const { todayPractices, recordPractice, loading: practiceLoading } = usePractice();
  const { user } = useAuth();
  const userId = user?.id || 'default';
  
  // Gamification hooks
  const { userPoints, addPoints } = usePoints(userId);
  const { updateStreak, newMilestones, dismissMilestoneNotification } = useStreak(userId);
  const { checkAchievements, newAchievement, dismissNotification } = useAchievements(userId);
  const { scheduleReminders, sendStreakNotification } = useNotifications(userId);
  
  const [selectedWishId, setSelectedWishId] = useState<string>('');
  const [focusMode, setFocusMode] = useState<{
    isOpen: boolean;
    period?: TimeSlot;
  }>({ isOpen: false });
  
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareContent, setShareContent] = useState(null);
  const [advancedPracticeOpen, setAdvancedPracticeOpen] = useState(false);

  // Initialize notifications on first load
  useEffect(() => {
    scheduleReminders();
  }, []);

  // Send streak notifications when milestones are achieved
  useEffect(() => {
    if (newMilestones.length > 0) {
      const highestMilestone = newMilestones.reduce((prev, current) => 
        (prev.days > current.days) ? prev : current
      );
      sendStreakNotification(highestMilestone.days);
    }
  }, [newMilestones]);

  // 练习时段配置
  const periods = {
    morning: {
      icon: Sun,
      title: '晨间练习',
      subtitle: '以积极的心态开始新的一天',
      color: 'from-yellow-400 to-orange-500',
      time: '6:00 - 12:00',
      target: 3
    },
    afternoon: {
      icon: Sunset,
      title: '午间练习',
      subtitle: '在一天中保持专注和动力',
      color: 'from-orange-400 to-red-500',
      time: '12:00 - 18:00',
      target: 6
    },
    evening: {
      icon: Moon,
      title: '晚间练习',
      subtitle: '带着感恩的心结束一天',
      color: 'from-purple-400 to-indigo-500',
      time: '18:00 - 24:00',
      target: 9
    }
  };

  // 获取当前时段
  const getCurrentPeriod = (): TimeSlot => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    return 'evening';
  };

  const currentPeriod = getCurrentPeriod();

  // 计算今日进度
  const todayProgress = useMemo(() => {
    const progress: Record<TimeSlot, { completed: number; target: number }> = {
      morning: { completed: 0, target: 3 },
      afternoon: { completed: 0, target: 6 },
      evening: { completed: 0, target: 9 }
    };

    todayPractices.forEach(practice => {
      if (practice.timeSlot in progress) {
        progress[practice.timeSlot as TimeSlot].completed += practice.completedCount;
      }
    });

    return progress;
  }, [todayPractices]);

  // 计算统计数据
  const stats = useMemo(() => {
    const totalCompleted = Object.values(todayProgress).reduce((sum, p) => sum + p.completed, 0);
    const totalTarget = Object.values(todayProgress).reduce((sum, p) => sum + p.target, 0);
    const timeSpent = todayPractices.reduce((sum, p) => sum + (p.duration || 0), 0);

    return {
      todayStats: {
        totalCompleted,
        totalTarget,
        timeSpent
      },
      weeklyStats: {
        streak: 5, // 这里应该从实际数据计算
        completionRate: 85 // 这里应该从实际数据计算
      }
    };
  }, [todayProgress, todayPractices]);

  const selectedWish = wishes.find(wish => wish.id === selectedWishId);

  const handleOpenAnalytics = () => {
    setAnalyticsOpen(true);
  };

  const handleShare = (content) => {
    setShareContent(content);
    setShareModalOpen(true);
  };

  const handleStartPractice = (period: TimeSlot) => {
    if (!selectedWishId) return;
    setFocusMode({ isOpen: true, period });
  };

  const handleCompletePractice = async (entries: string[], mood: Mood) => {
    if (!selectedWish || !focusMode.period || !user) return;

    try {
      // Record the practice session
      await recordPractice({
        userId: user.id,
        wishId: selectedWish.id,
        timeSlot: focusMode.period,
        completedCount: entries.length,
        targetCount: periods[focusMode.period].target,
        duration: 0, // 这里应该传入实际用时
        affirmationText: entries.join('\n---\n'),
        mood,
        date: new Date()
      });

      // Award points for completing practice
      await addPoints('completeWriting', entries.length, `完成${focusMode.period}练习 ${entries.length}次`);

      // Update streak and check for milestones
      await updateStreak();

      // Check for new achievements
      await checkAchievements();

      setFocusMode({ isOpen: false });
    
      // Create share content for achievement
      const { SocialService } = await import('@/services/SocialService');
      const shareContent = SocialService.createProgressShare(
        stats.todayStats.totalCompleted,
        wishes.filter(w => w.status === 'achieved').length
      );
      
      // Show share option
      setTimeout(() => {
        handleShare(shareContent);
      }, 2000);
    } catch (error) {
      logger.error('Error recording practice', error);
    }
  };

  if (wishesLoading || practiceLoading) {
    return <EmptyState type="loading" />;
  }

  if (wishes.length === 0) {
    return <EmptyState type="noWishes" />;
  }

  return (
    <div className="flex-1 bg-ios-secondary-background overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Header with action buttons */}
        <div className="flex justify-end items-center">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAdvancedPracticeOpen(true)}
              className="flex items-center space-x-1"
            >
              <Star className="w-4 h-4" />
              <span>高级模式</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenAnalytics}
              className="flex items-center space-x-1"
            >
              <BarChart3 className="w-4 h-4" />
              <span>分析</span>
            </Button>
          </div>
        </div>

        {/* Enhanced gamification status display */}
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-2 gap-4">
            <PointsDisplay userId={userId} variant="compact" />
            <StreakCounter userId={userId} variant="compact" />
          </div>
          
          {/* Level progress */}
          {userPoints && (
            <LevelProgress
              level={userPoints.level}
              totalPoints={userPoints.totalPoints}
              pointsToNextLevel={userPoints.pointsToNextLevel}
              variant="compact"
              className="bg-white rounded-ios p-4 shadow-ios"
            />
          )}
        </div>

        <PracticeStats 
          todayStats={stats.todayStats}
          weeklyStats={stats.weeklyStats}
        />

        <WishSelector
          wishes={wishes}
          selectedWishId={selectedWishId}
          onWishChange={setSelectedWishId}
        />

        {selectedWishId && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">今日练习时段</h3>
            
            {Object.entries(periods).map(([periodKey, period]) => {
              const key = periodKey as TimeSlot;
              const progress = todayProgress[key];
              const isActive = key === currentPeriod;
              const isCompleted = progress.completed >= progress.target;

              return (
                <PracticeCard
                  key={key}
                  period={period}
                  progress={progress}
                  isActive={isActive}
                  isCompleted={isCompleted}
                  onStartPractice={() => handleStartPractice(key)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* 专注模式 */}
      {focusMode.isOpen && selectedWish && focusMode.period && (
        <FocusMode
          isOpen={focusMode.isOpen}
          onClose={() => setFocusMode({ isOpen: false })}
          onComplete={handleCompletePractice}
          wish={selectedWish}
          period={periods[focusMode.period]}
        />
      )}

      {/* Advanced Practice Modal */}
      <AdvancedPracticeModal
        isOpen={advancedPracticeOpen}
        onClose={() => setAdvancedPracticeOpen(false)}
        onComplete={(results) => {
          // Handle advanced practice completion
          logger.log('Advanced practice completed', results);
          setAdvancedPracticeOpen(false);
        }}
      />

      {/* Analytics Dashboard */}
      {analyticsOpen && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <AnalyticsDashboard onClose={() => setAnalyticsOpen(false)} />
        </div>
      )}

      {/* Share Modal */}
      {shareModalOpen && shareContent && (
        <ShareModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          content={shareContent}
        />
      )}

      {/* 通知组件 */}
      <AchievementNotification 
        achievement={newAchievement}
        onClose={dismissNotification}
      />
      
      <MilestoneNotification
        milestones={newMilestones}
        onClose={dismissMilestoneNotification}
      />
    </div>
  );
};
