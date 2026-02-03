import { Calendar, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from 'react-i18next';

interface WeeklyProgressCardProps {
  todayProgress: number;
  todayCompletedCount: number;
  todayTargetCount: number;
  sessionsCount: number;
  weeklyProgress: number;
  weeklyCompleted: number;
  weeklyTarget: number;
}

export const WeeklyProgressCard = ({
  todayProgress,
  todayCompletedCount,
  todayTargetCount,
  sessionsCount,
  weeklyProgress,
  weeklyCompleted,
  weeklyTarget
}: WeeklyProgressCardProps) => {
  const { t } = useTranslation('app');

  return (
    <Card className="border-0 shadow-lg bg-card overflow-hidden">
      {/* Today Section */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">
              {t('progress.todayProgress', '今日进度')}
            </h3>
          </div>
          <span className="text-sm font-medium text-primary">
            {Math.round(todayProgress)}%
          </span>
        </div>
        
        <Progress value={todayProgress} className="h-2.5 mb-4" />
        
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 bg-primary/5 rounded-xl">
            <div className="text-lg font-bold text-primary">{todayCompletedCount}</div>
            <div className="text-xs text-muted-foreground">{t('progress.completed', '已完成')}</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded-xl">
            <div className="text-lg font-bold text-muted-foreground">{todayTargetCount}</div>
            <div className="text-xs text-muted-foreground">{t('progress.target', '目标')}</div>
          </div>
          <div className="text-center p-2 bg-amber-500/10 rounded-xl">
            <div className="text-lg font-bold text-amber-600">{sessionsCount}</div>
            <div className="text-xs text-muted-foreground">{t('progress.sessions', '场次')}</div>
          </div>
        </div>
      </div>

      {/* Weekly Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <h3 className="font-semibold text-foreground">
              {t('progress.weeklyStats', '本周统计')}
            </h3>
          </div>
          <span className="text-xs text-muted-foreground">
            {weeklyCompleted}/{weeklyTarget}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {t('progress.weekProgress', '周进度')}
            </span>
            <span className="text-xs font-medium text-emerald-500">
              {Math.round(weeklyProgress)}%
            </span>
          </div>
          <Progress value={weeklyProgress} className="h-2" />
        </div>
      </div>
    </Card>
  );
};
