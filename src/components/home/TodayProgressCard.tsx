import { Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from 'react-i18next';

interface TodayProgressCardProps {
  todayProgress: number;
  activeWishesCount: number;
  todayPracticesCount: number;
  consecutiveDays: number;
}

export const TodayProgressCard = ({
  todayProgress,
  activeWishesCount,
  todayPracticesCount,
  consecutiveDays,
}: TodayProgressCardProps) => {
  const { t } = useTranslation('app');

  return (
    <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/50 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Target className="w-4.5 h-4.5 text-primary" />
          </div>
          <span className="font-semibold text-foreground">{t('home.todayProgress')}</span>
        </div>
        <span className="text-2xl font-bold text-foreground">
          {Math.round(todayProgress)}%
        </span>
      </div>
      
      {/* Progress bar */}
      <Progress value={todayProgress} className="h-2 mb-5" />
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatItem value={activeWishesCount} label={t('home.activeWishes')} color="text-primary" />
        <StatItem value={todayPracticesCount} label={t('home.todayPractices')} color="text-amber-500" />
        <StatItem value={consecutiveDays} label={t('home.consecutiveDays')} color="text-emerald-500" />
      </div>
    </div>
  );
};

const StatItem = ({ 
  value, 
  label, 
  color 
}: { 
  value: number; 
  label: string; 
  color: string;
}) => (
  <div className="text-center">
    <div className={`text-xl font-bold ${color}`}>{value}</div>
    <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
  </div>
);
