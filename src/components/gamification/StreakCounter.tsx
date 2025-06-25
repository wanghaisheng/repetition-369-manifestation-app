
import { useState, useEffect } from 'react';
import { Flame, Award, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useProgress } from '@/hooks/useProgress';

interface StreakCounterProps {
  userId: string;
  variant?: 'compact' | 'detailed';
}

export const StreakCounter = ({ userId, variant = 'compact' }: StreakCounterProps) => {
  const { progress, loading } = useProgress(userId);
  const [animateStreak, setAnimateStreak] = useState(false);

  useEffect(() => {
    if (progress && progress.consecutiveDays > 0) {
      setAnimateStreak(true);
      const timer = setTimeout(() => setAnimateStreak(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [progress?.consecutiveDays]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-16 bg-gray-200 rounded-ios"></div>
      </div>
    );
  }

  if (!progress) return null;

  const getStreakLevel = (days: number) => {
    if (days >= 30) return { level: 'legendary', color: 'text-manifest-gold', bgColor: 'from-manifest-gold to-yellow-500' };
    if (days >= 21) return { level: 'epic', color: 'text-purple-600', bgColor: 'from-manifest-lavender to-purple-500' };
    if (days >= 7) return { level: 'rare', color: 'text-ios-blue', bgColor: 'from-ios-blue to-blue-600' };
    if (days >= 3) return { level: 'good', color: 'text-ios-green', bgColor: 'from-ios-green to-green-500' };
    return { level: 'starting', color: 'text-gray-600', bgColor: 'from-gray-400 to-gray-500' };
  };

  const streakInfo = getStreakLevel(progress.consecutiveDays);

  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-2 bg-gradient-to-r from-ios-orange/10 to-red-500/10 px-4 py-2 rounded-ios">
        <Flame className={`w-5 h-5 ${streakInfo.color} ${animateStreak ? 'animate-pulse' : ''}`} />
        <span className={`font-semibold text-gray-800 ${animateStreak ? 'animate-bounce' : ''} transition-all duration-300`}>
          {progress.consecutiveDays}
        </span>
        <span className="text-sm text-gray-600">天连击</span>
      </div>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-ios-orange/5 to-red-500/5 border-ios-orange/20">
      <div className="text-center mb-4">
        <div className={`w-16 h-16 bg-gradient-to-br ${streakInfo.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
          <Flame className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">连击记录</h3>
      </div>

      <div className="space-y-4">
        {/* 当前连击 */}
        <div className="text-center">
          <div className={`text-3xl font-bold ${streakInfo.color} mb-1 ${animateStreak ? 'animate-bounce' : ''} transition-all duration-300`}>
            {progress.consecutiveDays}
          </div>
          <div className="text-sm text-gray-600">连续练习天数</div>
        </div>

        {/* 最长记录 */}
        <div className="flex items-center justify-between p-3 bg-white rounded-ios">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-manifest-gold" />
            <span className="text-sm font-medium text-gray-700">最长记录</span>
          </div>
          <span className="font-semibold text-manifest-gold">
            {progress.longestStreak} 天
          </span>
        </div>

        {/* 下一个里程碑 */}
        {progress.consecutiveDays < 30 && (
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-2">下一个里程碑</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${streakInfo.bgColor} transition-all duration-300`}
                style={{ 
                  width: `${(progress.consecutiveDays % 7) / 7 * 100}%` 
                }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {7 - (progress.consecutiveDays % 7)} 天后达到下一级别
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
