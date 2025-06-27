import { useState, useEffect } from 'react';
import { Sunrise, Sun, Moon } from 'lucide-react';
import { useWishes } from '@/hooks/useWishes';
import { usePractice } from '@/hooks/usePractice';
import { usePoints } from '@/hooks/usePoints';
import { useProgress } from '@/hooks/useProgress';
import { useAchievements } from '@/hooks/useAchievements';
import { useAuth } from '@/contexts/AuthContext';
import { TimeSlot, Mood } from '@/types';
import { PracticeHeader } from '@/components/practice/PracticeHeader';
import { WishSelector } from '@/components/practice/WishSelector';
import { PracticePhase } from '@/components/practice/PracticePhase';
import { PracticeWritingModal } from '@/components/practice/PracticeWritingModal';
import { PracticeOverview } from '@/components/practice/PracticeOverview';
import { EmptyState } from '@/components/practice/EmptyState';
import { PointsDisplay } from '@/components/gamification/PointsDisplay';
import { StreakCounter } from '@/components/gamification/StreakCounter';
import { AchievementNotification } from '@/components/gamification/AchievementNotification';

export const PracticeView = () => {
  const [currentPeriod, setCurrentPeriod] = useState<TimeSlot>('morning');
  const [isWriting, setIsWriting] = useState(false);
  const [selectedWishId, setSelectedWishId] = useState<string>('');
  
  const { user } = useAuth();
  const { wishes, loading: wishesLoading } = useWishes();
  const { todayPractices, recordPractice, loading: practicesLoading } = usePractice();
  const { addPoints } = usePoints();
  const { updateProgress } = useProgress();
  const { checkAchievements, newAchievement, dismissNotification } = useAchievements(user?.id);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setCurrentPeriod('morning');
    } else if (hour < 18) {
      setCurrentPeriod('afternoon');
    } else {
      setCurrentPeriod('evening');
    }
  }, []);

  useEffect(() => {
    if (wishes.length > 0 && !selectedWishId) {
      setSelectedWishId(wishes[0].id);
    }
  }, [wishes, selectedWishId]);

  const periods = {
    morning: {
      icon: Sunrise,
      title: '早晨练习',
      subtitle: '书写 3 次',
      color: 'from-manifest-warm-gold to-yellow-500',
      time: '6:00 - 12:00',
      target: 3
    },
    afternoon: {
      icon: Sun,
      title: '下午练习',
      subtitle: '书写 6 次',
      color: 'from-ios-blue to-blue-600',
      time: '12:00 - 18:00',
      target: 6
    },
    evening: {
      icon: Moon,
      title: '晚间练习',
      subtitle: '书写 9 次',
      color: 'from-manifest-lavender to-purple-500',
      time: '18:00 - 24:00',
      target: 9
    }
  };

  const getTodayProgress = () => {
    const progress = {
      morning: { completed: 0, target: 3 },
      afternoon: { completed: 0, target: 6 },
      evening: { completed: 0, target: 9 }
    };

    todayPractices.forEach(practice => {
      progress[practice.timeSlot].completed += practice.completedCount;
    });

    return progress;
  };

  const todayProgress = getTodayProgress();
  const currentPeriodInfo = periods[currentPeriod];
  const currentProgress = todayProgress[currentPeriod];
  const isCompleted = currentProgress.completed >= currentProgress.target;

  const handleSubmitWriting = async (text: string, mood: Mood) => {
    if (text.trim() && selectedWishId && user) {
      try {
        await recordPractice({
          wishId: selectedWishId,
          date: new Date(),
          timeSlot: currentPeriod,
          completedCount: 1,
          targetCount: currentPeriodInfo.target,
          duration: 60,
          affirmationText: text,
          mood: mood,
          userId: user.id
        });

        // 添加点数奖励
        await addPoints('completeWriting');

        // 更新进度统计
        await updateProgress();

        // 检查成就解锁
        await checkAchievements();
        
        setIsWriting(false);
      } catch (error) {
        console.error('Error recording practice:', error);
      }
    }
  };

  const getCurrentAffirmation = () => {
    const selectedWish = wishes.find(wish => wish.id === selectedWishId);
    return selectedWish?.affirmation || "请先选择一个愿望来开始练习";
  };

  if (wishesLoading || practicesLoading) {
    return <EmptyState type="loading" />;
  }

  if (wishes.length === 0) {
    return <EmptyState type="noWishes" />;
  }

  return (
    <div className="flex-1 bg-ios-secondary-background px-4 py-6 overflow-y-auto">
      <PracticeHeader 
        title="369练习" 
        subtitle="专注书写，显化愿望" 
      />

      {/* 游戏化元素 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <PointsDisplay userId={user?.id || 'default'} variant="compact" />
        <StreakCounter userId={user?.id || 'default'} variant="compact" />
      </div>

      <WishSelector
        wishes={wishes}
        selectedWishId={selectedWishId}
        onWishChange={setSelectedWishId}
      />

      <PracticePhase
        period={currentPeriod}
        periodInfo={currentPeriodInfo}
        progress={currentProgress}
        isCompleted={isCompleted}
        selectedWishId={selectedWishId}
        onStartWriting={() => setIsWriting(true)}
      />

      <PracticeWritingModal
        isOpen={isWriting}
        currentAffirmation={getCurrentAffirmation()}
        currentProgress={currentProgress}
        periodColor={currentPeriodInfo.color}
        onSubmit={handleSubmitWriting}
        onCancel={() => setIsWriting(false)}
      />

      <PracticeOverview
        periods={periods}
        todayProgress={todayProgress}
        currentPeriod={currentPeriod}
      />

      {/* 成就解锁通知 */}
      <AchievementNotification
        achievement={newAchievement}
        onClose={dismissNotification}
      />
    </div>
  );
};
