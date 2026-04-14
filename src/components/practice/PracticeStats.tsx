
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar, Flame, Trophy, Clock } from 'lucide-react';

interface PracticeStatsProps {
  todayStats: {
    totalCompleted: number;
    totalTarget: number;
    timeSpent: number;
  };
  weeklyStats: {
    streak: number;
    completionRate: number;
  };
}

export const PracticeStats = ({ todayStats, weeklyStats }: PracticeStatsProps) => {
  const { t } = useTranslation('app');
  const todayProgress = (todayStats.totalCompleted / todayStats.totalTarget) * 100;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return mins > 0 ? t('practiceStats.minutes', { count: mins }) : t('practiceStats.seconds', { count: seconds });
  };

  const cards = [
    {
      icon: Calendar,
      gradient: 'from-storybook-honey/20 to-storybook-coral/20',
      iconBg: 'bg-storybook-honey',
      labelColor: 'text-storybook-honey',
      label: t('practiceStats.todayProgress'),
      value: `${todayStats.totalCompleted}/${todayStats.totalTarget}`,
      extra: <><Progress value={todayProgress} className="h-2 mb-2 mt-2" /><p className="text-xs text-storybook-honey">{Math.round(todayProgress)}% {t('practiceStats.complete')}</p></>
    },
    {
      icon: Flame,
      gradient: 'from-storybook-coral/20 to-storybook-honey/20',
      iconBg: 'bg-storybook-coral',
      labelColor: 'text-storybook-coral',
      label: t('practiceStats.streak'),
      value: t('practiceStats.streakDays', { count: weeklyStats.streak }),
    },
    {
      icon: Trophy,
      gradient: 'from-storybook-sage/20 to-storybook-sage/10',
      iconBg: 'bg-storybook-sage',
      labelColor: 'text-storybook-sage',
      label: t('practiceStats.weeklyRate'),
      value: `${Math.round(weeklyStats.completionRate)}%`,
    },
    {
      icon: Clock,
      gradient: 'from-storybook-blush/30 to-storybook-coral/10',
      iconBg: 'bg-storybook-coral',
      labelColor: 'text-storybook-coral',
      label: t('practiceStats.timeSpent'),
      value: formatTime(todayStats.timeSpent),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {cards.map((card, i) => (
        <Card key={i} className={`p-4 bg-gradient-to-br ${card.gradient} border-0 shadow-storybook rounded-storybook-lg`}>
          <div className="flex items-center space-x-3 mb-3">
            <div className={`w-10 h-10 ${card.iconBg} rounded-storybook flex items-center justify-center`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className={`text-sm font-medium ${card.labelColor}`}>{card.label}</p>
              <p className={`text-lg font-storybook font-bold ${card.labelColor}`}>{card.value}</p>
            </div>
          </div>
          {card.extra}
        </Card>
      ))}
    </div>
  );
};
