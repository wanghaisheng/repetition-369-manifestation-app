
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Flame, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useProgress } from '@/hooks/useProgress';

interface StreakCounterProps {
  userId: string;
  variant?: 'compact' | 'detailed';
}

export const StreakCounter = ({ userId, variant = 'compact' }: StreakCounterProps) => {
  const { t } = useTranslation('app');
  const { progress, loading } = useProgress(userId);
  const [animateStreak, setAnimateStreak] = useState(false);

  useEffect(() => {
    if (progress && progress.consecutiveDays > 0) {
      setAnimateStreak(true);
      const timer = setTimeout(() => setAnimateStreak(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [progress?.consecutiveDays]);

  if (loading) return <div className="animate-pulse"><div className="h-16 bg-muted rounded-storybook" /></div>;
  if (!progress) return null;

  const getStreakLevel = (days: number) => {
    if (days >= 30) return { color: 'text-storybook-honey', bgColor: 'from-storybook-honey to-storybook-coral' };
    if (days >= 21) return { color: 'text-storybook-coral', bgColor: 'from-storybook-coral to-storybook-honey' };
    if (days >= 7) return { color: 'text-storybook-honey', bgColor: 'from-storybook-honey to-storybook-sage' };
    if (days >= 3) return { color: 'text-storybook-sage', bgColor: 'from-storybook-sage to-storybook-honey' };
    return { color: 'text-muted-foreground', bgColor: 'from-muted-foreground to-muted-foreground/50' };
  };

  const streakInfo = getStreakLevel(progress.consecutiveDays);

  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-2 bg-gradient-to-r from-storybook-coral/10 to-storybook-honey/10 px-4 py-2 rounded-storybook">
        <Flame className={`w-5 h-5 ${streakInfo.color} ${animateStreak ? 'animate-pulse' : ''}`} />
        <span className={`font-semibold text-foreground ${animateStreak ? 'animate-bounce' : ''} transition-all duration-300`}>
          {progress.consecutiveDays}
        </span>
        <span className="text-sm text-muted-foreground">{t('streak.dayStreak')}</span>
      </div>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-storybook-coral/5 to-storybook-honey/5 border-storybook-coral/20 rounded-storybook-lg">
      <div className="text-center mb-4">
        <div className={`w-16 h-16 bg-gradient-to-br ${streakInfo.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
          <Flame className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-storybook font-semibold text-foreground mb-1">{t('streak.record')}</h3>
      </div>
      <div className="space-y-4">
        <div className="text-center">
          <div className={`text-3xl font-storybook font-bold ${streakInfo.color} mb-1 ${animateStreak ? 'animate-bounce' : ''} transition-all duration-300`}>
            {progress.consecutiveDays}
          </div>
          <div className="text-sm text-muted-foreground">{t('streak.consecutiveDays')}</div>
        </div>
        <div className="flex items-center justify-between p-3 bg-card rounded-storybook">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-storybook-honey" />
            <span className="text-sm font-medium text-muted-foreground">{t('streak.longestRecord')}</span>
          </div>
          <span className="font-semibold text-storybook-honey">{progress.longestStreak} {t('streak.days')}</span>
        </div>
        {progress.consecutiveDays < 30 && (
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-2">{t('streak.nextMilestone')}</div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className={`h-2 rounded-full bg-gradient-to-r ${streakInfo.bgColor} transition-all duration-300`}
                style={{ width: `${(progress.consecutiveDays % 7) / 7 * 100}%` }} />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {t('streak.daysUntilNext', { days: 7 - (progress.consecutiveDays % 7) })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
