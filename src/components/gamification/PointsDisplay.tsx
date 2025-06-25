
import { useState, useEffect } from 'react';
import { Star, TrendingUp, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { PointsService, UserPoints } from '@/services/PointsService';

interface PointsDisplayProps {
  userId: string;
  variant?: 'compact' | 'detailed';
  showAnimation?: boolean;
}

export const PointsDisplay = ({ 
  userId, 
  variant = 'compact', 
  showAnimation = true 
}: PointsDisplayProps) => {
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [loading, setLoading] = useState(true);
  const [animatePoints, setAnimatePoints] = useState(false);

  const loadPoints = async () => {
    try {
      setLoading(true);
      const points = await PointsService.getUserPoints(userId);
      setUserPoints(points);
    } catch (error) {
      console.error('Error loading points:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPoints();
  }, [userId]);

  useEffect(() => {
    if (showAnimation && userPoints) {
      setAnimatePoints(true);
      const timer = setTimeout(() => setAnimatePoints(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [userPoints?.totalPoints, showAnimation]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-16 bg-gray-200 rounded-ios"></div>
      </div>
    );
  }

  if (!userPoints) return null;

  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-2 bg-gradient-to-r from-manifest-warm-gold/10 to-manifest-gold/10 px-4 py-2 rounded-ios">
        <Star className="w-5 h-5 text-manifest-gold" />
        <span className={`font-semibold text-gray-800 ${animatePoints ? 'animate-pulse scale-110' : ''} transition-all duration-300`}>
          {userPoints.totalPoints.toLocaleString()}
        </span>
        <span className="text-sm text-gray-600">点数</span>
      </div>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-manifest-warm-gold/5 to-manifest-gold/5 border-manifest-gold/20">
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-manifest-warm-gold to-manifest-gold rounded-full flex items-center justify-center mx-auto mb-3">
          <Star className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">我的点数</h3>
      </div>

      <div className="space-y-4">
        {/* 总点数 */}
        <div className="text-center">
          <div className={`text-3xl font-bold text-manifest-gold mb-1 ${animatePoints ? 'animate-bounce' : ''} transition-all duration-300`}>
            {userPoints.totalPoints.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">累计点数</div>
        </div>

        {/* 今日点数 */}
        <div className="flex items-center justify-between p-3 bg-white rounded-ios">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-ios-blue" />
            <span className="text-sm font-medium text-gray-700">今日获得</span>
          </div>
          <span className="font-semibold text-ios-blue">
            +{userPoints.todayPoints}
          </span>
        </div>

        {/* 趋势指示 */}
        {userPoints.pointsHistory.length > 0 && (
          <div className="flex items-center justify-center space-x-2 text-ios-green">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">持续成长中</span>
          </div>
        )}
      </div>
    </Card>
  );
};
