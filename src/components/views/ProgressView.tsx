import { useProgress } from '@/hooks/useProgress';
import { useWishes } from '@/hooks/useWishes';
import { usePractice } from '@/hooks/usePractice';
import { useAchievements } from '@/hooks/useAchievements';
import { ProgressViewSkeleton } from '@/components/skeletons/AppSkeletons';
import { TodayProgressHero } from '@/components/progress/TodayProgressHero';
import { StatsCarousel } from '@/components/progress/StatsCarousel';
import { WeeklyProgressCard } from '@/components/progress/WeeklyProgressCard';
import { WishCompletionCard } from '@/components/progress/WishCompletionCard';
import { MonthlyTrendChart } from '@/components/progress/MonthlyTrendChart';
import { AchievementsGrid } from '@/components/progress/AchievementsGrid';

export const ProgressView = () => {
  const { progress, loading: progressLoading, getTodayStats, getWeeklyStats, getMonthlyStats } = useProgress();
  const { wishes, loading: wishesLoading } = useWishes();
  const { todayPractices, loading: practiceLoading } = usePractice();
  const { achievements } = useAchievements();

  const todayStats = getTodayStats();
  const weeklyStats = getWeeklyStats();
  const monthlyStats = getMonthlyStats();

  const isLoading = progressLoading || wishesLoading || practiceLoading;

  // Calculate statistics
  const activeWishes = wishes.filter(wish => wish.status === 'active');
  const achievedWishes = wishes.filter(wish => wish.status === 'achieved');
  const completionRate = wishes.length > 0 ? (achievedWishes.length / wishes.length) * 100 : 0;

  // Weekly progress
  const weeklyProgress = weeklyStats ? 
    Math.min((weeklyStats.sessionsCompleted / weeklyStats.targetSessions) * 100, 100) : 0;

  // Today's practice count
  const todayCompletedCount = todayPractices.reduce((sum, practice) => sum + practice.completedCount, 0);
  const todayTargetCount = activeWishes.length * 18; // 3+6+9 per wish
  const todayProgress = todayTargetCount > 0 ? (todayCompletedCount / todayTargetCount) * 100 : 0;

  if (isLoading) {
    return <ProgressViewSkeleton />;
  }

  return (
    <div className="flex-1 bg-background px-4 py-4 overflow-y-auto space-y-4">
      {/* Hero Progress Card */}
      <TodayProgressHero
        todayProgress={todayProgress}
        todayCompletedCount={todayCompletedCount}
        todayTargetCount={todayTargetCount}
        consecutiveDays={todayStats?.consecutiveDays || 0}
        sessionsCount={todayPractices.length}
      />

      {/* Stats Carousel */}
      <StatsCarousel
        totalWishes={wishes.length}
        achievedWishes={achievedWishes.length}
        totalSessions={progress?.totalSessions || 0}
        longestStreak={progress?.longestStreak || 0}
      />

      {/* Weekly Progress Card */}
      <WeeklyProgressCard
        todayProgress={todayProgress}
        todayCompletedCount={todayCompletedCount}
        todayTargetCount={todayTargetCount}
        sessionsCount={todayPractices.length}
        weeklyProgress={weeklyProgress}
        weeklyCompleted={weeklyStats?.sessionsCompleted || 0}
        weeklyTarget={weeklyStats?.targetSessions || 21}
      />

      {/* Wish Completion Rate */}
      <WishCompletionCard
        completionRate={completionRate}
        achievedWishes={achievedWishes.length}
        activeWishes={activeWishes.length}
        totalWishes={wishes.length}
      />

      {/* Monthly Trend Chart */}
      <MonthlyTrendChart monthlyStats={monthlyStats} />

      {/* Achievements Grid */}
      <AchievementsGrid
        achievements={achievements}
        consecutiveDays={todayStats?.consecutiveDays || 0}
        achievedWishes={achievedWishes.length}
        totalSessions={progress?.totalSessions || 0}
        longestStreak={progress?.longestStreak || 0}
      />
    </div>
  );
};
