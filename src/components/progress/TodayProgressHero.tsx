import { Flame, Activity, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { CircularProgress } from '@/components/gamification/CircularProgress';
import { useTranslation } from 'react-i18next';

interface TodayProgressHeroProps {
  todayProgress: number;
  todayCompletedCount: number;
  todayTargetCount: number;
  consecutiveDays: number;
  sessionsCount: number;
}

export const TodayProgressHero = ({
  todayProgress,
  todayCompletedCount,
  todayTargetCount,
  consecutiveDays,
  sessionsCount
}: TodayProgressHeroProps) => {
  const { t } = useTranslation('app');

  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[hsl(var(--manifest-glow))] via-[hsl(var(--manifest-aura))] to-[hsl(var(--manifest-lavender))] p-6 shadow-xl">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative flex items-center justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-white/90" />
            <h3 className="text-lg font-semibold text-white/95">
              {t('progress.todayCompletion', '今日完成度')}
            </h3>
          </div>
          
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-white">
              {Math.round(todayProgress)}%
            </span>
            <span className="text-sm text-white/70 bg-white/10 px-2 py-0.5 rounded-full">
              {todayCompletedCount}/{todayTargetCount}
            </span>
          </div>
          
          <div className="flex items-center gap-5 text-sm text-white/80">
            <div className="flex items-center gap-1.5">
              <div className="p-1 bg-white/20 rounded-full">
                <Flame className="w-3.5 h-3.5 text-amber-200" />
              </div>
              <span>{consecutiveDays} {t('progress.days', '天')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="p-1 bg-white/20 rounded-full">
                <Activity className="w-3.5 h-3.5 text-emerald-200" />
              </div>
              <span>{sessionsCount} {t('progress.sessions', '场')}</span>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-xl scale-110" />
          <CircularProgress
            value={todayProgress}
            size={88}
            strokeWidth={7}
            color="rgba(255,255,255,0.95)"
            backgroundColor="rgba(255,255,255,0.2)"
          >
            <div className="text-center">
              <div className="text-xl font-bold text-white">{sessionsCount}</div>
              <div className="text-xs text-white/70">{t('progress.sessions', '场')}</div>
            </div>
          </CircularProgress>
        </div>
      </div>
    </Card>
  );
};
