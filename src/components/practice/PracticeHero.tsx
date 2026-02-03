import { Sparkles, Flame, Target, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { CircularProgress } from '@/components/gamification/CircularProgress';
import { useTranslation } from 'react-i18next';

interface PracticeHeroProps {
  totalCompleted: number;
  totalTarget: number;
  currentStreak: number;
  totalPoints: number;
  level: number;
}

export const PracticeHero = ({
  totalCompleted,
  totalTarget,
  currentStreak,
  totalPoints,
  level
}: PracticeHeroProps) => {
  const { t } = useTranslation('app');
  const progress = totalTarget > 0 ? (totalCompleted / totalTarget) * 100 : 0;

  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[hsl(var(--manifest-glow))] via-[hsl(var(--manifest-aura))] to-[hsl(var(--manifest-lavender))] p-6 shadow-xl">
      {/* Animated background orbs */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white/5 rounded-full blur-xl -translate-x-1/2 -translate-y-1/2" />
      
      <div className="relative flex items-center justify-between">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-white/90" />
            <h3 className="text-lg font-semibold text-white/95">
              {t('practice.todayJourney', '今日修行')}
            </h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-white">
                {totalCompleted}
              </span>
              <span className="text-lg text-white/70">
                / {totalTarget}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/15 rounded-full backdrop-blur-sm">
                <Flame className="w-3.5 h-3.5 text-amber-200" />
                <span className="text-white/90">{currentStreak} {t('practice.dayStreak', '天连击')}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/15 rounded-full backdrop-blur-sm">
                <Target className="w-3.5 h-3.5 text-emerald-200" />
                <span className="text-white/90">Lv.{level}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-xl scale-125" />
          <CircularProgress
            value={progress}
            size={100}
            strokeWidth={8}
            color="rgba(255,255,255,0.95)"
            backgroundColor="rgba(255,255,255,0.2)"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{Math.round(progress)}%</div>
              <div className="text-xs text-white/70">{t('practice.completed', '完成')}</div>
            </div>
          </CircularProgress>
        </div>
      </div>
    </Card>
  );
};
