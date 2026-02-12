import { useState, useMemo, useEffect } from 'react';
import { useSearch } from '@tanstack/react-router';
import { Star, BarChart3 } from 'lucide-react';
import { useWishes } from '@/hooks/useWishes';
import { usePractice } from '@/hooks/usePractice';
import { usePoints } from '@/hooks/usePoints';
import { useStreak } from '@/hooks/useStreak';
import { useAchievements } from '@/hooks/useAchievements';
import { useNotifications } from '@/hooks/useNotifications';
import { logger } from '@/utils/logger';
import { TimeSlot, Mood } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { PracticeViewSkeleton } from '@/components/skeletons/AppSkeletons';
import { AchievementNotification } from '@/components/gamification/AchievementNotification';
import { MilestoneNotification } from '@/components/gamification/MilestoneNotification';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { ShareModal } from '@/components/social/ShareModal';
import { AdvancedPracticeModal } from '@/components/practice/AdvancedPracticeModal';
import { WishSelector } from '@/components/practice/WishSelector';
import { EmptyState } from '@/components/practice/EmptyState';
import { PracticeHero } from '@/components/practice/PracticeHero';
import { TimeSlotCard } from '@/components/practice/TimeSlotCard';
import { ImmersiveFocusMode } from '@/components/practice/ImmersiveFocusMode';
import { QuickStatsBar } from '@/components/practice/QuickStatsBar';
import { useTranslation } from 'react-i18next';

export const PracticeView = () => {
  const { t } = useTranslation('app');
  const searchParams = useSearch({ strict: false }) as { wishId?: string };
  const { wishes, loading: wishesLoading } = useWishes();
  const { todayPractices, practiceHistory, recordPractice, loading: practiceLoading } = usePractice();
  const { user } = useAuth();
  const userId = user?.id || 'default';
  
  // Gamification hooks
  const { userPoints, addPoints } = usePoints(userId);
  const { userStreak, updateStreak, newMilestones, dismissMilestoneNotification } = useStreak(userId);
  const { checkAchievements, newAchievement, dismissNotification } = useAchievements(userId);
  const { scheduleReminders, sendStreakNotification } = useNotifications(userId);
  
  const [selectedWishId, setSelectedWishId] = useState<string>('');
  const [focusMode, setFocusMode] = useState<{
    isOpen: boolean;
    slot?: TimeSlot;
    target?: number;
  }>({ isOpen: false });
  
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareContent, setShareContent] = useState<any>(null);
  const [advancedPracticeOpen, setAdvancedPracticeOpen] = useState(false);

  // Initialize notifications
  useEffect(() => {
    scheduleReminders();
  }, []);

  // Auto-select wish from URL
  useEffect(() => {
    const wishIdFromUrl = searchParams.wishId;
    if (wishIdFromUrl && wishes.length > 0) {
      const wishExists = wishes.some(w => w.id === wishIdFromUrl);
      if (wishExists) {
        setSelectedWishId(wishIdFromUrl);
      }
    }
  }, [searchParams, wishes]);

  // Send streak notifications
  useEffect(() => {
    if (newMilestones.length > 0) {
      const highestMilestone = newMilestones.reduce((prev, current) => 
        (prev.days > current.days) ? prev : current
      );
      sendStreakNotification(highestMilestone.days);
    }
  }, [newMilestones]);

  // Time slot configuration
  const slots: { slot: TimeSlot; target: number }[] = [
    { slot: 'morning', target: 3 },
    { slot: 'afternoon', target: 6 },
    { slot: 'evening', target: 9 }
  ];

  // Get current time slot
  const getCurrentSlot = (): TimeSlot => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    return 'evening';
  };

  const currentSlot = getCurrentSlot();

  // Calculate today's progress
  const todayProgress = useMemo(() => {
    const progress: Record<TimeSlot, number> = {
      morning: 0,
      afternoon: 0,
      evening: 0
    };

    todayPractices.forEach(practice => {
      if (practice.timeSlot in progress) {
        progress[practice.timeSlot as TimeSlot] += practice.completedCount;
      }
    });

    return progress;
  }, [todayPractices]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalCompleted = Object.values(todayProgress).reduce((sum, p) => sum + p, 0);
    const totalTarget = 3 + 6 + 9; // 18 total

    // Weekly stats from practice history
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weeklyPractices = practiceHistory.filter(p => 
      new Date(p.date) >= weekStart
    );
    const weeklyCompleted = weeklyPractices.reduce((sum, p) => sum + p.completedCount, 0);
    const weeklyTarget = 18 * 7; // 18 per day * 7 days

    return {
      totalCompleted,
      totalTarget,
      weeklyCompleted,
      weeklyTarget
    };
  }, [todayProgress, practiceHistory]);

  const selectedWish = wishes.find(wish => wish.id === selectedWishId);

  const handleStartPractice = (slot: TimeSlot, target: number) => {
    if (!selectedWishId) return;
    setFocusMode({ isOpen: true, slot, target });
  };

  const handleCompletePractice = async (entries: string[], mood: Mood) => {
    if (!selectedWish || !focusMode.slot || !user) return;

    try {
      await recordPractice({
        userId: user.id,
        wishId: selectedWish.id,
        timeSlot: focusMode.slot,
        completedCount: entries.length,
        targetCount: focusMode.target || entries.length,
        duration: 0,
        affirmationText: entries.join('\n---\n'),
        mood,
        date: new Date()
      });

      await addPoints('completeWriting', entries.length, `完成${focusMode.slot}练习`);
      await updateStreak();
      await checkAchievements();

      setFocusMode({ isOpen: false });
    
      // Create share content
      const { SocialService } = await import('@/services/SocialService');
      const content = SocialService.createProgressShare(
        stats.totalCompleted,
        wishes.filter(w => w.status === 'achieved').length
      );
      
      setTimeout(() => {
        setShareContent(content);
        setShareModalOpen(true);
      }, 2000);
    } catch (error) {
      logger.error('Error recording practice', error);
    }
  };

  if (wishesLoading || practiceLoading) {
    return <PracticeViewSkeleton />;
  }

  if (wishes.length === 0) {
    return <EmptyState type="noWishes" />;
  }

  return (
    <div className="flex-1 bg-background overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Header actions */}
        <div className="flex justify-end items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAdvancedPracticeOpen(true)}
            className="rounded-xl"
          >
            <Star className="w-4 h-4 mr-1.5" />
            {t('practice.advancedMode', '高级')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAnalyticsOpen(true)}
            className="rounded-xl"
          >
            <BarChart3 className="w-4 h-4 mr-1.5" />
            {t('practice.analytics', '分析')}
          </Button>
        </div>

        {/* Hero Card */}
        <PracticeHero
          totalCompleted={stats.totalCompleted}
          totalTarget={stats.totalTarget}
          currentStreak={userStreak?.currentStreak || 0}
          totalPoints={userPoints?.totalPoints || 0}
          level={userPoints?.level || 1}
        />

        {/* Quick Stats */}
        <QuickStatsBar
          todayCompleted={stats.totalCompleted}
          todayTarget={stats.totalTarget}
          weeklyCompleted={stats.weeklyCompleted}
          weeklyTarget={stats.weeklyTarget}
        />

        {/* Wish Selector */}
        <WishSelector
          wishes={wishes}
          selectedWishId={selectedWishId}
          onWishChange={setSelectedWishId}
        />

        {/* Time Slot Cards */}
        {selectedWishId && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground px-1">
              {t('practice.todaySessions', '今日修行时段')}
            </h3>
            
            {slots.map(({ slot, target }) => {
              const completed = todayProgress[slot];
              const isActive = slot === currentSlot;
              const slotOrder = { morning: 0, afternoon: 1, evening: 2 };
              const isLocked = slotOrder[slot] > slotOrder[currentSlot] && completed === 0;

              return (
                <TimeSlotCard
                  key={slot}
                  slot={slot}
                  completed={completed}
                  target={target}
                  isActive={isActive}
                  isLocked={isLocked}
                  onStart={() => handleStartPractice(slot, target)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Immersive Focus Mode */}
      {focusMode.isOpen && selectedWish && focusMode.slot && (
        <ImmersiveFocusMode
          isOpen={focusMode.isOpen}
          onClose={() => setFocusMode({ isOpen: false })}
          onComplete={handleCompletePractice}
          wish={selectedWish}
          timeSlot={focusMode.slot}
          target={focusMode.target || 3}
        />
      )}

      {/* Advanced Practice Modal */}
      <AdvancedPracticeModal
        isOpen={advancedPracticeOpen}
        onClose={() => setAdvancedPracticeOpen(false)}
        onComplete={(results) => {
          logger.log('Advanced practice completed', results);
          setAdvancedPracticeOpen(false);
        }}
      />

      {/* Analytics Dashboard */}
      {analyticsOpen && (
        <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
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

      {/* Notifications */}
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
