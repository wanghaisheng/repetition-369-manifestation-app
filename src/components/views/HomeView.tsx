import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useWishes } from '@/hooks/useWishes';
import { usePractice } from '@/hooks/usePractice';
import { useProgress } from '@/hooks/useProgress';
import { AddWishModal } from '@/components/modals/AddWishModal';
import { useToast } from '@/hooks/use-toast';
import { HomeViewSkeleton } from '@/components/skeletons/AppSkeletons';
import { WelcomeHero } from '@/components/home/WelcomeHero';
import { TodayProgressCard } from '@/components/home/TodayProgressCard';
import { QuickStatsRow } from '@/components/home/QuickStatsRow';
import { QuickActions } from '@/components/home/QuickActions';
import { RecentActivity } from '@/components/home/RecentActivity';

export const HomeView = () => {
  const { wishes, loading: wishesLoading, error: wishesError, createWish, refetch } = useWishes();
  const { todayPractices, loading: practiceLoading, error: practiceError } = usePractice();
  const { progress, loading: progressLoading, error: progressError, getTodayStats, getWeeklyStats } = useProgress();
  const { toast } = useToast();
  const [isAddWishModalOpen, setIsAddWishModalOpen] = useState(false);

  const activeWishes = wishes.filter(wish => wish.status === 'active');
  const todayStats = getTodayStats();
  const weeklyStats = getWeeklyStats();

  // Calculate today's progress
  const todayProgress = todayPractices.length > 0 && activeWishes.length > 0 ? 
    Math.min((todayPractices.reduce((sum, p) => sum + p.completedCount, 0) / (activeWishes.length * 18)) * 100, 100) : 0;

  const isLoading = wishesLoading || practiceLoading || progressLoading;
  const hasErrors = wishesError || practiceError || progressError;

  const handleAddWish = async (wishData: any) => {
    try {
      await createWish(wishData);
      toast({
        title: "愿望创建成功",
        description: "您的愿望已添加，可以开始练习了！",
      });
      setIsAddWishModalOpen(false);
      refetch();
    } catch (error) {
      toast({
        title: "创建失败",
        description: "创建愿望时出现错误，请重试",
        variant: "destructive",
      });
    }
  };

  const handleOpenAddWish = () => setIsAddWishModalOpen(true);

  if (isLoading) {
    return <HomeViewSkeleton />;
  }

  return (
    <div className="flex-1 bg-secondary/30 px-4 py-5 overflow-y-auto">
      {/* Error Alert */}
      {hasErrors && (
        <Card className="p-4 bg-destructive/10 border-destructive/20 mb-4">
          <p className="text-destructive text-sm">数据加载时遇到问题，但您仍可以正常使用应用</p>
        </Card>
      )}

      {/* New User Welcome */}
      {activeWishes.length === 0 ? (
        <WelcomeHero onCreateWish={handleOpenAddWish} />
      ) : (
        <>
          {/* Today's Progress */}
          <TodayProgressCard
            todayProgress={todayProgress}
            activeWishesCount={activeWishes.length}
            todayPracticesCount={todayPractices.length}
            consecutiveDays={todayStats?.consecutiveDays || 0}
          />
          
          {/* Quick Stats */}
          <QuickStatsRow
            weeklyPractices={weeklyStats?.sessionsCompleted || 0}
            totalPractices={progress?.totalSessions || 0}
          />
        </>
      )}

      {/* Quick Actions */}
      <QuickActions
        hasActiveWishes={activeWishes.length > 0}
        onCreateWish={handleOpenAddWish}
      />

      {/* Recent Activity */}
      <RecentActivity
        practices={todayPractices}
        wishes={wishes}
      />

      {/* Add Wish Modal */}
      <AddWishModal
        isOpen={isAddWishModalOpen}
        onClose={() => setIsAddWishModalOpen(false)}
        onAdd={handleAddWish}
      />
    </div>
  );
};
