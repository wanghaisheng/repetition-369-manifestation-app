
import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Target, Award, BarChart3, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useProgress } from '@/hooks/useProgress';
import { useWishes } from '@/hooks/useWishes';
import { usePractice } from '@/hooks/usePractice';

export const ProgressView = () => {
  const { progress, loading: progressLoading, getTodayStats, getWeeklyStats, getMonthlyStats } = useProgress();
  const { wishes, loading: wishesLoading } = useWishes();
  const { todayPractices, practiceHistory, loading: practiceLoading } = usePractice();

  const todayStats = getTodayStats();
  const weeklyStats = getWeeklyStats();
  const monthlyStats = getMonthlyStats();

  const isLoading = progressLoading || wishesLoading || practiceLoading;

  // 计算各种统计数据
  const activeWishes = wishes.filter(wish => wish.status === 'active');
  const achievedWishes = wishes.filter(wish => wish.status === 'achieved');
  const completionRate = wishes.length > 0 ? (achievedWishes.length / wishes.length) * 100 : 0;

  // 本周进度
  const weeklyProgress = weeklyStats ? 
    Math.min((weeklyStats.sessionsCompleted / weeklyStats.targetSessions) * 100, 100) : 0;

  // 今日完成的练习次数
  const todayCompletedCount = todayPractices.reduce((sum, practice) => sum + practice.completedCount, 0);
  const todayTargetCount = activeWishes.length * 18; // 每个愿望每天需要18次 (3+6+9)
  const todayProgress = todayTargetCount > 0 ? (todayCompletedCount / todayTargetCount) * 100 : 0;

  if (isLoading) {
    return (
      <div className="flex-1 bg-ios-secondary-background px-4 py-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ios-blue mx-auto mb-4"></div>
          <p className="text-gray-600">加载进度数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-ios-secondary-background px-4 py-6 pb-8 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">我的进度</h1>
        <p className="text-gray-600">追踪您的显化之旅</p>
      </div>

      {/* 总览统计 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-4 bg-white border-0 shadow-ios rounded-ios">
          <div className="flex items-center space-x-3">
            <div className="bg-ios-blue/10 rounded-full p-2">
              <Target className="w-5 h-5 text-ios-blue" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-800">{wishes.length}</div>
              <div className="text-sm text-gray-600">总愿望数</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white border-0 shadow-ios rounded-ios">
          <div className="flex items-center space-x-3">
            <div className="bg-ios-green/10 rounded-full p-2">
              <Award className="w-5 h-5 text-ios-green" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-800">{achievedWishes.length}</div>
              <div className="text-sm text-gray-600">已实现</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white border-0 shadow-ios rounded-ios">
          <div className="flex items-center space-x-3">
            <div className="bg-manifest-gold/10 rounded-full p-2">
              <Activity className="w-5 h-5 text-manifest-gold" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-800">{progress?.totalSessions || 0}</div>
              <div className="text-sm text-gray-600">总练习数</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white border-0 shadow-ios rounded-ios">
          <div className="flex items-center space-x-3">
            <div className="bg-ios-orange/10 rounded-full p-2">
              <TrendingUp className="w-5 h-5 text-ios-orange" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-800">{todayStats?.consecutiveDays || 0}</div>
              <div className="text-sm text-gray-600">连续天数</div>
            </div>
          </div>
        </Card>
      </div>

      {/* 今日进度 */}
      <Card className="p-6 bg-white border-0 shadow-ios rounded-ios mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">今日进度</h3>
          <div className="bg-ios-blue/10 rounded-full p-2">
            <Calendar className="w-5 h-5 text-ios-blue" />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">完成进度</span>
              <span className="text-sm font-medium text-gray-800">{Math.round(todayProgress)}%</span>
            </div>
            <Progress value={todayProgress} className="h-3" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-lg font-bold text-ios-blue">{todayCompletedCount}</div>
              <div className="text-xs text-gray-600">已完成</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-400">{todayTargetCount}</div>
              <div className="text-xs text-gray-600">目标次数</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-manifest-gold">{todayPractices.length}</div>
              <div className="text-xs text-gray-600">练习场次</div>
            </div>
          </div>
        </div>
      </Card>

      {/* 本周统计 */}
      <Card className="p-6 bg-white border-0 shadow-ios rounded-ios mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">本周统计</h3>
          <div className="bg-ios-green/10 rounded-full p-2">
            <BarChart3 className="w-5 h-5 text-ios-green" />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">周进度</span>
              <span className="text-sm font-medium text-gray-800">{Math.round(weeklyProgress)}%</span>
            </div>
            <Progress value={weeklyProgress} className="h-3" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-lg font-bold text-ios-green">{weeklyStats?.sessionsCompleted || 0}</div>
              <div className="text-xs text-gray-600">本周完成</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-400">{weeklyStats?.targetSessions || 21}</div>
              <div className="text-xs text-gray-600">周目标</div>
            </div>
          </div>
        </div>
      </Card>

      {/* 愿望完成率 */}
      <Card className="p-6 bg-white border-0 shadow-ios rounded-ios mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">愿望实现率</h3>
          <div className="bg-manifest-gold/10 rounded-full p-2">
            <Award className="w-5 h-5 text-manifest-gold" />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">完成率</span>
              <span className="text-sm font-medium text-gray-800">{Math.round(completionRate)}%</span>
            </div>
            <Progress value={completionRate} className="h-3" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-lg font-bold text-ios-green">{achievedWishes.length}</div>
              <div className="text-xs text-gray-600">已实现</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-ios-blue">{activeWishes.length}</div>
              <div className="text-xs text-gray-600">进行中</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-400">{wishes.length}</div>
              <div className="text-xs text-gray-600">总数</div>
            </div>
          </div>
        </div>
      </Card>

      {/* 最近月份统计 */}
      {monthlyStats.length > 0 && (
        <Card className="p-6 bg-white border-0 shadow-ios rounded-ios mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">月度趋势</h3>
            <div className="bg-ios-purple/10 rounded-full p-2">
              <TrendingUp className="w-5 h-5 text-ios-purple" />
            </div>
          </div>
          
          <div className="space-y-3">
            {monthlyStats.slice(-3).map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-ios">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-ios-blue rounded-full"></div>
                  <span className="font-medium text-gray-800">{stat.month}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-800">{stat.practices}</div>
                  <div className="text-xs text-gray-600">练习次数</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 成就徽章 */}
      <Card className="p-6 bg-white border-0 shadow-ios rounded-ios">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">成就徽章</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* 连续练习徽章 */}
          <div className={`p-4 rounded-ios text-center ${
            (todayStats?.consecutiveDays || 0) >= 7 ? 'bg-ios-green/10' : 'bg-gray-100'
          }`}>
            <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
              (todayStats?.consecutiveDays || 0) >= 7 ? 'bg-ios-green' : 'bg-gray-300'
            }`}>
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div className="text-xs font-medium text-gray-800">连续7天</div>
          </div>

          {/* 完成目标徽章 */}
          <div className={`p-4 rounded-ios text-center ${
            achievedWishes.length > 0 ? 'bg-manifest-gold/10' : 'bg-gray-100'
          }`}>
            <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
              achievedWishes.length > 0 ? 'bg-manifest-gold' : 'bg-gray-300'
            }`}>
              <Award className="w-4 h-4 text-white" />
            </div>
            <div className="text-xs font-medium text-gray-800">首个愿望</div>
          </div>

          {/* 练习达人徽章 */}
          <div className={`p-4 rounded-ios text-center ${
            (progress?.totalSessions || 0) >= 100 ? 'bg-ios-blue/10' : 'bg-gray-100'
          }`}>
            <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
              (progress?.totalSessions || 0) >= 100 ? 'bg-ios-blue' : 'bg-gray-300'
            }`}>
              <Activity className="w-4 h-4 text-white" />
            </div>
            <div className="text-xs font-medium text-gray-800">练习达人</div>
          </div>

          {/* 坚持大师徽章 */}
          <div className={`p-4 rounded-ios text-center ${
            (progress?.longestStreak || 0) >= 30 ? 'bg-ios-purple/10' : 'bg-gray-100'
          }`}>
            <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
              (progress?.longestStreak || 0) >= 30 ? 'bg-ios-purple' : 'bg-gray-300'
            }`}>
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div className="text-xs font-medium text-gray-800">坚持大师</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
