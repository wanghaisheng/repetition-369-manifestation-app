import { Target, Zap, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface QuickStatsBarProps {
  todayCompleted: number;
  todayTarget: number;
  weeklyCompleted: number;
  weeklyTarget: number;
}

export const QuickStatsBar = ({
  todayCompleted,
  todayTarget,
  weeklyCompleted,
  weeklyTarget
}: QuickStatsBarProps) => {
  const { t } = useTranslation('app');
  
  const todayPercent = todayTarget > 0 ? Math.round((todayCompleted / todayTarget) * 100) : 0;
  const weeklyPercent = weeklyTarget > 0 ? Math.round((weeklyCompleted / weeklyTarget) * 100) : 0;

  const stats = [
    {
      icon: Target,
      value: `${todayCompleted}/${todayTarget}`,
      label: t('practice.todayGoal', '今日'),
      percent: todayPercent,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      icon: TrendingUp,
      value: `${weeklyPercent}%`,
      label: t('practice.weeklyGoal', '本周'),
      percent: weeklyPercent,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => (
        <Card 
          key={index}
          className="p-3 border-0 shadow-md bg-card"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${stat.bgColor}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div>
              <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
