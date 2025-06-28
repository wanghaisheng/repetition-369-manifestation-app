
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar, Flame, Trophy, Clock } from 'lucide-react';

interface PracticeStatsProps {
  todayStats: {
    totalCompleted: number;
    totalTarget: number;
    timeSpent: number;
  };
  weeklyStats: {
    streak: number;
    completionRate: number;
  };
}

export const PracticeStats = ({ todayStats, weeklyStats }: PracticeStatsProps) => {
  const todayProgress = (todayStats.totalCompleted / todayStats.totalTarget) * 100;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return mins > 0 ? `${mins}分钟` : `${seconds}秒`;
  };

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {/* Today's Progress */}
      <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-ios rounded-ios">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-blue-500 rounded-ios flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-700">今日进度</p>
            <p className="text-xs text-blue-600">{todayStats.totalCompleted}/{todayStats.totalTarget}</p>
          </div>
        </div>
        <Progress value={todayProgress} className="h-2 mb-2" />
        <p className="text-xs text-blue-600">{Math.round(todayProgress)}% 完成</p>
      </Card>

      {/* Streak */}
      <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-0 shadow-ios rounded-ios">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-orange-500 rounded-ios flex items-center justify-center">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-orange-700">连续天数</p>
            <p className="text-lg font-bold text-orange-600">{weeklyStats.streak}天</p>
          </div>
        </div>
      </Card>

      {/* Completion Rate */}
      <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-ios rounded-ios">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-green-500 rounded-ios flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-green-700">本周完成率</p>
            <p className="text-lg font-bold text-green-600">{Math.round(weeklyStats.completionRate)}%</p>
          </div>
        </div>
      </Card>

      {/* Time Spent */}
      <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-ios rounded-ios">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-purple-500 rounded-ios flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-purple-700">今日用时</p>
            <p className="text-lg font-bold text-purple-600">{formatTime(todayStats.timeSpent)}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
