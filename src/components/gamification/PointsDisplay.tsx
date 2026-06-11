
import { m } from '@/paraglide/messages';
import { useState, useEffect } from 'react';
import { Star, TrendingUp, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { PointsService, UserPoints } from '@/services/PointsService';
import { logger } from '@/utils/logger';

interface PointsDisplayProps {
  userId: string;
  variant?: 'compact' | 'detailed';
  showAnimation?: boolean;
}

export const PointsDisplay = ({ userId, variant = 'compact', showAnimation = true }: PointsDisplayProps) => {
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [loading, setLoading] = useState(true);
  const [animatePoints, setAnimatePoints] = useState(false);

  useEffect(() => {
    const loadPoints = async () => {
      try {
        setLoading(true);
        const points = await PointsService.getUserPoints(userId);
        setUserPoints(points);
      } catch (error) {
        logger.error('Error loading points', error);
      } finally {
        setLoading(false);
      }
    };
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
    return <div className="animate-pulse"><div className="h-16 bg-muted rounded-storybook" /></div>;
  }
  if (!userPoints) return null;

  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-2 bg-gradient-to-r from-storybook-honey/10 to-storybook-coral/10 px-4 py-2 rounded-storybook">
        <Star className="w-5 h-5 text-storybook-honey" />
        <span className={`font-semibold text-foreground ${animatePoints ? 'animate-pulse scale-110' : ''} transition-all duration-300`}>
          {userPoints.totalPoints.toLocaleString()}
        </span>
        <span className="text-sm text-muted-foreground">{m.app_points_label()}</span>
      </div>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-storybook-honey/5 to-storybook-coral/5 border-storybook-honey/20 rounded-storybook-lg">
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-storybook-honey to-storybook-coral rounded-full flex items-center justify-center mx-auto mb-3">
          <Star className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-storybook font-semibold text-foreground mb-1">{m.app_points_myPoints()}</h3>
      </div>
      <div className="space-y-4">
        <div className="text-center">
          <div className={`text-3xl font-storybook font-bold text-storybook-honey mb-1 ${animatePoints ? 'animate-bounce' : ''} transition-all duration-300`}>
            {userPoints.totalPoints.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">{m.app_points_total()}</div>
        </div>
        <div className="flex items-center justify-between p-3 bg-card rounded-storybook">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-storybook-honey" />
            <span className="text-sm font-medium text-muted-foreground">{m.app_points_todayEarned()}</span>
          </div>
          <span className="font-semibold text-storybook-honey">+{userPoints.todayPoints}</span>
        </div>
        {userPoints.pointsHistory.length > 0 && (
          <div className="flex items-center justify-center space-x-2 text-storybook-sage">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">{m.app_points_growing()}</span>
          </div>
        )}
      </div>
    </Card>
  );
};
