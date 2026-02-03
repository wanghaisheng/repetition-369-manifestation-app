import { Trophy, Calendar, Award, Activity, TrendingUp, Star, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Achievement } from '@/services/AchievementService';

interface AchievementsGridProps {
  achievements: Achievement[];
  consecutiveDays: number;
  achievedWishes: number;
  totalSessions: number;
  longestStreak: number;
}

export const AchievementsGrid = ({
  achievements,
  consecutiveDays,
  achievedWishes,
  totalSessions,
  longestStreak
}: AchievementsGridProps) => {
  const { t } = useTranslation('app');

  // Define achievement badges with unlock conditions
  const badges = [
    {
      id: 'streak-7',
      icon: Calendar,
      name: t('progress.badges.streak7', '连续7天'),
      unlocked: consecutiveDays >= 7,
      gradient: 'from-emerald-500 to-green-600',
      lockedBg: 'bg-muted'
    },
    {
      id: 'first-wish',
      icon: Award,
      name: t('progress.badges.firstWish', '首个愿望'),
      unlocked: achievedWishes > 0,
      gradient: 'from-amber-500 to-orange-600',
      lockedBg: 'bg-muted'
    },
    {
      id: 'practice-100',
      icon: Activity,
      name: t('progress.badges.practice100', '练习达人'),
      unlocked: totalSessions >= 100,
      gradient: 'from-blue-500 to-indigo-600',
      lockedBg: 'bg-muted'
    },
    {
      id: 'streak-30',
      icon: TrendingUp,
      name: t('progress.badges.streak30', '坚持大师'),
      unlocked: longestStreak >= 30,
      gradient: 'from-purple-500 to-violet-600',
      lockedBg: 'bg-muted'
    },
    {
      id: 'week-warrior',
      icon: Trophy,
      name: t('progress.badges.weekWarrior', '一周勇士'),
      unlocked: consecutiveDays >= 7 && totalSessions >= 21,
      gradient: 'from-rose-500 to-pink-600',
      lockedBg: 'bg-muted'
    },
    {
      id: 'perfect-week',
      icon: Star,
      name: t('progress.badges.perfectWeek', '完美一周'),
      unlocked: achievements.some(a => a.id === 'perfect-week' && a.unlocked),
      gradient: 'from-cyan-500 to-teal-600',
      lockedBg: 'bg-muted'
    }
  ];

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <Card className="border-0 shadow-lg bg-card overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 rounded-xl">
              <Trophy className="w-4 h-4 text-amber-500" />
            </div>
            <h3 className="font-semibold text-foreground">
              {t('progress.achievements', '成就徽章')}
            </h3>
          </div>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {unlockedCount}/{badges.length}
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {badges.map((badge) => (
            <div key={badge.id} className="text-center group">
              <div 
                className={`
                  relative w-14 h-14 rounded-2xl mx-auto mb-2 flex items-center justify-center
                  transition-all duration-300
                  ${badge.unlocked 
                    ? `bg-gradient-to-br ${badge.gradient} shadow-lg` 
                    : 'bg-muted'
                  }
                `}
              >
                {badge.unlocked ? (
                  <badge.icon className="w-6 h-6 text-white" />
                ) : (
                  <>
                    <badge.icon className="w-6 h-6 text-muted-foreground/50" />
                    <div className="absolute -bottom-1 -right-1 p-1 bg-background rounded-full shadow-sm">
                      <Lock className="w-2.5 h-2.5 text-muted-foreground" />
                    </div>
                  </>
                )}
              </div>
              <div className={`text-xs font-medium ${badge.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                {badge.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
